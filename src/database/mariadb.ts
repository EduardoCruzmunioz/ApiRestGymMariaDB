import mariadb from "mariadb";
import type { Pool, PoolConnection } from "mariadb";
import { env } from "../config/env";
import type { Workout, WorkoutRecord, Database } from "../types/workout";
import { readFileSync, existsSync } from "fs";
import path from "path";

export const pool: Pool = mariadb.createPool({
  host: env.mariadb.host,
  port: env.mariadb.port,
  user: env.mariadb.user,
  password: env.mariadb.password,
  database: env.mariadb.database,
  connectionLimit: 5,
  dateStrings: true,
});

export async function initDb(): Promise<void> {
  let conn: PoolConnection | undefined;
  try {
    conn = await pool.getConnection();
    console.log(`Conectado a MariaDB (${env.mariadb.host}:${env.mariadb.port} / ${env.mariadb.database})`);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS workouts (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        mode VARCHAR(100) NOT NULL,
        equipment LONGTEXT NOT NULL,
        exercises LONGTEXT NOT NULL,
        trainerTips LONGTEXT NOT NULL,
        createdAt VARCHAR(50) NOT NULL,
        updatedAt VARCHAR(50) NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS records (
        id VARCHAR(36) PRIMARY KEY,
        workout VARCHAR(36) NOT NULL,
        record VARCHAR(100) NOT NULL,
        memberId VARCHAR(36),
        member VARCHAR(150)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    const countRows: any[] = await conn.query("SELECT COUNT(*) AS total FROM workouts");
    const totalWorkouts = Number(countRows[0]?.total || 0);

    if (totalWorkouts === 0) {
      const dbJsonPath = path.resolve(import.meta.dirname, "../../data/db.json");
      if (existsSync(dbJsonPath)) {
        try {
          const raw = readFileSync(dbJsonPath, "utf-8");
          const db: Database = JSON.parse(raw);

          if (db.workouts && db.workouts.length > 0) {
            for (const w of db.workouts) {
              await conn.query(
                `INSERT INTO workouts (id, name, mode, equipment, exercises, trainerTips, createdAt, updatedAt)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                  w.id,
                  w.name,
                  w.mode,
                  JSON.stringify(w.equipment || []),
                  JSON.stringify(w.exercises || []),
                  JSON.stringify(w.trainerTips || []),
                  w.createdAt || Date.now().toString(),
                  w.updatedAt || Date.now().toString(),
                ]
              );
            }
          }

          if (db.records && db.records.length > 0) {
            for (const r of db.records) {
              const memberStr = typeof r.member === "string" ? r.member : r.member?.name || null;
              await conn.query(
                `INSERT INTO records (id, workout, record, memberId, member)
                 VALUES (?, ?, ?, ?, ?)`,
                [r.id, r.workout, r.record, r.memberId || null, memberStr]
              );
            }
          }
        } catch (e: any) {
          console.warn("Aviso durante la carga de datos iniciales:", e.message);
        }
      }
    }
  } catch (error) {
    console.error("Error al conectar a MariaDB:", error);
    throw error;
  } finally {
    if (conn) conn.release();
  }
}

function parseWorkoutRow(row: any): Workout {
  return {
    id: row.id,
    name: row.name,
    mode: row.mode,
    equipment: typeof row.equipment === "string" ? JSON.parse(row.equipment) : row.equipment || [],
    exercises: typeof row.exercises === "string" ? JSON.parse(row.exercises) : row.exercises || [],
    trainerTips: typeof row.trainerTips === "string" ? JSON.parse(row.trainerTips) : row.trainerTips || [],
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function getAllWorkoutsFromDB(): Promise<Workout[]> {
  const rows: any[] = await pool.query(
    "SELECT id, name, mode, equipment, exercises, trainerTips, createdAt, updatedAt FROM workouts"
  );
  return rows.map(parseWorkoutRow);
}

export async function getWorkoutByIdFromDB(id: string): Promise<Workout | null> {
  const rows: any[] = await pool.query(
    "SELECT id, name, mode, equipment, exercises, trainerTips, createdAt, updatedAt FROM workouts WHERE id = ? LIMIT 1",
    [id]
  );
  if (rows && rows.length > 0) {
    return parseWorkoutRow(rows[0]);
  }
  return null;
}

export async function createWorkoutInDB(workout: Workout): Promise<Workout> {
  await pool.query(
    `INSERT INTO workouts (id, name, mode, equipment, exercises, trainerTips, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      workout.id,
      workout.name,
      workout.mode,
      JSON.stringify(workout.equipment || []),
      JSON.stringify(workout.exercises || []),
      JSON.stringify(workout.trainerTips || []),
      workout.createdAt,
      workout.updatedAt,
    ]
  );
  return workout;
}

export async function updateWorkoutInDB(workout: Workout): Promise<Workout> {
  await pool.query(
    `UPDATE workouts SET name = ?, mode = ?, equipment = ?, exercises = ?, trainerTips = ?, updatedAt = ?
     WHERE id = ?`,
    [
      workout.name,
      workout.mode,
      JSON.stringify(workout.equipment || []),
      JSON.stringify(workout.exercises || []),
      JSON.stringify(workout.trainerTips || []),
      workout.updatedAt,
      workout.id,
    ]
  );
  return workout;
}

export async function deleteWorkoutFromDB(id: string): Promise<boolean> {
  const result: any = await pool.query("DELETE FROM workouts WHERE id = ?", [id]);
  return Number(result.affectedRows) > 0;
}

function parseRecordRow(row: any): WorkoutRecord {
  return {
    id: row.id,
    workout: row.workout,
    record: row.record,
    memberId: row.memberId || undefined,
    member: row.member || undefined,
  };
}

export async function getAllRecordsFromDB(): Promise<WorkoutRecord[]> {
  const rows: any[] = await pool.query(
    "SELECT id, workout, record, memberId, member FROM records"
  );
  return rows.map(parseRecordRow);
}

export async function getRecordByIdFromDB(id: string): Promise<WorkoutRecord | null> {
  const rows: any[] = await pool.query(
    "SELECT id, workout, record, memberId, member FROM records WHERE id = ? LIMIT 1",
    [id]
  );
  if (rows && rows.length > 0) {
    return parseRecordRow(rows[0]);
  }
  return null;
}

export async function createRecordInDB(record: WorkoutRecord): Promise<WorkoutRecord> {
  const memberStr = typeof record.member === "string" ? record.member : record.member?.name || null;
  await pool.query(
    `INSERT INTO records (id, workout, record, memberId, member)
     VALUES (?, ?, ?, ?, ?)`,
    [record.id, record.workout, record.record, record.memberId || null, memberStr]
  );
  return record;
}

export async function updateRecordInDB(record: WorkoutRecord): Promise<WorkoutRecord> {
  const memberStr = typeof record.member === "string" ? record.member : record.member?.name || null;
  await pool.query(
    `UPDATE records SET workout = ?, record = ?, memberId = ?, member = ?
     WHERE id = ?`,
    [record.workout, record.record, record.memberId || null, memberStr, record.id]
  );
  return record;
}

export async function deleteRecordFromDB(id: string): Promise<boolean> {
  const result: any = await pool.query("DELETE FROM records WHERE id = ?", [id]);
  return Number(result.affectedRows) > 0;
}

import {
  getAllRecordsFromDB,
  getRecordByIdFromDB,
  createRecordInDB,
  updateRecordInDB,
  deleteRecordFromDB,
} from "../database/mariadb";
import type { WorkoutRecord } from "../types/workout";
import { v4 as uuid } from "uuid";
import { toHttpError } from "../utils/httpError";

export async function getAllRecords(): Promise<WorkoutRecord[]> {
  try {
    return await getAllRecordsFromDB();
  } catch (error) {
    throw toHttpError(error);
  }
}

export async function getRecord(id: string): Promise<WorkoutRecord | null> {
  try {
    return await getRecordByIdFromDB(id);
  } catch (error) {
    throw toHttpError(error);
  }
}

export async function postRecord(
  record: WorkoutRecord
): Promise<WorkoutRecord> {
  try {
    const id: string = uuid();
    record.id = id;
    return await createRecordInDB(record);
  } catch (error) {
    throw toHttpError(error);
  }
}

export async function patchRecord(
  record: WorkoutRecord
): Promise<WorkoutRecord> {
  try {
    const recordAnt: WorkoutRecord | null = await getRecord(record.id);
    if (!recordAnt) {
      throw new Error(`Record with id '${record.id}' not found`);
    }
    if (record.workout == null) record.workout = recordAnt.workout;
    if (record.record == null) record.record = recordAnt.record;
    if (record.memberId == null) record.memberId = recordAnt.memberId;
    if (record.member == null) record.member = recordAnt.member;
    return await updateRecordInDB(record);
  } catch (error) {
    throw toHttpError(error);
  }
}

export async function deleteRecord(id: string): Promise<boolean> {
  try {
    const existing = await getRecord(id);
    if (!existing) {
      throw new Error(`Record with id '${id}' not found`);
    }
    return await deleteRecordFromDB(id);
  } catch (error) {
    throw toHttpError(error);
  }
}

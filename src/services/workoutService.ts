import {
  getAllWorkoutsFromDB,
  getWorkoutByIdFromDB,
  createWorkoutInDB,
  updateWorkoutInDB,
  deleteWorkoutFromDB,
} from "../database/mariadb";
import type { Workout } from "../types/workout";
import { v4 as uuid } from "uuid";
import { toHttpError } from "../utils/httpError";

export * from "./recordService";

export async function getAllWorkouts(): Promise<Workout[]> {
  try {
    return await getAllWorkoutsFromDB();
  } catch (error) {
    throw toHttpError(error);
  }
}

export async function getWorkout(id: string): Promise<Workout | null> {
  try {
    return await getWorkoutByIdFromDB(id);
  } catch (error) {
    throw toHttpError(error);
  }
}

export async function postWorkout(workout: Workout): Promise<Workout> {
  try {
    const id: string = uuid();
    const timestamp = Date.now().toString();
    workout.id = id;
    workout.createdAt = timestamp;
    workout.updatedAt = timestamp;
    return await createWorkoutInDB(workout);
  } catch (error) {
    throw toHttpError(error);
  }
}

export async function patchWorkout(workout: Workout): Promise<Workout> {
  try {
    workout.updatedAt = Date.now().toString();
    const workoutAnt: Workout | null = await getWorkout(workout.id);
    if (!workoutAnt) {
      throw new Error(`Workout with id '${workout.id}' not found`);
    }
    if (workout.equipment == null) workout.equipment = workoutAnt.equipment;
    if (workout.exercises == null) workout.exercises = workoutAnt.exercises;
    if (workout.name == null) workout.name = workoutAnt.name;
    if (workout.mode == null) workout.mode = workoutAnt.mode;
    if (workout.trainerTips == null)
      workout.trainerTips = workoutAnt.trainerTips;
    workout.createdAt = workoutAnt.createdAt;

    return await updateWorkoutInDB(workout);
  } catch (error) {
    throw toHttpError(error);
  }
}

export async function deleteWorkout(id: string): Promise<boolean> {
  try {
    const existing = await getWorkout(id);
    if (!existing) {
      throw new Error(`Workout with id '${id}' not found`);
    }
    return await deleteWorkoutFromDB(id);
  } catch (error) {
    throw toHttpError(error);
  }
}

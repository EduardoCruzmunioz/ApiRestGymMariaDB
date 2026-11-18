import type { Request, Response } from "express";
import * as workoutService from "../services/workoutService";
import * as recordService from "../services/recordService";
import type { Filtros, FiltrosRecord, Workout, WorkoutRecord } from "../types/workout";
import { toHttpError } from "../utils/httpError";

const MIN_LIMIT = 1;

export async function getAllWorkouts(request: Request, response: Response): Promise<void> {
  try {
    const { mode, equipment, exercise, trainerTips, limit } =
      request.query as unknown as Filtros;

    const parsedLimit = limit == undefined ? undefined : Number(limit);
    if (
      parsedLimit != undefined &&
      (!Number.isInteger(parsedLimit) || parsedLimit < MIN_LIMIT)
    ) {
      response.status(400).send({
        status: "fail",
        data: "limit must be a positive integer",
      });
      return;
    }

    let workouts: Workout[] = await workoutService.getAllWorkouts();

    if (mode) {
      workouts = workouts.filter(
        (workout) => workout.mode.toLowerCase() === mode.toLowerCase()
      );
    }

    if (equipment) {
      workouts = workouts.filter((workout) =>
        workout.equipment.some((eq) =>
          eq.toLowerCase().includes(equipment.toLowerCase())
        )
      );
    }

    if (exercise) {
      workouts = workouts.filter((workout) =>
        workout.exercises.some((ex) =>
          ex.toLowerCase().includes(exercise.toLowerCase())
        )
      );
    }

    if (trainerTips) {
      workouts = workouts.filter((workout) =>
        workout.trainerTips.some((tip) =>
          tip.toLowerCase().includes(trainerTips.toLowerCase())
        )
      );
    }

    if (parsedLimit) {
      workouts = workouts.slice(0, parsedLimit);
    }

    response.send({
      status: "ok",
      data: workouts,
    });
  } catch (error: any) {
    const httpError = toHttpError(error);
    response.status(httpError.status).send({
      status: "fail",
      data: httpError.message,
    });
  }
}

export async function getWorkouts(request: Request, response: Response): Promise<void> {
  const id = request.params.id;
  if (!id) {
    response.status(400).send({
      status: "fail",
      data: "Bad request",
    });
    return;
  }

  try {
    const workout = await workoutService.getWorkout(id.toString());
    if (!workout) {
      response.status(404).send({
        status: "fail",
        data: `Workout with id '${id}' not found`,
      });
      return;
    }

    response.send({
      status: "ok",
      data: workout,
    });
  } catch (error: any) {
    const httpError = toHttpError(error);
    response.status(httpError.status).send({
      status: "fail",
      data: httpError.message,
    });
  }
}

export const getWorkout = getWorkouts;

export async function postWorkout(request: Request, response: Response): Promise<void> {
  const body: Workout = request.body ?? {};

  if (
    !body.name ||
    !body.exercises ||
    !body.equipment ||
    !body.mode ||
    !body.trainerTips
  ) {
    response.status(400).send({
      status: "fail",
      data: "Bad request",
    });
    return;
  }

  try {
    const createdWorkout = await workoutService.postWorkout(body);
    response.status(201).send({
      status: "ok",
      data: createdWorkout,
    });
  } catch (error: any) {
    const httpError = toHttpError(error);
    response.status(httpError.status).send({
      status: "fail",
      data: httpError.message,
    });
  }
}

export async function patchWorkout(request: Request, response: Response): Promise<void> {
  const id = request.params.id;
  if (!id) {
    response.status(400).send({
      status: "fail",
      data: "Bad request",
    });
    return;
  }

  const body: Workout = request.body ?? {};
  if (body.id != null || body.createdAt != null) {
    response.status(400).send({
      status: "fail",
      data: "Bad request",
    });
    return;
  }

  try {
    body.id = id.toString();
    const updatedWorkout = await workoutService.patchWorkout(body);
    response.status(201).send({
      status: "ok",
      data: updatedWorkout,
    });
  } catch (error: any) {
    const httpError = toHttpError(error);
    response.status(httpError.status).send({
      status: "fail",
      data: httpError.message,
    });
  }
}

export async function deleteWorkout(request: Request, response: Response): Promise<void> {
  const id = request.params.id;
  if (!id) {
    response.status(400).send({
      status: "fail",
      data: "Bad request",
    });
    return;
  }

  try {
    const result = await workoutService.deleteWorkout(id.toString());
    response.send({
      status: "ok",
      data: result,
    });
  } catch (error: any) {
    const httpError = toHttpError(error);
    response.status(httpError.status).send({
      status: "fail",
      data: httpError.message,
    });
  }
}

export async function getAllRecords(request: Request, response: Response): Promise<void> {
  try {
    const { workout, record, memberId, member, limit } =
      request.query as unknown as FiltrosRecord;

    const parsedLimit = limit == undefined ? undefined : Number(limit);
    if (
      parsedLimit != undefined &&
      (!Number.isInteger(parsedLimit) || parsedLimit < MIN_LIMIT)
    ) {
      response.status(400).send({
        status: "fail",
        data: "limit must be a positive integer",
      });
      return;
    }

    let records: WorkoutRecord[] = await recordService.getAllRecords();

    if (workout) {
      records = records.filter(
        (rec) => rec.workout.toLowerCase() === workout.toLowerCase()
      );
    }

    if (record) {
      records = records.filter((rec) =>
        rec.record.toLowerCase().includes(record.toLowerCase())
      );
    }

    if (memberId) {
      records = records.filter(
        (rec) =>
          rec.memberId != null &&
          rec.memberId.toLowerCase() === memberId.toLowerCase()
      );
    }

    if (member) {
      records = records.filter((rec) => {
        if (!rec.member) return false;
        if (typeof rec.member === "string") {
          return rec.member.toLowerCase().includes(member.toLowerCase());
        }
        return rec.member.name.toLowerCase().includes(member.toLowerCase());
      });
    }

    if (parsedLimit) {
      records = records.slice(0, parsedLimit);
    }

    response.send({
      status: "ok",
      data: records,
    });
  } catch (error: any) {
    const httpError = toHttpError(error);
    response.status(httpError.status).send({
      status: "fail",
      data: httpError.message,
    });
  }
}

export async function getRecord(request: Request, response: Response): Promise<void> {
  const id = request.params.id;
  if (!id) {
    response.status(400).send({
      status: "fail",
      data: "Bad request",
    });
    return;
  }

  try {
    const record = await recordService.getRecord(id.toString());
    if (!record) {
      response.status(404).send({
        status: "fail",
        data: `Record with id '${id}' not found`,
      });
      return;
    }

    response.send({
      status: "ok",
      data: record,
    });
  } catch (error: any) {
    const httpError = toHttpError(error);
    response.status(httpError.status).send({
      status: "fail",
      data: httpError.message,
    });
  }
}

export const getRecords = getRecord;

export async function postRecord(request: Request, response: Response): Promise<void> {
  const body: WorkoutRecord = request.body ?? {};

  if (!body.workout || !body.record) {
    response.status(400).send({
      status: "fail",
      data: "Bad request",
    });
    return;
  }

  try {
    const createdRecord = await recordService.postRecord(body);
    response.status(201).send({
      status: "ok",
      data: createdRecord,
    });
  } catch (error: any) {
    const httpError = toHttpError(error);
    response.status(httpError.status).send({
      status: "fail",
      data: httpError.message,
    });
  }
}

export async function patchRecord(request: Request, response: Response): Promise<void> {
  const id = request.params.id;
  if (!id) {
    response.status(400).send({
      status: "fail",
      data: "Bad request",
    });
    return;
  }

  const body: WorkoutRecord = request.body ?? {};
  if (body.id != null) {
    response.status(400).send({
      status: "fail",
      data: "Bad request",
    });
    return;
  }

  try {
    body.id = id.toString();
    const updatedRecord = await recordService.patchRecord(body);
    response.status(201).send({
      status: "ok",
      data: updatedRecord,
    });
  } catch (error: any) {
    const httpError = toHttpError(error);
    response.status(httpError.status).send({
      status: "fail",
      data: httpError.message,
    });
  }
}

export async function deleteRecord(request: Request, response: Response): Promise<void> {
  const id = request.params.id;
  if (!id) {
    response.status(400).send({
      status: "fail",
      data: "Bad request",
    });
    return;
  }

  try {
    const result = await recordService.deleteRecord(id.toString());
    response.send({
      status: "ok",
      data: result,
    });
  } catch (error: any) {
    const httpError = toHttpError(error);
    response.status(httpError.status).send({
      status: "fail",
      data: httpError.message,
    });
  }
}

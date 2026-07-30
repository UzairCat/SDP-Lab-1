"use server";

import { revalidatePath } from "next/cache";
import { archiveTask, createTask, updateTask } from "./service";
import { type TaskStatus, taskStatuses } from "../db/schema";

export type TaskFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function createTaskAction(
  _previousState: TaskFormState,
  formData: FormData,
): Promise<TaskFormState> {
  try {
    createTask({
      title: getFormValue(formData, "title"),
      description: getFormValue(formData, "description"),
      dueDate: getFormValue(formData, "dueDate"),
      topic: getFormValue(formData, "topic"),
      status: getTaskStatus(formData),
    });

    revalidatePath("/");

    return {
      status: "success",
      message: "Task created.",
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "The task could not be created.",
    };
  }
}

export async function updateTaskAction(
  _previousState: TaskFormState,
  formData: FormData,
): Promise<TaskFormState> {
  try {
    updateTask(getTaskId(formData), {
      title: getFormValue(formData, "title"),
      description: getFormValue(formData, "description"),
      dueDate: getFormValue(formData, "dueDate"),
      topic: getFormValue(formData, "topic"),
      status: getTaskStatus(formData),
    });

    revalidatePath("/");

    return {
      status: "success",
      message: "Task updated.",
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "The task could not be updated.",
    };
  }
}

export async function archiveTaskAction(
  _previousState: TaskFormState,
  formData: FormData,
): Promise<TaskFormState> {
  try {
    archiveTask(getTaskId(formData));
    revalidatePath("/");

    return {
      status: "success",
      message: "Task archived.",
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "The task could not be archived.",
    };
  }
}

function getFormValue(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function getTaskStatus(formData: FormData): TaskStatus {
  const value = getFormValue(formData, "status");

  if (taskStatuses.includes(value as TaskStatus)) {
    return value as TaskStatus;
  }

  return "Todo";
}

function getTaskId(formData: FormData) {
  const id = Number(getFormValue(formData, "id"));

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Task id is invalid.");
  }

  return id;
}

"use server";

import { revalidatePath } from "next/cache";
import { createTask } from "./service";
import { type TaskStatus, taskStatuses } from "../db/schema";

export type TaskFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialTaskFormState: TaskFormState = {
  status: "idle",
  message: "",
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

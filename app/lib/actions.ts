"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createDoc, deleteDoc, updateDoc } from "./docs-store";

function readDocInput(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    content: String(formData.get("content") ?? ""),
    author: String(formData.get("author") ?? ""),
  };
}

export async function createDocAction(formData: FormData) {
  const doc = createDoc(readDocInput(formData));

  revalidatePath("/docs");
  redirect(`/docs/${doc.id}`);
}

export async function updateDocAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  updateDoc(id, readDocInput(formData));

  revalidatePath("/docs");
  revalidatePath(`/docs/${id}`);
  redirect(`/docs/${id}`);
}

export async function deleteDocAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  deleteDoc(id);

  revalidatePath("/docs");
  redirect("/docs");
}

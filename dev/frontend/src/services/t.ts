"use server";

import { formSchema } from "./test";


export async function serverAction(formData: unknown) {
  // Validate the input with Zod
  const parsed = formSchema.safeParse(formData);

  if (!parsed.success) {
    console.error("❌ Validation failed:", parsed.error.format());
    return {
      success: false,
      message: "Invalid form data",
      errors: parsed.error.flatten(),
    };
  }

  // Mock processing (e.g. DB insert, API call)
  console.log("📩 Received form data:", parsed.data);

  // Simulate async work
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    success: true,
    message: "Form submitted successfully (mock server response)",
    data: parsed.data, // echo back the validated data
  };
}

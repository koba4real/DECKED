import type { FormError } from "@nuxt/ui";
import type { ZodError } from "zod";

export default function sendZodError(error: ZodError): never {
  throw createError({
    statusCode: 422,
    statusMessage: "Validation failed",
    data: error.issues.map<FormError>(issue => ({
      name: String(issue.path[0]),
      message: issue.message,
    })),
  });
}

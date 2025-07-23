import * as z from "zod";
import { validatorTypes } from "@/types";

export const validator = ({ schema, body }: validatorTypes) => {
  try {
    const result = schema.parse(body);
    return result;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(
        `Validation failed: ${error.issues
          .map((e: any) => e.message)
          .join(", ")}`
      );
    }
    throw new Error("Validation failed");
  }
};

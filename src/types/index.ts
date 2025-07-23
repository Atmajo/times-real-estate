import * as z from "zod";

export interface validatorTypes {
  schema: z.ZodSchema<any>;
  body: any;
}


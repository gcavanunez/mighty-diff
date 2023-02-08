import { z } from "zod";
export const literalSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
]);
type Literal = z.infer<typeof literalSchema>;
export type Json = Literal | { [key: string]: Json } | Json[];
export const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)])
);

export const entryShapes = {
  create: z.object({
    diffable_id: z.string(),
    entry_at: z.string(),
    content: z.object({ key: z.string(), data: jsonSchema }).array(),
  }),
};

import { z } from "zod";

export const editShowSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  genres: z.array(z.string()).optional(),

  image: z.string().optional(),
});

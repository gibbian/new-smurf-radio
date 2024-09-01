import { z } from "zod";

export const djProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().max(500, "Bio must be 500 characters or less").optional(),
  instagramLink: z.string().url("Must be a valid URL").optional(),
  twitterLink: z.string().url("Must be a valid URL").optional(),
  spotifyLink: z.string().url("Must be a valid URL").optional(),
});

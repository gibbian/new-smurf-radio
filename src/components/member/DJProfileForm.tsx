"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "sonner";

const djProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().max(500, "Bio must be 500 characters or less").optional(),
  instagramLink: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
  twitterLink: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
  spotifyLink: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
});

type DJProfileFormData = z.infer<typeof djProfileSchema>;

interface DJProfileFormProps {
  initialData: {
    id: string;
    name: string;
    bio?: string | null;
    instagramLink?: string;
    twitterLink?: string;
    spotifyLink?: string;
  };
}

export function DJProfileForm({ initialData }: DJProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DJProfileFormData>({
    resolver: zodResolver(djProfileSchema),
    defaultValues: {
      name: initialData.name,
      bio: initialData.bio ?? "",
      instagramLink: initialData.instagramLink ?? "",
      twitterLink: initialData.twitterLink ?? "",
      spotifyLink: initialData.spotifyLink ?? "",
    },
  });

  const updateProfileMutation = api.djs.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile updated successfully");
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast.error(`Error updating profile: ${error.message}`);
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: DJProfileFormData) => {
    setIsSubmitting(true);
    updateProfileMutation.mutate({ djId: initialData.id, ...data });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Name
        </label>
        <Input id="name" {...register("name")} className="mt-1" />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium">
          Bio
        </label>
        <Textarea id="bio" {...register("bio")} className="mt-1" rows={4} />
        {errors.bio && (
          <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-medium">Social Links</h3>
        <div className="mt-2 space-y-4">
          <div>
            <label htmlFor="instagram" className="block text-sm font-medium">
              Instagram
            </label>
            <Input
              id="instagram"
              {...register("instagramLink")}
              className="mt-1"
            />
            {errors.instagramLink && (
              <p className="mt-1 text-sm text-red-600">
                {errors.instagramLink.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="twitter" className="block text-sm font-medium">
              Twitter
            </label>
            <Input id="twitter" {...register("twitterLink")} className="mt-1" />
            {errors.twitterLink && (
              <p className="mt-1 text-sm text-red-600">
                {errors.twitterLink.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="spotify" className="block text-sm font-medium">
              Spotify
            </label>
            <Input id="spotify" {...register("spotifyLink")} className="mt-1" />
            {errors.spotifyLink && (
              <p className="mt-1 text-sm text-red-600">
                {errors.spotifyLink.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Updating..." : "Update Profile"}
      </Button>
    </form>
  );
}

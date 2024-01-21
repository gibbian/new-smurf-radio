import { z } from "zod";

const showResponseSchema = z.object({
  data: z.object({}),
  included: z.array(
    z.object({
      attributes: z.object({
        progressive_stream_url: z.string().optional(),
      }),
    }),
  ),
});

export const getShow = async () => {
  const response = await fetch(
    "https://api.mixlr.com/v3/channel_view/koinonia-global-radio",
  );

  if (response.status != 200) {
    console.error("Failed to fetch show");
    console.log(await response.json());
    throw new Error("Failed to fetch show");
  }

  const data = (await response.json()) as unknown;
  console.log("DATA: ", data);
  const showData = showResponseSchema.parse(data);

  if (!showData.included) {
    return null;
  }

  const streamUrl = showData.included.at(0)?.attributes.progressive_stream_url;

  if (!streamUrl) {
    return null;
  }
  return streamUrl;
};

import { z } from "zod";
import { env } from "~/env";

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

const iceCastResponseSchema = z.object({
  icestats: z.object({
    admin: z.string(),
    host: z.string(),
    location: z.string(),
    server_id: z.string(),
    source: z
      .object({
        // genre: "various",
        // listener_peak: 2,
        // listeners: 0,
        listenurl: z.string(),
        // server_description: "Unspecified description",
        // server_name: "no name",
        // server_type: "audio/mpeg",
        // stream_start: "Mon, 22 Jan 2024 03:07:05 +0000",
        // stream_start_iso8601: "2024-01-22T03:07:05+0000",
        // dummy: null,
      })
      .optional(),
  }),
});

const getIcecast = async (): Promise<z.infer<
  typeof iceCastResponseSchema
> | null> => {
  try {
    console.log(env.ICE_URL);
    const iceResponse = await fetch(env.ICE_URL + "/status-json.xsl");
    console.log("GOT ICECAST");

    if (iceResponse.status != 200) {
      console.error("Failed to fetch icecast");
      console.log(await iceResponse.json());
      throw new Error("Failed to fetch icecast");
    }

    const iceData = (await iceResponse.json()) as unknown;
    console.log("ICE DATA: ", iceData);
    const iceDataParsed = iceCastResponseSchema.parse(iceData);
    if (!iceDataParsed.icestats.source) {
      return null;
    }
    return iceDataParsed;
  } catch (err) {
    return null;
  }
};

export const getShow = async () => {
  const icecast = await getIcecast();
  if (icecast?.icestats.source) {
    console.log("ICECAST: ", icecast.icestats.source);
    return "https://listen.drewh.net/shuffle";
  }

  const response = await fetch(
    "https://api.mixlr.com/v3/channel_view/rccg-prayerrain-radio",
  );

  if (response.status != 200) {
    console.error("Failed to fetch show");
    console.log(await response.json());
    throw new Error("Failed to fetch show");
  }

  const data = (await response.json()) as unknown;
  // console.log("DATA: ", data);
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

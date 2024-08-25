/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type ZodSchema, type z } from "zod";

export function fn<
  Arg1 extends ZodSchema,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Callback extends (arg1: z.output<Arg1>) => any,
>(arg1: Arg1, cb: Callback) {
  const result = function (input: z.input<typeof arg1>): ReturnType<Callback> {
    const parsed = arg1.parse(input);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return cb.apply(cb, [parsed]);
  };
  result.schema = arg1;
  result.rawCb = cb as (arg1: z.output<Arg1>) => ReturnType<Callback>;
  return result;
}

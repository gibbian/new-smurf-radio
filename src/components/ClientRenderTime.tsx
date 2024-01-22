"use client";

import { format } from "date-fns";

interface ClientRenderTimeProps {
  time: Date;
  formatString: string;
}

export const ClientRenderTime = ({
  time,
  formatString,
}: ClientRenderTimeProps) => {
  return <>{format(time, formatString)}</>;
};

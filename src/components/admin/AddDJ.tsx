"use client";

import { api } from "~/trpc/react";

export const AddDJ = () => {
  const mutation = api.admin.createDJ.useMutation();

  return (
    <>
      <time>Time to add SHAD</time>
    </>
  );
};

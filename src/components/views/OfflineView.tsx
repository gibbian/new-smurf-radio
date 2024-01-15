import { api } from "~/trpc/server";
import { ShowInfo } from "../ShowInfo";

export default async function Page() {
  const nextShow = await api.shows.getNextShow.query();
  return (
    <div className="m-auto grid max-w-md flex-1 place-items-center pt-8 text-center">
      <div>
        <div>SMURF is currently offline.</div>
        <div>Next Show:</div>
        {nextShow && <ShowInfo show={nextShow}></ShowInfo>}
      </div>
    </div>
  );
}

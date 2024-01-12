import { AddDJ } from "~/components/admin/AddDJ";
import { CreateSlot } from "~/components/admin/CreateSlot";
import { DJList } from "~/components/admin/DJList";
import { QuickControlCard } from "~/components/admin/QuickControlCard";

export default async function () {
  return (
    <>
      <DJList />
      <div className="grid grid-cols-3 gap-2">
        <QuickControlCard
          title="Add DJ"
          description="Add a new DJ to the SMURF roster"
          className="col-span-3"
        >
          <AddDJ />
        </QuickControlCard>
        <QuickControlCard title="Slots" className="col-span-3">
          <CreateSlot />
        </QuickControlCard>
      </div>
    </>
  );
}

import { AddDJ } from "~/components/admin/AddDJ";
import { CreateShowManual } from "~/components/admin/CreateShowManual";
import { CreateSlot } from "~/components/admin/CreateSlot";
import { DJList } from "~/components/admin/DJList";
import { QuickControlCard } from "~/components/admin/QuickControlCard";
import { RandomButtons } from "~/components/admin/RandomButtons";

export default async function () {
  return (
    <div className="pb-8">
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
        <QuickControlCard className="col-span-3" title="Create Show Manually">
          <CreateShowManual />
        </QuickControlCard>
        <QuickControlCard>
          <RandomButtons />
        </QuickControlCard>
      </div>
    </div>
  );
}

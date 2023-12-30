import { AddDJ } from "~/components/admin/AddDJ";
import { QuickControlCard } from "~/components/admin/QuickControlCard";

export default async function () {
  return (
    <div>
      <QuickControlCard
        title="Add DJ"
        description="Add a new DJ to the SMURF roster"
      >
        <AddDJ />
      </QuickControlCard>
    </div>
  );
}

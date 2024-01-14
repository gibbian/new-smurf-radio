import { type Dispatch, type SetStateAction } from "react";
import { api } from "~/trpc/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface DJSelectProps {
  value: string | undefined;
  onChange: Dispatch<SetStateAction<string | undefined>>;
  disabled?: boolean;
}
export const DJSelect = (props: DJSelectProps) => {
  const { data: djs } = api.admin.listDJs.useQuery();
  return (
    <Select
      value={props.value}
      disabled={props.disabled}
      onValueChange={(v) => {
        props.onChange(v);
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select DJ" />
      </SelectTrigger>
      <SelectContent>
        {djs?.map((dj) => (
          <SelectItem key={dj.id} value={dj.id}>
            {dj.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

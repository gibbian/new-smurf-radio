import { cva } from "class-variance-authority";

interface GenreListProps {
  genres?: string[] | null;
  variant?: "bold" | "subtle";
}
export const GenreList = ({ genres, variant }: GenreListProps) => {
  if (!genres) return null;
  const bubbleClass = cva(
    "cursor-pointer whitespace-nowrap rounded-full text-sm shadow-sm",
    {
      variants: {
        variant: {
          bold: "border-white/25 bg-card-bg border px-2 p-1",
          subtle: "text-text/80",
        },
      },
      defaultVariants: {
        variant: "subtle",
      },
    },
  );
  return (
    <div className="mt-1 flex flex-wrap items-start gap-6">
      {genres?.map((genre) => (
        <div className={bubbleClass({ variant })} key={genre}>
          {genre}
        </div>
      ))}
    </div>
  );
};

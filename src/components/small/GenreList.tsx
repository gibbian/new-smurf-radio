interface GenreListProps {
  genres?: string[] | null;
}
export const GenreList = ({ genres }: GenreListProps) => {
  if (!genres) return null;
  return (
    <div className="mt-1 flex flex-wrap items-start gap-2">
      {genres?.map((genre) => (
        <div
          className="cursor-pointer whitespace-nowrap rounded-full border border-white/25 bg-card-bg p-1 px-2 text-sm shadow-sm"
          key={genre}
        >
          {genre}
        </div>
      ))}
    </div>
  );
};

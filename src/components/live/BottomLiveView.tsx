import { DjControls } from "./DjControls";
import { LiveSongDisplay } from "./LiveSongDisplay";

interface BottomLiveViewProps {
  showId: string;
  isHost: boolean;
}

export const BottomLiveView = ({ showId, isHost }: BottomLiveViewProps) => {
  return (
    <div className="flex items-end justify-between">
      <LiveSongDisplay showId={showId} />
      {isHost && <DjControls showId={showId} />}
    </div>
  );
};

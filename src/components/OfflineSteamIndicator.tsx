import { useEffect } from "react";
interface OfflineStreamIndicatorProps {
  refetch: () => void;
}
export const OfflineStreamIndicator = (props: OfflineStreamIndicatorProps) => {
  useEffect(() => {
    const interval = setInterval(() => {
      props.refetch();
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="p-4 text-right text-sm text-text/50">
      Waiting for stream to start...
    </div>
  );
};

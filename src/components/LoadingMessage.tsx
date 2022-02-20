import { ClockIcon } from "@heroicons/react/outline";

const LoadingMessage = ({
  message = "Loading data...",
}: {
  message?: string;
}) => {
  return (
    <div className="flex items-center space-x-1">
      <ClockIcon className="w-4 h-4" />
      <span>{message}</span>
    </div>
  );
};

export default LoadingMessage;

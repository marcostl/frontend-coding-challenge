import { createPortal } from "react-dom";

export const Toast = ({
  message,
  icon,
  onClick,
}: {
  message: string;
  icon: React.ReactElement;
  onClick: () => void;
}) => {
  return createPortal(
    <div className="absolute z-10 w-full inset-x-0 top-6 flex flex-col items-center">
      <button
        onClick={onClick}
        className="flex items-center bg-gray-300 rounded space-x-2 py-1 px-2"
      >
        {icon}
        <span>{message}</span>
      </button>
    </div>,
    document.getElementById("toast") as HTMLElement
  );
};

export default Toast;

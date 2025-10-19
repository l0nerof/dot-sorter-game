import type { ReactNode } from "react";
import cn from "../../utils/cn";

type ButtonProps = {
  onClick: () => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
};

function Button({
  onClick,
  children,
  className,
  disabled = false,
}: ButtonProps) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={cn(
        "w-full rounded-xl p-4 text-2xl font-bold text-white transition-all duration-200",
        disabled
          ? "cursor-not-allowed bg-gray-600 opacity-50"
          : "cursor-pointer bg-gradient-to-r from-cyan-500 to-fuchsia-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-fuchsia-500/50 active:translate-y-0",
        className,
      )}
    >
      {children}
    </button>
  );
}

export default Button;

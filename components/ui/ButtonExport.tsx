import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

type ButtonExportProps = {
  children: ReactNode;
  icon?: LucideIcon;
  className?: string;
  onClick?: () => void;
};

export default function ButtonExport({ children, icon: Icon, className, onClick }: ButtonExportProps) {
  return (
    <button
      onClick={onClick}
      className={`items-center inline-flex bg-white hover:bg-gray-50 transition border border-gray-300 rounded-lg px-4 py-2 gap-2 cursor-pointer ${className ?? ""}`}
    >
      {Icon && <Icon className="w-4" />}
      <span className="font-medium cursor-pointer text-sm">{children}</span>
    </button>
  );
}

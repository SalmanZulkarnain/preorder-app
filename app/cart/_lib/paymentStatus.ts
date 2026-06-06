import { AlertTriangle, CheckCircle2, LucideIcon } from "lucide-react";

type StatusKey = "success" | "pending" | "warning" | "error";

interface StatusStyle {
  wrapper: string;
  Icon: LucideIcon;
}

const statusStyles: Record<StatusKey, StatusStyle> = {
  success: { wrapper: "bg-green-50 border-green-200 text-green-900", Icon: CheckCircle2 },
  pending: { wrapper: "bg-yellow-50 border-yellow-200 text-yellow-900", Icon: AlertTriangle },
  warning: { wrapper: "bg-yellow-50 border-yellow-200 text-yellow-900", Icon: AlertTriangle },
  error: { wrapper: "bg-red-50 border-red-200 text-red-900", Icon: AlertTriangle },
};

const defaultStyle: StatusStyle = {
  wrapper: "bg-gray-50 border-gray-200 text-gray-900",
  Icon: AlertTriangle,
};

export const getPaymentStatusStyle = (status: string | null | undefined): StatusStyle => {
  if (!status) {
    return defaultStyle;
  }
  return statusStyles[status as StatusKey] || defaultStyle;
};


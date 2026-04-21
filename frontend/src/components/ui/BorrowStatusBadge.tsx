import type React from "react";
import type { BorrowStatus } from "../../types/borrow";

interface BorrowStatusBadgeProps {
  status: BorrowStatus;
}

const BorrowStatusBadge: React.FC<BorrowStatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    pending: {
      label: "Pending",
      className:
        "bg-yellow-50 text-yellow-700 ring-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:ring-yellow-800",
    },
    approved: {
      label: "Approved",
      className:
        "bg-green-50 text-green-700 ring-green-200 dark:bg-green-950 dark:text-green-300 dark:ring-green-800",
    },
    rejected: {
      label: "Rejected",
      className:
        "bg-red-50 text-red-700 ring-red-200 dark:bg-red-950 dark:text-red-300 dark:ring-red-800",
    },
    borrowed: {
      label: "Borrowed",
      className:
        "bg-orange-50 text-orange-700 ring-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:ring-orange-800",
    },
    returned: {
      label: "Returned",
      className:
        "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:ring-blue-800",
    },
    canceled: {
      label: "Canceled",
      className:
        "bg-gray-50 text-gray-700 ring-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:ring-gray-700",
    },
  };

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${statusConfig[status].className}`}
    >
      {statusConfig[status].label}
    </span>
  );
};

export default BorrowStatusBadge;

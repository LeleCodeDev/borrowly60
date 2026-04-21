import type React from "react";
import { Dialog, DialogContent } from "../../components/ui/dialog";
import type { Borrow } from "../../types/borrow";
import { CheckCircle, Package, RotateCcw, XCircle } from "lucide-react";
import { Button } from "../ui/button";
import BorrowStatusBadge from "../ui/BorrowStatusBadge";
import { formatDate } from "../../lib/formatDate";

interface BorrowerBorrowDetailProps {
  isOpen: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  selectedBorrow: Borrow | null;
  onClose: () => void;
  onConfirmBorrow: (id: number) => void;
  onReturnBorrow: (id: number) => void;
  onCancelBorrow: (id: number) => void;
}

const BaseURL = import.meta.env.VITE_APP_BASE_URL;

const BorrowerBorrowDetail: React.FC<BorrowerBorrowDetailProps> = ({
  isOpen,
  selectedBorrow,
  onOpenChange,
  onClose,
  onConfirmBorrow,
  onReturnBorrow,
  onCancelBorrow,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden gap-0">
        {selectedBorrow && (
          <>
            {/* Hero */}
            <div className="relative h-56 w-full overflow-hidden bg-muted shrink-0">
              {selectedBorrow.item?.image ? (
                <img
                  src={BaseURL + "/" + selectedBorrow.item.image}
                  alt={selectedBorrow.item.name}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Package className="h-10 w-10 text-muted-foreground/20" />
                </div>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-lg font-bold text-white mt-1.5 leading-tight">
                  {selectedBorrow.item?.name}
                </h3>
                <p className="text-xs text-white/60 mt-0.5">
                  {selectedBorrow.item?.category?.name}
                </p>
              </div>
            </div>

            {/* Two-column body — always, mirrors officer page */}
            <div className="grid grid-cols-2 divide-x divide-border">
              {/* Left — Item Details */}
              <div className="p-5 space-y-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                  Item Details
                </p>
                <div className="space-y-3">
                  <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Name
                    </p>
                    <p className="text-sm font-semibold">
                      {selectedBorrow.item?.name}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Category
                    </p>
                    <p className="text-sm font-semibold">
                      {selectedBorrow.item?.category?.name}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Quantity
                    </p>
                    <p className="text-sm font-semibold">
                      {selectedBorrow.quantity}
                    </p>
                  </div>
                  {selectedBorrow.purpose && (
                    <div className="space-y-0.5">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Purpose
                      </p>
                      <p className="text-sm  leading-relaxed">
                        {selectedBorrow.purpose}
                      </p>
                    </div>
                  )}
                  {selectedBorrow.item?.description && (
                    <div className="space-y-0.5">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Description
                      </p>
                      <p className="text-sm  leading-relaxed line-clamp-3">
                        {selectedBorrow.item.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right — Borrow Details */}
              <div className="p-5 space-y-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                  Borrow Details
                </p>

                {/* Date grid */}
                <div className="grid grid-cols-3 divide-x divide-border border-2 border-border rounded-lg overflow-hidden">
                  <div className="flex flex-col gap-0.5 px-3 py-2.5 bg-muted/30">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Borrow
                    </p>
                    <p className="text-xs font-semibold leading-tight">
                      {formatDate(selectedBorrow.borrowDate, true)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-0.5 px-3 py-2.5 bg-muted/30">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Return
                    </p>
                    <p className="text-xs font-semibold leading-tight">
                      {formatDate(selectedBorrow.returnDate, true)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-0.5 px-3 py-2.5 bg-muted/30">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Days
                    </p>
                    <p className="text-xs font-semibold leading-tight">
                      {Math.ceil(
                        (new Date(selectedBorrow.returnDate).getTime() -
                          new Date(selectedBorrow.borrowDate).getTime()) /
                          (1000 * 60 * 60 * 24),
                      )}
                    </p>
                  </div>
                </div>

                {/* Officer note */}
                {selectedBorrow.officerNote && (
                  <div className="space-y-1.5">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                      Officer Note
                    </p>
                    <p className="text-sm bg-muted/50 rounded-lg px-3 py-2.5 leading-relaxed text-foreground">
                      {selectedBorrow.officerNote}
                    </p>
                  </div>
                )}

                {/* Reviewer — shown for approved / rejected / borrowed / returned */}
                {selectedBorrow.reviewedUser && (
                  <div className="space-y-3">
                    <div className="space-y-0.5">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        {selectedBorrow.status === "rejected"
                          ? "Rejected by"
                          : "Approved by"}
                      </p>
                      <p className="text-sm font-semibold leading-tight">
                        {selectedBorrow.reviewedUser.username}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {selectedBorrow.reviewedUser.email}
                      </p>
                    </div>
                    {selectedBorrow.reviewAt && (
                      <div className="space-y-0.5">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                          Reviewed At
                        </p>
                        <p className="text-sm font-semibold leading-tight">
                          {formatDate(selectedBorrow.reviewAt, true)}
                        </p>
                      </div>
                    )}

                    <div className="space-y-0.5">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                        Status
                      </p>
                      <BorrowStatusBadge status={selectedBorrow.status} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 pb-5 pt-4 border-t">
              {selectedBorrow.status === "approved" ? (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 hover:cursor-pointer"
                    onClick={onClose}
                  >
                    Close
                  </Button>
                  <Button
                    className="flex-1 gap-2 hover:cursor-pointer"
                    onClick={() => {
                      onConfirmBorrow(selectedBorrow.id);
                      onClose();
                    }}
                  >
                    <CheckCircle className="h-4 w-4" />
                    Confirm Pickup
                  </Button>
                </div>
              ) : selectedBorrow.status === "pending" ? (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 hover:cursor-pointer"
                    onClick={onClose}
                  >
                    Close
                  </Button>
                  <Button
                    className="flex-1 gap-2 hover:cursor-pointer text-white hover:text-gray-100  dark:text-red-400 dark:hover:text-red-300 bg-red-600 hover:bg-red-700 dark:bg-red-950/50 dark:hover:bg-red-950 px-4 py-2 transition-colors duration-200 flex items-center text-base"
                    onClick={() => {
                      onCancelBorrow(selectedBorrow.id);
                      onClose();
                    }}
                  >
                    <XCircle className="h-4 w-4" />
                    Cancel Borrow
                  </Button>
                </div>
              ) : selectedBorrow.status === "borrowed" ? (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 hover:cursor-pointer"
                    onClick={onClose}
                  >
                    Close
                  </Button>
                  <Button
                    className="flex-1 gap-2 hover:cursor-pointer "
                    onClick={() => {
                      onReturnBorrow(selectedBorrow.id);
                      onClose();
                    }}
                  >
                    <RotateCcw className="h-4 w-4" />
                    Return Item
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full hover:cursor-pointer"
                  onClick={onClose}
                >
                  Close
                </Button>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BorrowerBorrowDetail;

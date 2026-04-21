import { CheckCircle, ClipboardList, Package, XCircle } from "lucide-react";
import type React from "react";
import { Dialog, DialogContent } from "../../components/ui/dialog";
import type { Borrow } from "../../types/borrow";
import { Button } from "../ui/button";
import BorrowStatusBadge from "../ui/BorrowStatusBadge";
import { formatDate } from "../../lib/formatDate";

interface OfficerBorrowDetailProps {
  isOpen: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  selectedBorrow: Borrow | null;
  onClose: () => void;
  onApproveBorrow: (id: number) => void;
  onRejectBorrow: (id: number) => void;
}

const BaseURL = import.meta.env.VITE_APP_BASE_URL;

const OfficerBorrowDetail: React.FC<OfficerBorrowDetailProps> = ({
  isOpen,
  onOpenChange,
  selectedBorrow,
  onClose,
  onApproveBorrow,
  onRejectBorrow,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl p-0 overflow-hidden gap-0">
        {selectedBorrow && (
          <>
            <div className="relative h-75 w-full overflow-hidden bg-muted shrink-0">
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

            <div className="grid grid-cols-3 divide-x divide-border">
              <div className="p-5 space-y-4">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                  Item Details
                </p>
                <div className="space-y-3">
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      Name
                    </p>
                    <p className="text-sm font-semibold">
                      {selectedBorrow.item?.name}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      Category
                    </p>
                    <p className="text-sm font-semibold">
                      {selectedBorrow.item?.category?.name}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      Qty Borrowed
                    </p>
                    <p className="text-sm font-semibold">
                      {selectedBorrow.quantity}
                    </p>
                  </div>
                  {selectedBorrow.item?.description && (
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                        Description
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                        {selectedBorrow.item.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 space-y-4">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                  Borrow Details
                </p>

                <div className="grid grid-cols-3 divide-x divide-border border-2 border-border rounded-lg overflow-hidden">
                  <div className="flex flex-col gap-0.5 px-2.5 py-2.5 bg-muted/30">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      Borrow
                    </p>
                    <p className="text-xs font-semibold leading-tight">
                      {formatDate(selectedBorrow.borrowDate, true)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-0.5 px-2.5 py-2.5 bg-muted/30">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      Return
                    </p>
                    <p className="text-xs font-semibold leading-tight">
                      {formatDate(selectedBorrow.returnDate, true)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-0.5 px-2.5 py-2.5 bg-muted/30">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      Days
                    </p>
                    <p className="text-xs font-bold leading-tight">
                      {Math.ceil(
                        (new Date(selectedBorrow.returnDate).getTime() -
                          new Date(selectedBorrow.borrowDate).getTime()) /
                          (1000 * 60 * 60 * 24),
                      )}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                    Borrower
                  </p>
                  <div className="p-2.5 rounded-lg border bg-muted/20 space-y-0.5">
                    <p className="text-sm font-semibold leading-tight">
                      {selectedBorrow.user?.username}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedBorrow.user?.email}
                    </p>
                    {selectedBorrow.user?.phone && (
                      <p className="text-xs text-muted-foreground">
                        {selectedBorrow.user.phone}
                      </p>
                    )}
                  </div>
                </div>

                {selectedBorrow.purpose && (
                  <div className="space-y-1.5">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                      Purpose
                    </p>
                    <p className="text-sm bg-muted/50 rounded-lg px-3 py-2.5 leading-relaxed text-foreground">
                      {selectedBorrow.purpose}
                    </p>
                  </div>
                )}
              </div>

              <div className="p-5 space-y-4">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                  Review Details
                </p>

                {selectedBorrow.officerNote && (
                  <div className="space-y-1.5">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                      Officer Note
                    </p>
                    <p className="text-sm bg-muted/50 rounded-lg px-3 py-2.5 leading-relaxed text-foreground">
                      {selectedBorrow.officerNote}
                    </p>
                  </div>
                )}

                {selectedBorrow.reviewedUser ? (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                        {selectedBorrow.status === "rejected"
                          ? "Rejected by"
                          : "Reviewed by"}
                      </p>
                      <div className="p-2.5 rounded-lg border bg-muted/20 space-y-0.5">
                        <p className="text-sm font-semibold leading-tight">
                          {selectedBorrow.reviewedUser.username ?? "N/A"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {selectedBorrow.reviewedUser.email}
                        </p>
                      </div>
                    </div>

                    {selectedBorrow.reviewAt && (
                      <div className="space-y-0.5">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
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
                ) : (
                  <div className="flex flex-col items-center justify-center h-65 gap-2 rounded-lg border border-dashed border-border">
                    <ClipboardList className="h-5 w-5 text-muted-foreground/30" />
                    <p className="text-xs text-muted-foreground text-center">
                      Not yet reviewed
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="px-5 pb-5 pt-4 border-t">
              {selectedBorrow.status === "pending" ? (
                <div className="flex gap-2">
                  <Button
                    className="flex-1 gap-2 hover:cursor-pointer"
                    onClick={() => {
                      onApproveBorrow(selectedBorrow.id);
                      onClose();
                    }}
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 gap-2 hover:cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/5 border-destructive/30"
                    onClick={() => {
                      onRejectBorrow(selectedBorrow.id);
                      onClose();
                    }}
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
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

export default OfficerBorrowDetail;

import { Package, Tag } from "lucide-react";
import type React from "react";
import type { BorrowError, BorrowRequest } from "../../types/borrow";
import type { Item } from "../../types/item";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Spinner } from "../ui/spinner";

interface CreateBorrowModalProps {
  isOpen: boolean;
  selectedItem: Item;
  formData: BorrowRequest;
  fieldErrors: BorrowError | null;
  isPending: boolean;
  onChange: (
    field: keyof BorrowRequest,
    value: BorrowRequest[keyof BorrowRequest],
  ) => void;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
}

const BaseURL = import.meta.env.VITE_APP_BASE_URL;

const CreateBorrowModal: React.FC<CreateBorrowModalProps> = ({
  isOpen,
  selectedItem,
  formData,
  fieldErrors,
  isPending,
  onChange,
  onSubmit,
  onOpenChange,
  onClose,
}) => {
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md md:min-w-lg p-0 overflow-hidden gap-0">
          <form onSubmit={onSubmit}>
            {selectedItem && (
              <>
                {/* Hero image */}
                <div className="relative h-80 w-full overflow-hidden bg-muted shrink-0">
                  {selectedItem.image ? (
                    <img
                      src={BaseURL + "/" + selectedItem.image}
                      alt={selectedItem.name}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Package className="h-10 w-10 text-muted-foreground/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <span className="inline-flex items-center gap-1 text-[11px] text-white/70 font-medium uppercase tracking-wide mb-1">
                      <Tag className="h-3 w-3" />
                      {selectedItem.category.name}
                    </span>
                    <h3 className="text-lg font-bold text-white leading-tight">
                      {selectedItem.name}
                    </h3>
                    <p className="text-xs text-emerald-400 font-medium mt-0.5">
                      {selectedItem.quantity} units available
                    </p>
                  </div>
                </div>

                {/* Form body */}
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="borrow_date" className="mb-2">
                        Borrow Date
                      </Label>
                      <Input
                        id="borrow_date"
                        type="date"
                        className={`${fieldErrors?.borrowDate && "border-red-600 border-3"}`}
                        value={formData.borrowDate ?? ""}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => onChange("borrowDate", e.target.value)}
                      />

                      {fieldErrors?.borrowDate && (
                        <p className="text-sm text-red-600">
                          {fieldErrors.borrowDate}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="return_date" className="mb-2">
                        Return Date
                      </Label>
                      <Input
                        id="return_date"
                        type="date"
                        value={formData.returnDate ?? ""}
                        className={`${fieldErrors?.returnDate && "border-red-600 border-3"}`}
                        onChange={(e) => onChange("returnDate", e.target.value)}
                      />

                      {fieldErrors?.returnDate && (
                        <p className="text-sm text-red-600">
                          {fieldErrors.returnDate}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid">
                    <Label htmlFor="quantity" className="mb-2">
                      Quantity
                    </Label>
                    <Input
                      id="quantity"
                      value={formData.quantity === 0 ? "" : formData.quantity}
                      className={`${fieldErrors?.quantity && "border-red-600 border-3"}`}
                      onChange={(e) =>
                        onChange("quantity", Number(e.target.value))
                      }
                      placeholder="Enter item quantity"
                      type="number"
                    />
                    {fieldErrors?.quantity && (
                      <p className="text-sm text-red-600">
                        {fieldErrors.quantity}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="notes" className="mb-2">
                      Purpose
                    </Label>
                    <Textarea
                      id="notes"
                      value={formData.purpose}
                      onChange={(e) => onChange("purpose", e.target.value)}
                      placeholder="What will you use this for?"
                      rows={3}
                      className={`resize-none text-sm ${fieldErrors?.purpose && "border-red-600 border-3"}`}
                    />

                    {fieldErrors?.purpose && (
                      <p className="text-sm text-red-600">
                        {fieldErrors.purpose}
                      </p>
                    )}
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      className=" hover:cursor-pointer"
                      onClick={onClose}
                    >
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                      className={`${isPending && "cursor-not-allowed"} hover:cursor-pointer transition-all duration-200`}
                      disabled={isPending}
                    >
                      {isPending ? (
                        <span className="flex items-center gap-1">
                          <Spinner data-icon="inline-start" />
                          Loading...
                        </span>
                      ) : (
                        <span>Submit Request</span>
                      )}
                    </Button>
                  </DialogFooter>
                </div>
              </>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateBorrowModal;

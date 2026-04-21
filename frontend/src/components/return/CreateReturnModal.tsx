import type React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import type {
  ReturnCreateForUserRequest,
  ReturnError,
} from "../../types/return";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Separator } from "../ui/separator";

interface CreateReturnModalProps {
  isOpen: boolean;
  formData: ReturnCreateForUserRequest;
  fieldErrors: ReturnError | null;
  isPending: boolean;
  onChange: (
    field: keyof ReturnCreateForUserRequest,
    value: ReturnCreateForUserRequest[keyof ReturnCreateForUserRequest],
  ) => void;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
}

const CreateReturnModal: React.FC<CreateReturnModalProps> = ({
  isOpen,
  formData,
  fieldErrors,
  isPending,
  onChange,
  onSubmit,
  onOpenChange,
  onClose,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-5 overflow-hidden gap-0">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl">
              Create Return for this borrow
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Separator />
            <div className="space-y-1.5">
              <Label htmlFor="return_date" className="mb-2">
                Actual Return Date
              </Label>
              <Input
                id="return_date"
                type="date"
                value={formData.actualreturnDate ?? ""}
                className={`${fieldErrors?.actualReturnDate && "border-red-600 border-3"}`}
                onChange={(e) => onChange("actualreturnDate", e.target.value)}
              />

              {fieldErrors?.actualReturnDate && (
                <p className="text-sm text-red-600">
                  {fieldErrors.actualReturnDate}
                </p>
              )}
            </div>
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
                <span>Submit Return</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateReturnModal;

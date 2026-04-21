import type React from "react";
import type {
  ReturnError,
  ReturnUpdateForUserRequest,
} from "../../types/return";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Spinner } from "../ui/spinner";

interface UpdateReturnModalProps {
  isOpen: boolean;
  formData: ReturnUpdateForUserRequest;
  fieldErrors: ReturnError | null;
  isPending: boolean;
  onChange: (
    field: keyof ReturnUpdateForUserRequest,
    value: ReturnUpdateForUserRequest[keyof ReturnUpdateForUserRequest],
  ) => void;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
}

const UpdateReturnModal: React.FC<UpdateReturnModalProps> = ({
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
            <DialogTitle className="text-xl">Update Return</DialogTitle>
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
                value={formData.actualReturnDate ?? ""}
                className={`${fieldErrors?.actualReturnDate && "border-red-600 border-3"}`}
                onChange={(e) => onChange("actualReturnDate", e.target.value)}
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
                <span>Update Return</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateReturnModal;

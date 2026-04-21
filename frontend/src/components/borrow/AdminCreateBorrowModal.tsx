import { Check, ChevronsUpDown } from "lucide-react";
import type React from "react";
import { cn } from "../../lib/utils";
import type { BorrowError, BorrowForUserRequest } from "../../types/borrow";
import type { Item } from "../../types/item";
import type { User } from "../../types/user";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { Dialog, DialogContent, DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Spinner } from "../ui/spinner";
import { Textarea } from "../ui/textarea";

interface AdminCreateBorrowModalProps {
  isOpen: boolean;
  items: Item[];
  itemIsPending: boolean;
  formData: BorrowForUserRequest;
  fieldErrors: BorrowError | null;
  isPending: boolean;
  users: User[];
  userIsPending: boolean;
  isEdit: boolean;
  onChange: (
    field: keyof BorrowForUserRequest,
    value: BorrowForUserRequest[keyof BorrowForUserRequest],
  ) => void;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
}

const AdminCreateBorrowModal: React.FC<AdminCreateBorrowModalProps> = ({
  isOpen,
  items,
  itemIsPending,
  formData,
  fieldErrors,
  isPending,
  users,
  userIsPending,
  isEdit,
  onChange,
  onSubmit,
  onOpenChange,
  onClose,
}) => {
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden gap-0">
          <form onSubmit={onSubmit}>
            <>
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

                {!isEdit && (
                  <div className="grid">
                    <Label className="mb-2" htmlFor="user">
                      Borrow For User
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          disabled={userIsPending}
                          className={`${fieldErrors?.userId && "border-red-600 border-3"} w-full justify-between font-normal`}
                        >
                          {userIsPending ? (
                            <span className="flex items-center gap-2">
                              <Spinner className="w-4 h-4" />
                              Loading users...
                            </span>
                          ) : (
                            <>
                              {formData.userId !== 0
                                ? users?.find((c) => c.id === formData.userId)
                                    ?.username
                                : "Select User"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="min-w-md w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search user..." />
                          <CommandEmpty>No user found.</CommandEmpty>
                          <CommandGroup>
                            {users?.map((user) => (
                              <CommandItem
                                key={user.id}
                                value={user.email}
                                onSelect={() => onChange("userId", user.id)}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    formData.userId === user.id
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {user.email}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {fieldErrors?.userId && (
                      <p className="text-sm text-red-600">
                        {fieldErrors.userId}
                      </p>
                    )}
                  </div>
                )}

                <div className="grid">
                  <Label className="mb-2" htmlFor="item">
                    Item
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        disabled={itemIsPending}
                        className={`${fieldErrors?.itemId && "border-red-600 border-3"} w-full justify-between font-normal`}
                      >
                        {itemIsPending ? (
                          <span className="flex items-center gap-2">
                            <Spinner className="w-4 h-4" />
                            Loading items...
                          </span>
                        ) : (
                          <>
                            {formData.itemId !== 0
                              ? items?.find((c) => c.id === formData.itemId)
                                  ?.name
                              : "Select Item"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="min-w-md w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search item..." />
                        <CommandEmpty>No item found.</CommandEmpty>
                        <CommandGroup>
                          {items?.map((item) => (
                            <CommandItem
                              key={item.id}
                              value={item.name}
                              onSelect={() => onChange("itemId", item.id)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.itemId === item.id
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {item.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {fieldErrors?.itemId && (
                    <p className="text-sm text-red-600">{fieldErrors.itemId}</p>
                  )}
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
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminCreateBorrowModal;

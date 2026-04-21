import { Check, ChevronsUpDown } from "lucide-react";
import type React from "react";
import { cn } from "../../lib/utils";
import type { Category } from "../../types/category";
import type { ItemError, ItemRequest } from "../../types/item";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Spinner } from "../ui/spinner";
import { Textarea } from "../ui/textarea";

interface ItemCreateUpdateModalProps {
  isOpen: boolean;
  isEdit: boolean;
  categories: Category[];
  categoriesIsPending: boolean;
  formData: ItemRequest;
  fieldErrors: ItemError | null;
  isPending: boolean;
  onChange: (
    field: keyof ItemRequest,
    value: ItemRequest[keyof ItemRequest],
  ) => void;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
}

const ItemCreateUpdateModal: React.FC<ItemCreateUpdateModalProps> = ({
  isOpen,
  isEdit,
  categories,
  categoriesIsPending,
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
        <DialogContent className="sm:max-w-125">
          <form onSubmit={onSubmit}>
            <DialogHeader>
              <DialogTitle>{isEdit ? "Edit Item" : "Add New Item"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid">
                <Label htmlFor="name" className="mb-2">
                  Name
                </Label>
                <Input
                  id="name"
                  className={`${fieldErrors?.name && "border-red-600 border-3"}`}
                  value={formData.name}
                  onChange={(e) => onChange("name", e.target.value)}
                  placeholder="Enter item name"
                />
                {fieldErrors?.name && (
                  <p className="text-sm text-red-600">{fieldErrors.name}</p>
                )}
              </div>

              <div className="grid">
                <Label className="mb-2" htmlFor="categoryId">
                  Category
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      disabled={categoriesIsPending}
                      className={`${fieldErrors?.categoryId && "border-red-600 border-3"} w-full justify-between font-normal`}
                    >
                      {categoriesIsPending ? (
                        <span className="flex items-center gap-2">
                          <Spinner className="w-4 h-4" />
                          Loading categories...
                        </span>
                      ) : (
                        <>
                          {formData.categoryId !== 0
                            ? categories?.find(
                                (c) => c.id === formData.categoryId,
                              )?.name
                            : "Select Category"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="min-w-md w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search category..." />
                      <CommandEmpty>No category found.</CommandEmpty>
                      <CommandGroup>
                        {categories?.map((category) => (
                          <CommandItem
                            key={category.id}
                            value={category.name}
                            onSelect={() => onChange("categoryId", category.id)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.categoryId === category.id
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {category.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                {fieldErrors?.categoryId && (
                  <p className="text-sm text-red-600">
                    {fieldErrors.categoryId}
                  </p>
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
                  onChange={(e) => onChange("quantity", Number(e.target.value))}
                  placeholder="Enter item quantity"
                  type="number"
                />
                {fieldErrors?.quantity && (
                  <p className="text-sm text-red-600">{fieldErrors.quantity}</p>
                )}
              </div>

              <div className="grid ">
                <Label className="mb-2" htmlFor="description">
                  Description
                </Label>
                <Textarea
                  id="description"
                  className={`${fieldErrors?.description && "border-red-600 border-3"}`}
                  value={formData.description}
                  onChange={(e) => onChange("description", e.target.value)}
                  placeholder="Enter category description"
                  rows={3}
                />
                {fieldErrors?.description && (
                  <p className="text-sm text-red-600">
                    {fieldErrors.description}
                  </p>
                )}
              </div>

              <div className="grid">
                <Label className="mb-2" htmlFor="image">
                  Image (optional)
                </Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    onChange("image", e.target.files?.[0] ?? null)
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
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
                  <span>{isEdit ? "Update" : "Create"}</span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ItemCreateUpdateModal;

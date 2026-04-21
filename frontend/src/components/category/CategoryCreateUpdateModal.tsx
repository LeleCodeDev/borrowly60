import type React from "react";
import type { CategoryError, CategoryRequest } from "../../types/category";
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
import { Spinner } from "../ui/spinner";
import { Textarea } from "../ui/textarea";

interface CategoryCreateUpdateModalProps {
  isOpen: boolean;
  isEdit: boolean;
  formData: CategoryRequest;
  fieldErrors: CategoryError | null;
  isPending: boolean;
  onChange: (
    field: keyof CategoryRequest,
    value: CategoryRequest[keyof CategoryRequest],
  ) => void;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
}

const CategoryCreateUpdateModal: React.FC<CategoryCreateUpdateModalProps> = ({
  isOpen,
  isEdit,
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
              <DialogTitle>
                {isEdit ? "Edit Category" : "Add New Category"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid">
                <Label className="mb-2" htmlFor="name">
                  Name
                </Label>
                <Input
                  id="name"
                  className={`${fieldErrors?.name && "border-red-600 border-3"}`}
                  value={formData.name}
                  onChange={(e) => onChange("name", e.target.value)}
                  placeholder="Enter category name"
                />
                {fieldErrors?.name && (
                  <p className="text-sm text-red-600">{fieldErrors.name}</p>
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

export default CategoryCreateUpdateModal;

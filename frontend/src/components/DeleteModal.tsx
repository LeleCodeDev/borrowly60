import type React from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

interface DeleteModalProps {
  title: string;
  description: string;
  isOpen: boolean;
  isPending: boolean;
  onDelete: () => void;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  title,
  description,
  isOpen,
  isPending,
  onDelete,
  onOpenChange,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="hover:cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <Button
            className="bg-red-600 hover:bg-red-700 hover:cursor-pointer transition-colors"
            onClick={onDelete}
            disabled={isPending}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <Spinner data-icon="inline-start" />
                Loading...
              </span>
            ) : (
              "Delete"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteModal;

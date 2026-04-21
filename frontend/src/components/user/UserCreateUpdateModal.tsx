import { Eye, EyeOff } from "lucide-react";
import type React from "react";
import { useState } from "react";
import type {
  UserError,
  UserRequest,
  UserRole,
  UserRoleRequest,
} from "../../types/user";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Spinner } from "../ui/spinner";

interface UserCreateUpdateModalProps {
  isOpen: boolean;
  isEdit: boolean;
  formData: UserRequest;
  fieldErrors: UserError | null;
  isPending: boolean;
  onChange: (
    field: keyof UserRequest,
    value: UserRequest[keyof UserRequest],
  ) => void;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
}

const UserCreateUpdateModal: React.FC<UserCreateUpdateModalProps> = ({
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
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-125">
          <form onSubmit={onSubmit}>
            <DialogHeader>
              <DialogTitle>{isEdit ? "Edit User" : "Add User"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid">
                <Label htmlFor="name" className="mb-2">
                  Username
                </Label>
                <Input
                  id="name"
                  className={`${fieldErrors?.username && "border-red-600 border-3"}`}
                  value={formData.username}
                  onChange={(e) => onChange("username", e.target.value)}
                  placeholder="Enter username"
                />
                {fieldErrors?.username && (
                  <p className="text-sm text-red-600">{fieldErrors.username}</p>
                )}
              </div>

              <div className="grid">
                <Label className="mb-2" htmlFor="role">
                  Role
                </Label>
                <Select
                  value={
                    formData.role === ("" as UserRoleRequest)
                      ? ""
                      : formData.role
                  }
                  onValueChange={(value: UserRole) => onChange("role", value)}
                >
                  <SelectTrigger
                    className={`${fieldErrors?.role && "border-red-600 border-3"} w-full`}
                  >
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="officer">Officer</SelectItem>
                    <SelectItem value="borrower">Borrower</SelectItem>
                  </SelectContent>
                </Select>

                {fieldErrors?.role && (
                  <p className="text-sm text-red-600">{fieldErrors.role}</p>
                )}
              </div>

              {!isEdit && (
                <div className="grid">
                  <Label htmlFor="email" className="mb-2">
                    Email
                  </Label>
                  <Input
                    id="email"
                    value={formData.email}
                    className={`${fieldErrors?.email && "border-red-600 border-3"}`}
                    onChange={(e) => onChange("email", e.target.value)}
                    placeholder="Enter email"
                    type="text"
                  />
                  {fieldErrors?.email && (
                    <p className="text-sm text-red-600">{fieldErrors.email}</p>
                  )}
                </div>
              )}

              {!isEdit && (
                <div className="grid">
                  <Label htmlFor="password" className="mb-2">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      value={formData.password}
                      className={`${fieldErrors?.password && "border-red-600 border-3"} pr-10`}
                      onChange={(e) => onChange("password", e.target.value)}
                      placeholder="Enter password"
                      type={showPassword ? "text" : "password"}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent hover:cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" aria-hidden="true" />
                      ) : (
                        <Eye className="w-4 h-4" aria-hidden="true" />
                      )}
                    </Button>
                  </div>
                  {fieldErrors?.password && (
                    <p className="text-sm text-red-600">
                      {fieldErrors.password}
                    </p>
                  )}
                </div>
              )}

              <div className="grid">
                <Label htmlFor="phone" className="mb-2">
                  Phone
                </Label>
                <Input
                  id="phone"
                  className={`${fieldErrors?.phone && "border-red-600 border-3"}`}
                  value={formData.phone}
                  onChange={(e) => onChange("phone", e.target.value)}
                  placeholder="Enter phone"
                />
                {fieldErrors?.phone && (
                  <p className="text-sm text-red-600">{fieldErrors.phone}</p>
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

export default UserCreateUpdateModal;

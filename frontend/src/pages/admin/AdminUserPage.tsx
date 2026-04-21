import { useDebounce } from "@uidotdev/usehooks";
import type { AxiosError } from "axios";
import {
  Filter,
  MoreHorizontal,
  Pencil,
  Plus,
  ShieldUser,
  Trash2,
  User as UserIcon,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import DeleteModal from "../../components/DeleteModal";
import { Button } from "../../components/ui/button";
import ButtonThemeSwitcher from "../../components/ui/ButtonThemeSwitcher";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Separator } from "../../components/ui/separator";
import { SidebarTrigger } from "../../components/ui/sidebar";
import { Spinner } from "../../components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import UserCreateUpdateModal from "../../components/user/UserCreateUpdateModal";
import {
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
  useUserCard,
  useUsers,
} from "../../hooks/api/useUser";
import type { ApiError } from "../../types/apiResponse";
import type {
  User,
  UserError,
  UserRequest,
  UserRoleRequest,
} from "../../types/user";

const AdminUserPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
  const [fieldErrors, setFieldErrors] = useState<UserError | null>(null);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState("created_at");
  const [roleQuery, setRoleQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data, isPending } = useUsers({
    search: debouncedSearch,
    page,
    size,
    order,
    orderBy,
    role: roleQuery as UserRoleRequest,
  });
  const { data: dashboardData, isPending: dashboardDataIsPending } =
    useUserCard();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const users = data?.data;
  const totalPages = data?.pagination?.totalPages ?? 1;

  const [formData, setFormData] = useState<UserRequest>({
    username: "",
    email: "",
    role: "" as UserRoleRequest,
    phone: "",
    password: "",
  });

  const handleChange = (
    field: keyof UserRequest,
    value: UserRequest[keyof UserRequest],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOpenDialog = (user?: User) => {
    setFieldErrors(null);
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username,
        email: "",
        role: user.role as UserRoleRequest,
        phone: user.phone,
        password: "",
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: "",
        email: "",
        role: "" as UserRoleRequest,
        phone: "",
        password: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingUser) {
      updateUser.mutate(
        { id: editingUser.id, data: formData },
        {
          onSuccess: (data) => {
            toast.success(data.message);
            setIsDialogOpen(false);
          },
          onError: (err) => {
            const error = err as AxiosError<ApiError<UserError>>;
            toast.error(error.response?.data.message || "Update user failed");
            if (error.response?.data.errors)
              setFieldErrors(error.response.data.errors);
          },
        },
      );
    } else {
      createUser.mutate(formData, {
        onSuccess: (data) => {
          toast.success(data.message);
          setIsDialogOpen(false);
        },
        onError: (err) => {
          const error = err as AxiosError<ApiError<UserError>>;
          toast.error(error.response?.data.message || "Create user failed");
          if (error.response?.data.errors)
            setFieldErrors(error.response.data.errors);
        },
      });
    }
  };

  const handleDelete = () => {
    if (deletingUserId) {
      deleteUser.mutate(deletingUserId, {
        onSuccess: (data) => {
          toast.success(data.message);
          setDeletingUserId(null);
          setIsDeleteDialogOpen(false);
        },
        onError: (err) => {
          const error = err as AxiosError<ApiError<null>>;
          toast.error(error.response?.data.message || "Delete user failed");
        },
      });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="flex w-full items-center justify-between h-15 px-6">
          <div className="flex items-center gap-3">
            <SidebarTrigger size="icon-lg" className="hover:cursor-pointer" />
            <Separator
              orientation="vertical"
              className="data-[orientation=vertical]:h-5"
            />
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">User Management</h1>
            </div>
          </div>
          <ButtonThemeSwitcher />
        </div>
      </header>

      <main className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 grid-cols-2">
          <Card className="border-blue-100 dark:border-blue-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Borrowers
              </CardTitle>
              <div className="h-9 w-9 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center">
                <UserIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">
                {dashboardDataIsPending ? (
                  <Spinner />
                ) : (
                  dashboardData?.totalBorrowers
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Registered users
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-100 dark:border-purple-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Officers
              </CardTitle>
              <div className="h-9 w-9 rounded-lg bg-purple-50 dark:bg-purple-950 flex items-center justify-center">
                <ShieldUser className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">
                {dashboardDataIsPending ? (
                  <Spinner />
                ) : (
                  dashboardData?.totalOfficers
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Registered users
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Table Card */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <Button
                className="hover:cursor-pointer shrink-0 gap-2"
                onClick={() => handleOpenDialog()}
              >
                <Plus className="h-4 w-4" />
                Add User
              </Button>

              <Input
                className="w-full"
                type="search"
                placeholder="Search by name, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="shrink-0 hover:cursor-pointer gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    Filter
                    {(roleQuery ||
                      orderBy !== "created_at" ||
                      order !== "asc") && (
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72" align="end">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm">Filters</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground hover:cursor-pointer"
                        onClick={() => {
                          setRoleQuery("");
                          setOrderBy("created_at");
                          setOrder("asc");
                        }}
                      >
                        Reset
                      </Button>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs text-muted-foreground">
                        Role
                      </Label>
                      <Select
                        value={roleQuery || "all"}
                        onValueChange={(v) =>
                          setRoleQuery(v === "all" ? "" : v)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="All Roles" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Roles</SelectItem>
                          <SelectItem value="officer">Officer</SelectItem>
                          <SelectItem value="borrower">Borrower</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs text-muted-foreground">
                        Sort By
                      </Label>
                      <Select value={orderBy} onValueChange={setOrderBy}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="updated_at">Updated At</SelectItem>
                          <SelectItem value="created_at">Created At</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs text-muted-foreground">
                        Order
                      </Label>
                      <Select
                        value={order}
                        onValueChange={(v) => setOrder(v as "asc" | "desc")}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asc">Ascending</SelectItem>
                          <SelectItem value="desc">Descending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <Table className="table-fixed w-full">
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-14 pl-6 font-semibold text-foreground">
                    No
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    Username
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    Email
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    Phone
                  </TableHead>
                  <TableHead className="w-36 text-left font-semibold text-foreground">
                    Role
                  </TableHead>
                  <TableHead className="w-20 text-center font-semibold text-foreground">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isPending ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <Spinner className="w-8 h-8" />
                        <p className="text-sm text-muted-foreground">
                          Loading users...
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : users?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-16">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="h-8 w-8 text-muted-foreground/40" />
                        <p className="text-sm text-muted-foreground">
                          No users found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  users?.map((user, index) => (
                    <TableRow
                      key={user.id}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      <TableCell className="pl-6 text-muted-foreground text-sm">
                        {(page - 1) * size + index + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        {user.username}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.email}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.phone}
                      </TableCell>
                      <TableCell className="text-left">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
                            user.role === "officer"
                              ? "bg-purple-50 text-purple-700 ring-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:ring-purple-800"
                              : "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:ring-blue-800"
                          }`}
                        >
                          {user.role === "officer" ? "Officer" : "Borrower"}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:cursor-pointer"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="hover:cursor-pointer"
                              onClick={() => handleOpenDialog(user)}
                            >
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive hover:cursor-pointer hover:text-red-700"
                              onClick={() => {
                                setDeletingUserId(user.id);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2 text-red-600" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="flex items-center gap-2">
              <Label
                htmlFor="rows-per-page"
                className="text-sm text-muted-foreground whitespace-nowrap"
              >
                Rows per page
              </Label>
              <Select
                defaultValue="10"
                onValueChange={(v) => setSize(Number(v))}
              >
                <SelectTrigger className=" h-8 mr-2" id="rows-per-page">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="start">
                  <SelectGroup>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {data?.pagination && (
                <span className="text-xs text-muted-foreground">
                  {(page - 1) * size + 1}–
                  {Math.min(page * size, data.pagination.totalPages)} of{" "}
                  {data.pagination.totalPages}
                </span>
              )}
            </div>

            {totalPages > 1 && (
              <Pagination className="mx-0 w-auto">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage((p) => Math.max(p - 1, 1))}
                      className={
                        page === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <PaginationItem key={p}>
                        <PaginationLink
                          isActive={page === p}
                          onClick={() => setPage(p)}
                          className="cursor-pointer"
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setPage((p) => Math.min(p + 1, totalPages))
                      }
                      className={
                        page === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </Card>
      </main>

      <UserCreateUpdateModal
        isOpen={isDialogOpen}
        isEdit={editingUser != null}
        formData={formData}
        fieldErrors={fieldErrors}
        isPending={editingUser ? updateUser.isPending : createUser.isPending}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onOpenChange={setIsDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />

      <DeleteModal
        title={"Delete User"}
        description={
          "This action cannot be undone. This will permanently delete the user from the system."
        }
        isOpen={isDeleteDialogOpen}
        isPending={deleteUser.isPending}
        onDelete={handleDelete}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </div>
  );
};

export default AdminUserPage;

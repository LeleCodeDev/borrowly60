import { useDebounce } from "@uidotdev/usehooks";
import type { AxiosError } from "axios";
import {
  Filter,
  FolderOpen,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import CategoryCreateUpdateModal from "../../components/category/CategoryCreateUpdateModal";
import DeleteModal from "../../components/DeleteModal";
import { Button } from "../../components/ui/button";
import ButtonThemeSwitcher from "../../components/ui/ButtonThemeSwitcher";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
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
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "../../hooks/api/useCategory";
import type { ApiError } from "../../types/apiResponse";
import type {
  Category,
  CategoryError,
  CategoryRequest,
} from "../../types/category";

const AdminCategoryPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<number | null>(
    null,
  );
  const [fieldErrors, setFieldErrors] = useState<CategoryError | null>(null);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState("created_at");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data, isPending } = useCategories({
    search: debouncedSearch,
    page,
    size,
    order,
    orderBy,
  });
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const categories = data?.data;
  const totalPages = data?.pagination?.totalPages ?? 1;

  const [formData, setFormData] = useState({ name: "", description: "" });

  const handleChange = (
    field: keyof CategoryRequest,
    value: CategoryRequest[keyof CategoryRequest],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOpenDialog = (category?: Category) => {
    setFieldErrors(null);
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name, description: category.description });
    } else {
      setEditingCategory(null);
      setFormData({ name: "", description: "" });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingCategory) {
      updateCategory.mutate(
        { id: editingCategory.id, data: formData },
        {
          onSuccess: (data) => {
            toast.success(data.message);
            setIsDialogOpen(false);
          },
          onError: (err) => {
            const error = err as AxiosError<ApiError<CategoryError>>;
            toast.error(
              error.response?.data.message || "Update category failed",
            );
            if (error.response?.data.errors)
              setFieldErrors(error.response.data.errors);
          },
        },
      );
    } else {
      createCategory.mutate(formData, {
        onSuccess: (data) => {
          toast.success(data.message);
          setIsDialogOpen(false);
        },
        onError: (err) => {
          const error = err as AxiosError<ApiError<CategoryError>>;
          toast.error(error.response?.data.message || "Create category failed");
          if (error.response?.data.errors)
            setFieldErrors(error.response.data.errors);
        },
      });
    }
  };

  const handleDelete = () => {
    if (deletingCategoryId) {
      deleteCategory.mutate(deletingCategoryId, {
        onSuccess: (data) => {
          toast.success(data.message);
          setIsDeleteDialogOpen(false);
          setDeletingCategoryId(null);
        },
        onError: (err) => {
          const error = err as AxiosError<ApiError<null>>;
          toast.error(error.response?.data.message || "Delete category failed");
        },
      });
    }
  };

  return (
    <div className="min-h-screen ">
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="flex w-full items-center justify-between h-15 px-6">
          <div className="flex items-center gap-3">
            <SidebarTrigger size="icon-lg" className="hover:cursor-pointer" />
            <Separator
              orientation="vertical"
              className="data-[orientation=vertical]:h-5"
            />
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Category Management</h1>
            </div>
          </div>
          <ButtonThemeSwitcher />
        </div>
      </header>

      <main className="p-6">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <Button
                className="hover:cursor-pointer shrink-0 gap-2"
                onClick={() => handleOpenDialog()}
              >
                <Plus className="h-4 w-4" />
                Add Category
              </Button>

              <Input
                className="w-full"
                type="search"
                placeholder="Search categories..."
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
                    {(orderBy !== "created_at" || order !== "asc") && (
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
                          setOrderBy("created_at");
                          setOrder("asc");
                        }}
                      >
                        Reset
                      </Button>
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
                  <TableHead className=" pl-6 font-semibold text-foreground">
                    No
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    Name
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    Description
                  </TableHead>
                  <TableHead className="w-24 pr-4 text-center">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isPending ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <Spinner className="w-8 h-8" />
                        <p className="text-sm text-muted-foreground">
                          Loading categories...
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : categories?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-16">
                      <div className="flex flex-col items-center gap-2">
                        <FolderOpen className="h-8 w-8 text-muted-foreground/40" />
                        <p className="text-sm text-muted-foreground">
                          No categories found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  categories?.map((category, index) => (
                    <TableRow
                      key={category.id}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      <TableCell className="pl-6 text-muted-foreground text-sm">
                        {(page - 1) * size + index + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        {category.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground truncate max-w-xs">
                        {category.description || (
                          <span className="italic text-muted-foreground/40">
                            No description
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-center pr-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:cursor-pointer "
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="hover:cursor-pointer"
                              onClick={() => handleOpenDialog(category)}
                            >
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive hover:cursor-pointer focus:text-destructive"
                              onClick={() => {
                                setDeletingCategoryId(category.id);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
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

          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="flex items-center gap-2">
              <Label
                htmlFor="select-rows-per-page"
                className="text-sm text-muted-foreground whitespace-nowrap"
              >
                Rows per page
              </Label>
              <Select
                defaultValue="10"
                onValueChange={(value) => setSize(Number(value))}
              >
                <SelectTrigger className=" h-8 mr-1" id="select-rows-per-page">
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
                <span className="text-sm text-muted-foreground">
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

      <CategoryCreateUpdateModal
        isOpen={isDialogOpen}
        isEdit={editingCategory != null}
        formData={formData}
        isPending={
          editingCategory ? updateCategory.isPending : createCategory.isPending
        }
        fieldErrors={fieldErrors}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onOpenChange={setIsDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />

      <DeleteModal
        title={"Delete Cateogory"}
        description={
          "This action cannot be undone. This will permanently delete the category and associated items from the system."
        }
        isOpen={isDeleteDialogOpen}
        isPending={deleteCategory.isPending}
        onDelete={handleDelete}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </div>
  );
};

export default AdminCategoryPage;

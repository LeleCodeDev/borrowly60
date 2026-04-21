import { useDebounce } from "@uidotdev/usehooks";
import type { AxiosError } from "axios";
import {
  Check,
  Filter,
  Package,
  Pencil,
  Plus,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import DeleteModal from "../../components/DeleteModal";
import ItemCreateUpdateModal from "../../components/item/ItemCreateUpdateModal";
import { Button } from "../../components/ui/button";
import ButtonThemeSwitcher from "../../components/ui/ButtonThemeSwitcher";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
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
import { useCategories } from "../../hooks/api/useCategory";
import {
  useCreateItem,
  useDeleteItem,
  useItemCard,
  useItems,
  useUpdateItem,
} from "../../hooks/api/useItem";
import type { ApiError } from "../../types/apiResponse";
import type {
  Item,
  ItemError,
  ItemRequest,
  ItemStatus,
} from "../../types/item";
import { Badge } from "../../components/ui/badge";

const BaseURL = import.meta.env.VITE_APP_BASE_URL;

const AdminItemPage = () => {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(9);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState("created_at");
  const [status, setStatus] = useState("");
  const [filterCategoryId, setFilterCategoryId] = useState(0);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ItemError | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [formData, setFormData] = useState<ItemRequest>({
    name: "",
    categoryId: 0,
    description: "",
    quantity: 0,
    image: null,
  });

  const hasActiveFilters =
    status ||
    filterCategoryId !== 0 ||
    orderBy !== "created_at" ||
    order !== "asc";

  const { data: categoriesData, isPending: categoryIsPending } = useCategories({
    unpage: true,
  });
  const { data: dashboardData, isPending: dashboardDataIsPending } =
    useItemCard();
  const { data, isPending } = useItems({
    search: debouncedSearch,
    page,
    size,
    order,
    orderBy,
    status: status as ItemStatus,
    categoryId: filterCategoryId,
  });

  const createItem = useCreateItem();
  const updateItem = useUpdateItem();
  const deleteItem = useDeleteItem();

  const categories = categoriesData?.data;
  const items = data?.data;
  const totalPages = data?.pagination?.totalPages ?? 1;

  const handleOpenDialog = (item?: Item) => {
    setFieldErrors(null);
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        categoryId: item.category.id,
        description: item.description,
        quantity: item.quantity,
      });
    } else {
      setEditingItem(null);
      setFormData({ name: "", categoryId: 0, description: "", quantity: 0 });
    }
    setIsDialogOpen(true);
  };

  const handleChange = (
    field: keyof ItemRequest,
    value: ItemRequest[keyof ItemRequest],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingItem) {
      updateItem.mutate(
        { id: editingItem.id, data: formData },
        {
          onSuccess: (data) => {
            toast.success(data.message);
            setIsDialogOpen(false);
          },
          onError: (err) => {
            const error = err as AxiosError<ApiError<ItemError>>;
            toast.error(
              error.response?.data.message || "Failed to update item",
            );
            if (error.response?.data.errors)
              setFieldErrors(error.response.data.errors);
          },
        },
      );
    } else {
      createItem.mutate(formData, {
        onSuccess: (data) => {
          toast.success(data.message);
          setIsDialogOpen(false);
        },
        onError: (err) => {
          const error = err as AxiosError<ApiError<ItemError>>;
          toast.error(error.response?.data.message || "Failed to create item");
          if (error.response?.data.errors)
            setFieldErrors(error.response.data.errors);
        },
      });
    }
  };

  const handleDelete = () => {
    if (deletingItemId) {
      deleteItem.mutate(deletingItemId, {
        onSuccess: (data) => {
          toast.success(data.message);
          setIsDeleteDialogOpen(false);
          setDeletingItemId(null);
        },
        onError: (err) => {
          const error = err as AxiosError<ApiError<null>>;
          toast.error(error.response?.data.message || "Delete item failed");
        },
      });
    }
  };

  return (
    <div className="min-h-screen">
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="flex w-full items-center justify-between h-15 px-6">
          <div className="flex items-center gap-3">
            <SidebarTrigger size="icon-lg" className="hover:cursor-pointer" />
            <Separator
              orientation="vertical"
              className="data-[orientation=vertical]:h-5"
            />
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Item Management</h1>
            </div>
          </div>
          <ButtonThemeSwitcher />
        </div>
      </header>

      <main className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 grid-cols-2">
          <Card className="border-green-100 dark:border-green-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Available Items
              </CardTitle>
              <div className="h-9 w-9 rounded-lg bg-green-50 dark:bg-green-950 flex items-center justify-center">
                <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">
                {dashboardDataIsPending ? (
                  <Spinner />
                ) : (
                  dashboardData?.availableItems
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Ready to borrow
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-100 dark:border-red-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Unavailable Items
              </CardTitle>
              <div className="h-9 w-9 rounded-lg bg-red-50 dark:bg-red-950 flex items-center justify-center">
                <X className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">
                {dashboardDataIsPending ? (
                  <Spinner />
                ) : (
                  dashboardData?.unavailableItems
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Can't be borrowed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3">
          <Button
            className="hover:cursor-pointer shrink-0 gap-2"
            onClick={() => handleOpenDialog()}
          >
            <Plus className="h-4 w-4" />
            Add Item
          </Button>

          <Input
            type="search"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="shrink-0 hover:cursor-pointer gap-2"
              >
                <Filter className="h-4 w-4" />
                Filter
                {hasActiveFilters && (
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
                      setStatus("");
                      setFilterCategoryId(0);
                      setOrderBy("created_at");
                      setOrder("asc");
                    }}
                  >
                    Reset
                  </Button>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Status
                  </Label>
                  <Select
                    value={status || "all"}
                    onValueChange={(v) => setStatus(v === "all" ? "" : v)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder="All Status"
                        className="w-full"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="unavailable">Unavailable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Category
                  </Label>
                  <Select
                    value={
                      filterCategoryId === 0
                        ? "all"
                        : filterCategoryId.toString()
                    }
                    onValueChange={(v) =>
                      setFilterCategoryId(v === "all" ? 0 : Number(v))
                    }
                    disabled={categoryIsPending}
                  >
                    <SelectTrigger className="w-full">
                      {categoryIsPending ? (
                        <span className="flex items-center gap-2">
                          <Spinner className="w-4 h-4" />
                          Loading...
                        </span>
                      ) : (
                        <SelectValue placeholder="All Categories" />
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories?.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
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
                  <Label className="text-xs text-muted-foreground">Order</Label>
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

        {/* Grid */}
        {isPending ? (
          <div className="flex flex-col items-center justify-center py-16 border rounded-lg bg-muted/30 gap-3">
            <Spinner className="w-8 h-8" />
            <p className="text-sm text-muted-foreground">Loading items...</p>
          </div>
        ) : items?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 border rounded-lg bg-muted/30 gap-3">
            <Package className="h-10 w-10 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">No items found</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items?.map((item) => (
              <div
                key={item.id}
                className="group bg-card border rounded-xl shadow-lg flex flex-col overflow-hidden hover:bg-muted/30 transition-colors duration-200"
              >
                {/* Image */}
                <div className="relative p-2 aspect-video w-full overflow-hidden bg-muted">
                  {item.image ? (
                    <img
                      src={BaseURL + "/" + item.image}
                      alt={item.name}
                      className="h-full w-full object-contain group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-secondary">
                      <Package className="h-8 w-8 text-muted-foreground/20" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col gap-3 p-4 flex-1">
                  {/* Category + Status */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground font-medium uppercase tracking-wide">
                      <Tag className="h-3 w-3" />
                      {item.category.name}
                    </span>

                    <Badge
                      variant="secondary"
                      className={`text-[11px] font-medium px-2 py-0 h-5 rounded-full border-0 ${
                        item.status === "available"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                          : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400"
                      }`}
                    >
                      {item.status === "available"
                        ? "Available"
                        : "Unavailable"}
                    </Badge>
                  </div>

                  {/* Name + Description */}
                  <div className="flex-1 space-y-1">
                    <h3 className="font-semibold text-sm leading-snug tracking-tight">
                      {item.name}
                    </h3>

                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed min-h-10">
                      {item.description || (
                        <span className="italic opacity-40">
                          No description
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Qty */}
                  <div className="flex items-center justify-between border-t pt-3">
                    <div className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-md">
                      <span className="text-xs text-muted-foreground">Qty</span>
                      <span className="text-sm font-semibold">
                        {item.quantity}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:cursor-pointer"
                        onClick={() => handleOpenDialog(item)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:cursor-pointer hover:bg-red-50 dark:hover:bg-red-950"
                        onClick={() => {
                          setDeletingItemId(item.id);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label
              htmlFor="select-rows-per-page"
              className="text-sm text-muted-foreground whitespace-nowrap"
            >
              Items per page
            </Label>
            <Select
              defaultValue="9"
              onValueChange={(value) => setSize(Number(value))}
            >
              <SelectTrigger className="w-16 h-8" id="select-rows-per-page">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start">
                <SelectGroup>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="9">9</SelectItem>
                  <SelectItem value="18">18</SelectItem>
                  <SelectItem value="27">27</SelectItem>
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
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
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
      </main>

      <ItemCreateUpdateModal
        isOpen={isDialogOpen}
        isEdit={editingItem != null}
        categories={categories || []}
        categoriesIsPending={categoryIsPending}
        formData={formData}
        fieldErrors={fieldErrors}
        isPending={editingItem ? updateItem.isPending : createItem.isPending}
        onChange={handleChange}
        onOpenChange={setIsDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSubmit}
      />

      <DeleteModal
        title={"Delete Item"}
        description={
          "This action cannot be undone. This will permanently delete the item from the system."
        }
        isOpen={isDeleteDialogOpen}
        isPending={deleteItem.isPending}
        onDelete={handleDelete}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </div>
  );
};

export default AdminItemPage;

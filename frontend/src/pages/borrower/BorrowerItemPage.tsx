import CreateBorrowModal from "@/components/borrow/CreateBorrowModal";
import { useDebounce } from "@uidotdev/usehooks";
import type { AxiosError } from "axios";
import { Filter, Package, Search, Tag, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import ButtonThemeSwitcher from "../../components/ui/ButtonThemeSwitcher";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Separator } from "../../components/ui/separator";
import { SidebarTrigger } from "../../components/ui/sidebar";
import { Spinner } from "../../components/ui/spinner";
import { useCreateBorrow } from "../../hooks/api/useBorrow";
import { useCategories } from "../../hooks/api/useCategory";
import { useItems } from "../../hooks/api/useItem";
import type { ApiError } from "../../types/apiResponse";
import type { BorrowError, BorrowRequest } from "../../types/borrow";
import type { Item, ItemStatus } from "../../types/item";

const BaseURL = import.meta.env.VITE_APP_BASE_URL;

const BorrowerItemPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(9);
  const [filterCategoryId, setFilterCategoryId] = useState(0);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<BorrowError | null>(null);

  const [status, setStatus] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const [borrowForm, setBorrowForm] = useState<BorrowRequest>({
    itemId: 0,
    borrowDate: null,
    returnDate: null,
    quantity: 0,
    purpose: "",
  });

  const { data: categoriesData, isPending: categoryIsPending } = useCategories({
    unpage: true,
  });
  const { data, isPending } = useItems({
    search: debouncedSearch,
    page,
    size,
    status: status as ItemStatus,
    categoryId: filterCategoryId,
    orderBy: "created_at",
    order: "desc",
  });
  const createBorrow = useCreateBorrow();

  const categories = categoriesData?.data;
  const items = data?.data;
  const totalPages = data?.pagination?.totalPages ?? 1;
  const hasActiveFilters = filterCategoryId !== 0;

  const handleBorrowRequest = (item: Item) => {
    setSelectedItem(item);
    setFieldErrors(null);
    setIsDialogOpen(true);
    setBorrowForm({
      itemId: item.id,
      borrowDate: null,
      returnDate: null,
      quantity: 0,
      purpose: "",
    });
  };

  const handleSubmitBorrow = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    createBorrow.mutate(borrowForm, {
      onSuccess: (data) => {
        toast.success(data.message);
        setIsDialogOpen(false);
        setSelectedItem(null);
      },
      onError: (err) => {
        const error = err as AxiosError<ApiError<BorrowError>>;
        toast.error(
          error.response?.data.message || "Create borrow request failed",
        );
        if (error.response?.data.errors) {
          setFieldErrors(error.response.data.errors);
        }
      },
    });
  };

  const handleChange = (
    field: keyof BorrowRequest,

    value: BorrowRequest[keyof BorrowRequest],
  ) => {
    setBorrowForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-20">
        <div className="flex w-full items-center justify-between h-14 px-6">
          <div className="flex items-center gap-3">
            <SidebarTrigger size="icon-lg" className="hover:cursor-pointer" />
            <Separator
              orientation="vertical"
              className="data-[orientation=vertical]:h-5"
            />
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Browse Items</h1>
            </div>
          </div>
          <ButtonThemeSwitcher />
        </div>
      </header>

      <main className="p-6 space-y-8">
        <div className="relative rounded-2xl overflow-hidden border bg-card p-8 md:p-10">
          <div className="relative z-10">
            {/* Badge */}
            {(filterCategoryId !== 0 ||
              status !== "" ||
              searchQuery !== "") && (
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-medium text-primary">
                  {data?.pagination?.totalItems ?? 0} items found
                </span>
              </div>
            )}

            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              {filterCategoryId !== 0 && categories ? (
                <>
                  Browsing{" "}
                  <span className="text-primary">
                    {categories.find((c) => c.id === filterCategoryId)?.name}
                  </span>
                </>
              ) : searchQuery ? (
                <>
                  Results for{" "}
                  <span className="text-primary">"{searchQuery}"</span>
                </>
              ) : (
                <>
                  Find and borrow{" "}
                  <span className="text-primary">what you need</span>
                </>
              )}
            </h2>
            <p className="text-muted-foreground mb-6 text-sm md:text-base">
              Browse our catalog and submit a borrow request in seconds.
            </p>

            {/* Search + filter */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10 h-11 bg-background shadow-sm"
                />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-11 shrink-0 hover:cursor-pointer gap-2 bg-background shadow-sm"
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
                          setFilterCategoryId(0);
                          setStatus("");
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
                          <SelectItem value="unavailable">
                            Unavailable
                          </SelectItem>
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
                        onValueChange={(v) => {
                          setFilterCategoryId(v === "all" ? 0 : Number(v));
                          setPage(1);
                        }}
                        disabled={categoryIsPending}
                      >
                        <SelectTrigger className="w-full">
                          {categoryIsPending ? (
                            <span className="flex items-center gap-2">
                              <Spinner className="w-4 h-4" />
                              Loading...
                            </span>
                          ) : (
                            <SelectValue
                              placeholder="All Categories"
                              className="w-full"
                            />
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
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Category quick filters */}
        {!categoryIsPending && categories && categories.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setFilterCategoryId(0);
                setPage(1);
              }}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all hover:cursor-pointer border ${
                filterCategoryId === 0
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-background hover:bg-muted text-muted-foreground border-border"
              }`}
            >
              All
            </button>

            {categories.slice(0, 5).map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setFilterCategoryId(category.id);
                  setPage(1);
                }}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all hover:cursor-pointer border ${
                  filterCategoryId === category.id
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-background hover:bg-muted text-muted-foreground border-border"
                }`}
              >
                <Tag className="h-3 w-3" />
                {category.name}
              </button>
            ))}

            {categories.length > 5 && (
              <Popover>
                <PopoverTrigger asChild>
                  <button className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all hover:cursor-pointer border bg-background hover:bg-muted text-muted-foreground border-border">
                    +{categories.length - 5} more
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-56" align="start">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      More categories
                    </p>
                    {categories.slice(5).map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          setFilterCategoryId(category.id);
                          setPage(1);
                        }}
                        className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors hover:cursor-pointer ${
                          filterCategoryId === category.id
                            ? "bg-primary/10 text-primary font-medium"
                            : "hover:bg-muted text-foreground"
                        }`}
                      >
                        <Tag className="h-3 w-3 shrink-0" />
                        {category.name}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        )}

        {/* Results count */}

        {!isPending && data?.pagination && (
          <p className="text-xs text-muted-foreground">
            {items?.length} of {data.pagination.totalPages} items
            {searchQuery && (
              <>
                {" "}
                — <span className="text-foreground">"{searchQuery}"</span>
              </>
            )}
          </p>
        )}

        {/* Grid */}
        {isPending ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Spinner className="w-8 h-8" />
            <p className="text-sm text-muted-foreground">Loading items...</p>
          </div>
        ) : items?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 border rounded-xl bg-muted/10 gap-3">
            <Package className="h-8 w-8 text-muted-foreground/30" />
            <p className="text-sm font-medium">No items found</p>
            <p className="text-xs text-muted-foreground">
              Try adjusting your search or filters
            </p>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilterCategoryId(0)}
                className="hover:cursor-pointer mt-1"
              >
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items?.map((item) => (
              <div
                key={item.id}
                className="group bg-card border rounded-xl shadow-lg flex flex-col overflow-hidden hover:bg-muted/30 transition-colors duration-200"
              >
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

                <div className="flex flex-col gap-3 p-4 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground font-medium uppercase tracking-wide">
                      <Tag className="h-3 w-3" />
                      {item.category.name}
                    </span>
                    <Badge
                      variant="secondary"
                      className={`text-[11px] font-medium px-2 py-0 h-5 rounded-full  border-0 ${item.status == "available" && item.quantity > 0 ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400" : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400"}`}
                    >
                      {item.status == "available" ? (
                        <span>{item.quantity} left</span>
                      ) : (
                        <span>Unavailable</span>
                      )}
                    </Badge>
                  </div>

                  {/* Name + description */}
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

                  <Button
                    className={`w-full gap-2 hover:cursor-pointer mt-auto ${(item.status === "unavailable" || item.quantity === 0) && "bg-blue-800"}`}
                    disabled={
                      item.status === "unavailable" || item.quantity === 0
                    }
                    onClick={() => handleBorrowRequest(item)}
                  >
                    {item.status === "unavailable" || item.quantity === 0 ? (
                      <div className="flex items-center gap-1">
                        <X className="h-6 w-6" />
                        Unavailable
                      </div>
                    ) : (
                      <>Borrow Item</>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Label
              htmlFor="items-per-page"
              className="text-sm text-muted-foreground whitespace-nowrap"
            >
              Per page
            </Label>
            <Select
              defaultValue="9"
              onValueChange={(v) => {
                setSize(Number(v));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-16 h-8" id="items-per-page">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start">
                <SelectItem value="9">9</SelectItem>
                <SelectItem value="18">18</SelectItem>
                <SelectItem value="27">27</SelectItem>
              </SelectContent>
            </Select>
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

      {/* Borrow Dialog */}
      <CreateBorrowModal
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedItem={selectedItem as Item}
        formData={borrowForm}
        fieldErrors={fieldErrors}
        isPending={createBorrow.isPending}
        onChange={handleChange}
        onSubmit={handleSubmitBorrow}
        onClose={() => {
          setIsDialogOpen(false);
        }}
      />
    </div>
  );
};

export default BorrowerItemPage;

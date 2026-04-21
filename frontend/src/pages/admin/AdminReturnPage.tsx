import {
  Calendar,
  CheckCircle,
  Eye,
  Filter,
  Package,
  Pencil,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import ButtonThemeSwitcher from "../../components/ui/ButtonThemeSwitcher";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Dialog, DialogContent } from "../../components/ui/dialog";
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
  useDeleteReturn,
  useReturnCard,
  useReturns,
  useUpdateReturnForUser,
} from "../../hooks/api/useReturn";
import type {
  Return,
  ReturnError,
  ReturnUpdateForUserRequest,
} from "../../types/return";
import { formatDate } from "../../lib/formatDate";
import UpdateReturnModal from "../../components/return/UpdateReturnModal";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import type { ApiError } from "../../types/apiResponse";
import { formatDateValue } from "../../lib/formatDateValue";
import DeleteModal from "../../components/DeleteModal";

const BaseURL = import.meta.env.VITE_APP_BASE_URL;

const AdminReturnPage = () => {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedReturn, setSelectedReturn] = useState<Return | null>(null);
  const [deleteReturnId, setDeleteReturnId] = useState<number | null>(null);
  const [updateReturnId, setUpdateReturnId] = useState<number | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ReturnError | null>(null);
  const [returnForm, setReturnForm] = useState<ReturnUpdateForUserRequest>({
    actualReturnDate: null,
  });

  const hasActiveFilters = !!startDate || !!endDate;

  const { data, isPending } = useReturns({
    page,
    size,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });
  const { data: dashboardData, isPending: dashboardDataIsPending } =
    useReturnCard();

  const updateReturnForUser = useUpdateReturnForUser();
  const deleteReturn = useDeleteReturn();

  const returns = data?.data;
  const totalPages = data?.pagination?.totalPages ?? 1;

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const handleChange = (
    field: keyof ReturnUpdateForUserRequest,
    value: ReturnUpdateForUserRequest[keyof ReturnUpdateForUserRequest],
  ) => {
    setReturnForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleOpenDialog = (ret: Return) => {
    setFieldErrors(null);
    setUpdateReturnId(ret.id);
    setReturnForm({
      actualReturnDate: formatDateValue(ret.actualReturnDate),
    });
    setIsUpdateModalOpen(true);
  };

  const handleUpdateReturn = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (updateReturnId) {
      updateReturnForUser.mutate(
        { id: updateReturnId, data: returnForm },
        {
          onSuccess: (data) => {
            toast.success(data.message);
            setIsUpdateModalOpen(false);
            setUpdateReturnId(null);
          },
          onError: (err) => {
            const error = err as AxiosError<ApiError<ReturnError>>;
            toast.error(
              error.response?.data.message || "Update borrow request failed",
            );
            if (error.response?.data.errors) {
              setFieldErrors(error.response.data.errors);
            }
          },
        },
      );
    }
  };

  const handleDelete = () => {
    if (deleteReturnId) {
      deleteReturn.mutate(deleteReturnId, {
        onSuccess: (data) => {
          toast.success(data.message);
          setIsDeleteModalOpen(false);
          setDeleteReturnId(null);
        },
        onError: (err) => {
          const error = err as AxiosError<ApiError<null>>;
          toast.error(error.response?.data.message || "Delete borrow failed");
        },
      });
    }
  };

  return (
    <div className="min-h-screen ">
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
              <h1 className="text-2xl font-bold">Returns</h1>
            </div>
          </div>
          <ButtonThemeSwitcher />
        </div>
      </header>

      <main className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-green-100 dark:border-green-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-muted-foreground">
                Total Returns
              </p>
              <div className="h-9 w-9 rounded-lg bg-green-50 dark:bg-green-950 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">
                {dashboardDataIsPending ? (
                  <Spinner />
                ) : (
                  dashboardData?.totalReturn
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Items returned
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-100 dark:border-red-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-muted-foreground">
                Overdue
              </p>
              <div className="h-9 w-9 rounded-lg bg-red-50 dark:bg-red-950 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-red-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">
                {dashboardDataIsPending ? (
                  <Spinner />
                ) : (
                  dashboardData?.totalOverdue
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Returned late
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Table Card */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex justify-end">
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
                <PopoverContent className="min-w-88" align="end">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm">Filters</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground hover:cursor-pointer"
                        onClick={handleReset}
                      >
                        Reset
                      </Button>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs text-muted-foreground">
                        Return Date Range
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-muted-foreground">
                            From
                          </span>
                          <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => {
                              setStartDate(e.target.value);
                              setPage(1);
                            }}
                            className="w-full text-sm"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-muted-foreground">
                            To
                          </span>
                          <Input
                            type="date"
                            value={endDate}
                            min={startDate}
                            onChange={(e) => {
                              setEndDate(e.target.value);
                              setPage(1);
                            }}
                            className="h-9 text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {hasActiveFilters && (
                      <div className="flex flex-wrap gap-1.5 pt-1 border-t">
                        {startDate && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs">
                            From:{" "}
                            <span className="font-medium">
                              {formatDate(startDate)}
                            </span>
                          </span>
                        )}
                        {endDate && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs">
                            To:{" "}
                            <span className="font-medium">
                              {formatDate(endDate)}
                            </span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <Table className="min-w-max w-full">
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="pl-6 font-semibold text-foreground">
                    No
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    Item
                  </TableHead>
                  <TableHead className=" font-semibold text-foreground">
                    Borrower
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    Due Date
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    Returned
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    Status
                  </TableHead>
                  <TableHead className="sticky right-0 pr-6"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isPending ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <Spinner className="w-8 h-8" />
                        <p className="text-sm text-muted-foreground">
                          Loading returns...
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : returns?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <RotateCcw className="h-8 w-8 text-muted-foreground/30" />
                        <p className="text-sm text-muted-foreground">
                          No returns found
                        </p>
                        {hasActiveFilters && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:cursor-pointer"
                            onClick={handleReset}
                          >
                            Clear filters
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  returns?.map((ret, index) => (
                    <TableRow
                      key={ret.id}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      <TableCell className="pl-6 text-muted-foreground text-sm">
                        {(page - 1) * size + index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg overflow-hidden bg-muted shrink-0">
                            {ret.borrow?.item?.image ? (
                              <img
                                src={BaseURL + "/" + ret.borrow.item.image}
                                alt={ret.borrow.item.name}
                                className="h-full w-full object-contain"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center">
                                <Package className="h-4 w-4 text-muted-foreground/40" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm leading-tight">
                              {ret.borrow?.item?.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {ret.borrow?.item?.category?.name}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm font-medium leading-tight">
                          {ret.borrow?.user?.username}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {ret.borrow?.user?.email}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p
                          className={`text-sm ${ret.isOverdue ? "text-red-500 font-medium" : "text-muted-foreground"}`}
                        >
                          {formatDate(ret.borrow?.returnDate)}
                        </p>
                        {ret.isOverdue && (
                          <p className="text-[10px] text-red-400">Overdue</p>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(ret.actualReturnDate)}
                      </TableCell>
                      <TableCell>
                        {ret.isOverdue ? (
                          <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset bg-red-50 text-red-700 ring-red-200 dark:bg-red-950 dark:text-red-300 dark:ring-red-800">
                            Returned Late
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset bg-green-50 text-green-700 ring-green-200 dark:bg-green-950 dark:text-green-300 dark:ring-green-800">
                            On Time
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="sticky right-0  text-right pr-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:cursor-pointer "
                          onClick={() => {
                            setSelectedReturn(ret);
                            setIsDetailOpen(true);
                          }}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:cursor-pointer"
                          onClick={() => {
                            handleOpenDialog(ret);
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:cursor-pointer hover:bg-red-50 dark:hover:bg-red-950"
                          onClick={() => {
                            setDeleteReturnId(ret.id);
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
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
                <SelectTrigger className="" id="rows-per-page">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="start">
                  <SelectGroup>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
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

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden gap-0">
          {selectedReturn && (
            <>
              <div className="relative h-70 w-full overflow-hidden bg-muted shrink-0">
                {selectedReturn.borrow?.item?.image ? (
                  <img
                    src={BaseURL + "/" + selectedReturn.borrow.item.image}
                    alt={selectedReturn.borrow.item.name}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Package className="h-10 w-10 text-muted-foreground/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white mt-1.5 leading-tight">
                      {selectedReturn.borrow?.item?.name}
                    </h3>
                    <p className="text-xs text-white/60 mt-0.5">
                      {selectedReturn.borrow?.item?.category?.name}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 divide-x divide-border">
                <div className="p-5 space-y-4">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                    Item Details
                  </p>
                  <div className="space-y-3">
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                        Name
                      </p>
                      <p className="text-sm font-semibold">
                        {selectedReturn.borrow?.item?.name}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                        Category
                      </p>
                      <p className="text-sm font-semibold">
                        {selectedReturn.borrow?.item?.category?.name}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                        Qty Borrowed
                      </p>
                      <p className="text-sm font-semibold">
                        {selectedReturn.borrow?.quantity}
                      </p>
                    </div>
                    {selectedReturn.borrow?.item?.description && (
                      <div className="space-y-0.5">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                          Description
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                          {selectedReturn.borrow.item.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 space-y-4 bg-muted/20">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                    Borrow Details
                  </p>

                  <div className="grid grid-cols-3 divide-x divide-border border rounded-lg overflow-hidden">
                    <div className="flex flex-col gap-0.5 px-2.5 py-2.5 bg-muted/30">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                        Borrowed
                      </p>
                      <p className="text-xs font-semibold leading-tight">
                        {formatDate(selectedReturn.borrow?.borrowDate, true)}
                      </p>
                    </div>
                    <div className="flex flex-col gap-0.5 px-2.5 py-2.5 bg-muted/30">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                        Due
                      </p>
                      <p
                        className={`text-xs font-semibold leading-tight ${selectedReturn.isOverdue ? "text-red-500" : ""}`}
                      >
                        {formatDate(selectedReturn.borrow?.returnDate, true)}
                      </p>
                    </div>
                    <div className="flex flex-col gap-0.5 px-2.5 py-2.5 bg-muted/30">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                        Returned
                      </p>
                      <p className="text-xs font-semibold leading-tight">
                        {formatDate(selectedReturn.actualReturnDate, true)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                      Borrower
                    </p>
                    <div className="p-2.5 rounded-lg border bg-background space-y-0.5">
                      <p className="text-sm font-semibold leading-tight">
                        {selectedReturn.borrow?.user?.username}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {selectedReturn.borrow?.user?.email}
                      </p>
                      {selectedReturn.borrow?.user?.phone && (
                        <p className="text-xs text-muted-foreground">
                          {selectedReturn.borrow.user.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {selectedReturn.borrow?.purpose && (
                    <div className="space-y-1.5">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                        Purpose
                      </p>
                      <p className="text-sm bg-background rounded-lg px-3 py-2.5 leading-relaxed border">
                        {selectedReturn.borrow.purpose}
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-4">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                    Return Details
                  </p>

                  <div className="space-y-3">
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                        Return Date
                      </p>
                      <p className="text-sm font-semibold">
                        {formatDate(selectedReturn.actualReturnDate, true)}
                      </p>
                    </div>

                    <div className="space-y-0.5">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                        Status
                      </p>
                      {selectedReturn.isOverdue ? (
                        <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset bg-red-50 text-red-700 ring-red-200 dark:bg-red-950 dark:text-red-300 dark:ring-red-800">
                          Returned Late
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset bg-green-50 text-green-700 ring-green-200 dark:bg-green-950 dark:text-green-300 dark:ring-green-800">
                          On Time
                        </span>
                      )}
                    </div>
                  </div>

                  {selectedReturn.borrowerNote && (
                    <div className="space-y-1.5">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                        Borrower Note
                      </p>
                      <p className="text-sm bg-muted/50 rounded-lg px-3 py-2.5 leading-relaxed">
                        {selectedReturn.borrowerNote}
                      </p>
                    </div>
                  )}

                  {selectedReturn.borrow?.officerNote && (
                    <div className="space-y-1.5">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                        Officer Note
                      </p>
                      <p className="text-sm bg-muted/50 rounded-lg px-3 py-2.5 leading-relaxed">
                        {selectedReturn.borrow.officerNote}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-5 pb-5 pt-4 border-t bg-muted/20">
                <Button
                  variant="outline"
                  className="w-full hover:cursor-pointer"
                  onClick={() => setIsDetailOpen(false)}
                >
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <UpdateReturnModal
        isOpen={isUpdateModalOpen}
        formData={returnForm}
        fieldErrors={fieldErrors}
        isPending={updateReturnForUser.isPending}
        onChange={handleChange}
        onSubmit={handleUpdateReturn}
        onOpenChange={setIsUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
      />

      <DeleteModal
        title={"Delete Return"}
        description={
          "This action cannot be undone. This will permanently delete the return history from the system."
        }
        isOpen={isDeleteModalOpen}
        isPending={deleteReturn.isPending}
        onDelete={handleDelete}
        onOpenChange={setIsDeleteModalOpen}
      />
    </div>
  );
};

export default AdminReturnPage;

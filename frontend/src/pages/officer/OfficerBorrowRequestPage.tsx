import type { AxiosError } from "axios";
import {
  CheckCircle,
  ClipboardList,
  Eye,
  FileDown,
  Filter,
  Package,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { borrowApi } from "../../api/borrowApi";
import OfficerBorrowDetail from "../../components/borrow/OfficerBorrowDetail";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import BorrowStatusBadge from "../../components/ui/BorrowStatusBadge";
import { Button } from "../../components/ui/button";
import ButtonThemeSwitcher from "../../components/ui/ButtonThemeSwitcher";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
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
import { Textarea } from "../../components/ui/textarea";
import {
  useApproveBorrow,
  useBorrowCard,
  useBorrows,
  useRejectBorrow,
} from "../../hooks/api/useBorrow";
import { formatDate } from "../../lib/formatDate";
import type { ApiError } from "../../types/apiResponse";
import type { Borrow, BorrowStatus } from "../../types/borrow";

const BaseURL = import.meta.env.VITE_APP_BASE_URL;

const OfficerBorrowRequestPage = () => {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<BorrowStatus | "all" | "">(
    "",
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedBorrow, setSelectedBorrow] = useState<Borrow | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [actionBorrow, setActionBorrow] = useState<{
    id: number;
    type: "approve" | "reject";
  } | null>(null);
  const [officerNote, setOfficerNote] = useState("");

  const hasActiveFilters = !!statusFilter || !!startDate || !!endDate;

  const { data, isPending } = useBorrows({
    page,
    size,
    status: statusFilter as BorrowStatus,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const { data: dashboardData, isPending: dashboardDataIsPending } =
    useBorrowCard();

  const approveBorrow = useApproveBorrow();
  const rejectBorrow = useRejectBorrow();

  const borrows = data?.data;
  const totalPages = data?.pagination?.totalPages ?? 1;

  const handleReset = () => {
    setStatusFilter("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const handleAction = () => {
    if (!actionBorrow) return;
    const mutation =
      actionBorrow.type === "approve" ? approveBorrow : rejectBorrow;
    mutation.mutate(
      { id: actionBorrow.id, data: { officerNote: officerNote || null } },
      {
        onSuccess: (data) => {
          toast.success(data.message);
          setActionBorrow(null);
          setOfficerNote("");
        },
        onError: (err) => {
          const error = err as AxiosError<ApiError<null>>;
          toast.error(
            error.response?.data.message ||
              `Failed to ${actionBorrow.type} request`,
          );
        },
      },
    );
  };

  const isActionPending = approveBorrow.isPending || rejectBorrow.isPending;

  return (
    <div className="min-h-screen ">
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="flex w-full items-center justify-between h-14 px-6">
          <div className="flex items-center gap-3">
            <SidebarTrigger size="icon-lg" className="hover:cursor-pointer" />
            <Separator
              orientation="vertical"
              className="data-[orientation=vertical]:h-5"
            />
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Borrow Requests</h1>
            </div>
          </div>
          <ButtonThemeSwitcher />
        </div>
      </header>

      <main className="p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-yellow-100 dark:border-yellow-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-muted-foreground">
                Pending
              </p>
              <div className="h-9 w-9 rounded-lg bg-yellow-50 dark:bg-yellow-950 flex items-center justify-center">
                <ClipboardList className="h-4 w-4 text-yellow-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">
                {dashboardDataIsPending ? (
                  <Spinner />
                ) : (
                  dashboardData?.totalPending
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Awaiting your action
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-100 dark:border-green-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-muted-foreground">
                Approved
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
                  dashboardData?.totalApproved
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Ready to pick up
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-100 dark:border-red-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-muted-foreground">
                Rejected
              </p>
              <div className="h-9 w-9 rounded-lg bg-red-50 dark:bg-red-950 flex items-center justify-center">
                <XCircle className="h-4 w-4 text-red-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">
                {dashboardDataIsPending ? (
                  <Spinner />
                ) : (
                  dashboardData?.totalRejected
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Declined requests
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between gap-3">
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
                        Status
                      </Label>
                      <Select
                        value={statusFilter || "all"}
                        onValueChange={(v: BorrowStatus | "all") => {
                          setStatusFilter(v === "all" ? "" : v);
                          setPage(1);
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="borrowed">Borrowed</SelectItem>
                          <SelectItem value="returned">Returned</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs text-muted-foreground">
                        Borrow Date Range
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
                            className="h-9 text-sm"
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
                        {statusFilter && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs">
                            Status:{" "}
                            <span className="font-medium capitalize">
                              {statusFilter}
                            </span>
                          </span>
                        )}
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

              <Button
                variant="default"
                className="bg-primary hover:bg-blue-800 hover:cursor-pointer transition-all duration-150 flex items-center gap-2"
                onClick={() =>
                  borrowApi.downloadPDF({
                    startDate,
                    endDate,
                    status: statusFilter as BorrowStatus,
                  })
                }
              >
                <FileDown className="w-4 h-4" />
                Download PDF
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto w-full">
              <Table className="w-full min-w-max">
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className=" pl-6 font-semibold text-foreground">
                      No
                    </TableHead>
                    <TableHead className="font-semibold text-foreground">
                      Item
                    </TableHead>
                    <TableHead className="font-semibold text-foreground">
                      Borrower
                    </TableHead>
                    <TableHead className="font-semibold text-foreground">
                      Borrow Date
                    </TableHead>
                    <TableHead className="font-semibold text-foreground">
                      Return Date
                    </TableHead>
                    <TableHead className=" font-semibold text-foreground">
                      Status
                    </TableHead>
                    <TableHead className="sticky right-0 pr-6" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isPending ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-16">
                        <div className="flex flex-col items-center gap-3">
                          <Spinner className="w-8 h-8" />
                          <p className="text-sm text-muted-foreground">
                            Loading requests...
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : borrows?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-16">
                        <div className="flex flex-col items-center gap-3">
                          <ClipboardList className="h-8 w-8 text-muted-foreground/30" />
                          <p className="text-sm text-muted-foreground">
                            No requests found
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
                    borrows?.map((borrow, index) => (
                      <TableRow
                        key={borrow.id}
                        className="hover:bg-muted/30 transition-colors group"
                      >
                        <TableCell className="pl-6 text-muted-foreground text-sm">
                          {(page - 1) * size + index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-lg overflow-hidden bg-muted shrink-0">
                              {borrow.item?.image ? (
                                <img
                                  src={BaseURL + "/" + borrow.item.image}
                                  alt={borrow.item.name}
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
                                {borrow.item?.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {borrow.item?.category?.name}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm font-medium leading-tight">
                            {borrow.user?.username}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {borrow.user?.email}
                          </p>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(borrow.borrowDate)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(borrow.returnDate)}
                        </TableCell>
                        <TableCell>
                          <BorrowStatusBadge status={borrow.status} />
                        </TableCell>
                        <TableCell className="sticky right-0  text-right pr-4">
                          <div className="flex justify-center items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:cursor-pointer "
                              onClick={() => {
                                setSelectedBorrow(borrow);
                                setIsDetailOpen(true);
                              }}
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                            {borrow.status === "pending" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:cursor-pointer hover:bg-primary/10 hover:text-primary "
                                  onClick={() =>
                                    setActionBorrow({
                                      id: Number(borrow.id),
                                      type: "approve",
                                    })
                                  }
                                >
                                  <CheckCircle className="h-3.5 w-3.5" />
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:cursor-pointer hover:bg-destructive/10 hover:text-destructive "
                                  onClick={() =>
                                    setActionBorrow({
                                      id: Number(borrow.id),
                                      type: "reject",
                                    })
                                  }
                                >
                                  <XCircle className="h-3.5 w-3.5" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>

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
                <SelectTrigger className=" h-8" id="rows-per-page">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="start">
                  <SelectGroup>
                    <SelectItem value="1">1</SelectItem>
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

      <OfficerBorrowDetail
        isOpen={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        selectedBorrow={selectedBorrow}
        onClose={() => setIsDetailOpen(false)}
        onApproveBorrow={() => {
          if (selectedBorrow) {
            setIsDetailOpen(false);
            setActionBorrow({
              id: Number(selectedBorrow.id),
              type: "approve",
            });
          }
        }}
        onRejectBorrow={() => {
          if (selectedBorrow) {
            setIsDetailOpen(false);
            setActionBorrow({
              id: Number(selectedBorrow.id),
              type: "reject",
            });
          }
        }}
      />

      <AlertDialog
        open={!!actionBorrow}
        onOpenChange={(open) => {
          if (!open) setActionBorrow(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionBorrow?.type === "approve"
                ? "Approve Request?"
                : "Reject Request?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionBorrow?.type === "approve"
                ? "The borrower will be notified and can pick up the item."
                : "The borrower will be notified that their request has been declined."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex flex-col gap-1.5 py-2">
            <Label className="text-xs text-muted-foreground">
              Officer Note{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </Label>
            <Textarea
              value={officerNote}
              onChange={(e) => setOfficerNote(e.target.value)}
              placeholder="Add a note for the borrower..."
              rows={3}
              className="resize-none"
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              className="hover:cursor-pointer"
              disabled={isActionPending}
            >
              Cancel
            </AlertDialogCancel>
            <Button
              onClick={handleAction}
              disabled={isActionPending}
              variant={actionBorrow?.type === "approve" ? "default" : "outline"}
              className={`hover:cursor-pointer ${
                actionBorrow?.type === "reject"
                  ? "text-destructive hover:text-destructive hover:bg-destructive/5 border-destructive/30"
                  : ""
              }`}
            >
              {isActionPending ? (
                <span className="flex items-center gap-2">
                  <Spinner data-icon="inline-start" />
                  Loading...
                </span>
              ) : actionBorrow?.type === "approve" ? (
                "Approve"
              ) : (
                "Reject"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OfficerBorrowRequestPage;

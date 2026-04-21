import {
  Calendar,
  CheckCircle,
  Eye,
  Filter,
  Package,
  RotateCcw,
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
import { useMyReturnCard, useMyReturns } from "../../hooks/api/useReturn";
import type { Return } from "../../types/return";
import BorrowStatusBadge from "../../components/ui/BorrowStatusBadge";
import { formatDate } from "../../lib/formatDate";

const BaseURL = import.meta.env.VITE_APP_BASE_URL;

const BorrowerReturnPage = () => {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedReturn, setSelectedReturn] = useState<Return | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const hasActiveFilters = !!startDate || !!endDate;

  const { data, isPending } = useMyReturns({
    page,
    size,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const { data: dashboardData, isPending: dashboardDataIsPending } =
    useMyReturnCard();
  const returns = data?.data;
  const totalPages = data?.pagination?.totalPages ?? 1;

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="flex w-full items-center justify-between h-14 px-6">
          <div className="flex items-center gap-3">
            <SidebarTrigger size="icon-lg" className="hover:cursor-pointer" />
            <Separator
              orientation="vertical"
              className="data-[orientation=vertical]:h-5"
            />
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold">Returns History</h1>
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
            <Table className=" w-full min-w-max">
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="pl-6 font-semibold text-foreground">
                    No
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    Item
                  </TableHead>
                  <TableHead className=" font-semibold text-foreground">
                    Due Date
                  </TableHead>
                  <TableHead className=" font-semibold text-foreground">
                    Returned
                  </TableHead>
                  <TableHead className=" font-semibold text-foreground">
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
                          className="h-8 w-8 hover:cursor-pointer  transition-opacity"
                          onClick={() => {
                            setSelectedReturn(ret);
                            setIsDetailOpen(true);
                          }}
                        >
                          <Eye className="h-3.5 w-3.5" />
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
                <SelectTrigger className=" h-8" id="rows-per-page">
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

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden gap-0">
          {selectedReturn && (
            <>
              {/* Hero */}
              <div className="relative h-52 w-full overflow-hidden bg-muted shrink-0">
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

              {/* Three column body */}
              <div className="grid grid-cols-3 divide-x divide-border">
                {/* Left — Item details */}
                <div className="p-5 space-y-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                    Item Details
                  </p>
                  <div className="space-y-3">
                    <div className="space-y-0.5">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Name
                      </p>
                      <p className="text-sm font-semibold">
                        {selectedReturn.borrow.item?.name}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Category
                      </p>
                      <p className="text-sm font-semibold">
                        {selectedReturn.borrow.item?.category?.name}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Quantity
                      </p>
                      <p className="text-sm font-semibold">
                        {selectedReturn.borrow.quantity}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Purpose
                      </p>
                      <p className="text-sm  leading-relaxed">
                        {selectedReturn.borrow.purpose}
                      </p>
                    </div>
                    {selectedReturn.borrow.item?.description && (
                      <div className="space-y-0.5">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                          Description
                        </p>
                        <p className="text-sm  leading-relaxed line-clamp-3">
                          {selectedReturn.borrow.item.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Middle — Borrow details */}
                <div className="p-5 space-y-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                    Borrow Details
                  </p>

                  {/* Date grid */}
                  <div className="grid grid-cols-3 divide-x divide-border border-2 border-border rounded-lg overflow-hidden">
                    <div className="flex flex-col gap-0.5 px-3 py-2.5 bg-muted/30">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Borrow
                      </p>
                      <p className="text-xs font-semibold leading-tight">
                        {formatDate(selectedReturn.borrow.borrowDate, true)}
                      </p>
                    </div>
                    <div className="flex flex-col gap-0.5 px-3 py-2.5 bg-muted/30">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Return
                      </p>
                      <p className="text-xs font-semibold leading-tight">
                        {formatDate(selectedReturn.borrow.returnDate, true)}
                      </p>
                    </div>
                    <div className="flex flex-col gap-0.5 px-3 py-2.5 bg-muted/30">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Days
                      </p>
                      <p className="text-xs font-semibold leading-tight">
                        {Math.ceil(
                          (new Date(
                            selectedReturn.borrow.returnDate,
                          ).getTime() -
                            new Date(
                              selectedReturn.borrow.borrowDate,
                            ).getTime()) /
                            (1000 * 60 * 60 * 24),
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Officer note */}
                  {selectedReturn.borrow.officerNote && (
                    <div className="space-y-1.5">
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                        Officer Note
                      </p>
                      <p className="text-sm bg-muted/50 rounded-lg px-3 py-2.5 leading-relaxed text-foreground">
                        {selectedReturn.borrow.officerNote}
                      </p>
                    </div>
                  )}

                  {/* Reviewer — shown for approved / rejected / borrowed / returned */}
                  {selectedReturn.borrow.reviewedUser && (
                    <div className="space-y-3">
                      <div className="space-y-0.5">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                          {selectedReturn.borrow.status === "rejected"
                            ? "Rejected by"
                            : "Approved by"}
                        </p>
                        <p className="text-sm font-semibold leading-tight">
                          {selectedReturn.borrow.reviewedUser.username ?? "N/A"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {selectedReturn.borrow.reviewedUser.email}
                        </p>
                      </div>
                      {selectedReturn.borrow.reviewAt && (
                        <div className="space-y-0.5">
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">
                            Reviewed At
                          </p>
                          <p className="text-sm font-semibold leading-tight">
                            {formatDate(selectedReturn.borrow.reviewAt, true)}
                          </p>
                        </div>
                      )}

                      <div className="space-y-0.5">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                          Status
                        </p>
                        <BorrowStatusBadge
                          status={selectedReturn.borrow.status}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Right — Return details */}
                <div className="p-5 space-y-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                    Return Details
                  </p>

                  <div className="space-y-3">
                    <div className="space-y-0.5">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Return Date
                      </p>
                      <p className="text-sm font-semibold">
                        {formatDate(selectedReturn.actualReturnDate, true)}
                      </p>
                    </div>

                    <div className="space-y-0.5">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
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
                      <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                        Borrower Note
                      </p>
                      <p className="text-sm bg-muted/50 rounded-lg px-3 py-2.5 leading-relaxed">
                        {selectedReturn.borrowerNote}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
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
    </div>
  );
};

export default BorrowerReturnPage;

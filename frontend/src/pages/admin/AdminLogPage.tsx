import { Activity, ScrollText } from "lucide-react";
import { useState } from "react";

import ButtonThemeSwitcher from "../../components/ui/ButtonThemeSwitcher";
import { Card, CardContent } from "../../components/ui/card";
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
import { useLogs } from "../../hooks/api/useLog";

const AdminLogPage = () => {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  const { data, isPending } = useLogs({
    page,
    size,
  });

  const logs = data?.data;
  const totalPages = data?.pagination?.totalPages ?? 1;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
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
              <h1 className="text-2xl font-bold">Activity Logs</h1>
            </div>
          </div>
          <ButtonThemeSwitcher />
        </div>
      </header>

      <main className="p-6 space-y-6">
        {/* Log Feed */}
        <div className="space-y-3">
          {isPending ? (
            <div className="flex flex-col h-full justify-center items-center gap-3 py-20">
              <Spinner className="w-10 h-10" />

              <p className="text-sm text-muted-foreground">Loading users...</p>
            </div>
          ) : logs?.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-20">
              <ScrollText className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No logs found</p>
            </div>
          ) : (
            logs?.map((log) => (
              <Card
                key={log.id}
                className="hover:bg-muted/30 transition-colors group border"
              >
                <CardContent className="flex items-start ">
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">
                        {log.user?.username ?? (
                          <span className="text-muted-foreground italic">
                            Deleted User
                          </span>
                        )}
                      </span>
                      {log.user?.role && (
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
                            log.user.role === "admin"
                              ? "bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:ring-sky-800"
                              : log.user.role === "officer"
                                ? "bg-purple-50 text-purple-700 ring-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:ring-purple-800"
                                : "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:ring-blue-800"
                          }`}
                        >
                          {log.user.role === "admin"
                            ? "Admin"
                            : log.user.role === "officer"
                              ? "Officer"
                              : "Borrower"}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
                      <Activity className="h-3.5 w-3.5 shrink-0" />
                      {log.activity}
                    </p>
                  </div>

                  {/* Timestamp */}
                  <div className="text-xs text-muted-foreground shrink-0 whitespace-nowrap pt-0.5">
                    {formatDate(log.createdAt)}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Footer Pagination */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label
              htmlFor="rows-per-page"
              className="text-sm text-muted-foreground whitespace-nowrap"
            >
              Rows per page
            </Label>
            <Select
              defaultValue="10"
              onValueChange={(v) => {
                setSize(Number(v));
              }}
            >
              <SelectTrigger className="h-8 mr-2" id="rows-per-page">
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
    </div>
  );
};

export default AdminLogPage;

import {
  Activity,
  ArrowRight,
  Clock,
  FileText,
  Package,
  TrendingUp,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import ButtonThemeSwitcher from "../../components/ui/ButtonThemeSwitcher";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { SidebarTrigger } from "../../components/ui/sidebar";
import { Spinner } from "../../components/ui/spinner";
import { useAdminDashboard } from "../../hooks/api/useDashboard";
import { useLogs } from "../../hooks/api/useLog";
import { formatDate } from "../../lib/formatDate";

const AdminDashboard = () => {
  const { data, isPending } = useAdminDashboard();
  const { data: logData, isPending: logIsPending } = useLogs({
    size: 5,
  });

  const logs = logData?.data;

  return (
    <div className="min-h-screen">
      {/* Header — matches AdminUserPage */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="flex w-full items-center justify-between h-15 px-6">
          <div className="flex items-center gap-3">
            <SidebarTrigger size="icon-lg" className="hover:cursor-pointer" />
            <Separator
              orientation="vertical"
              className="data-[orientation=vertical]:h-5"
            />
            <h1 className="text-2xl font-bold">Dashboard</h1>
          </div>
          <ButtonThemeSwitcher />
        </div>
      </header>

      <main className="p-6 space-y-6">
        {/* Stats — 4-column grid matching the user page 2-column card style */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card className="border-blue-100 dark:border-blue-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Items
              </CardTitle>
              <div className="h-9 w-9 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center">
                <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">
                {isPending ? <Spinner /> : data?.totalItems}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Available to borrow
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-100 dark:border-purple-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Categories
              </CardTitle>
              <div className="h-9 w-9 rounded-lg bg-purple-50 dark:bg-purple-950 flex items-center justify-center">
                <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">
                {isPending ? <Spinner /> : data?.totalCategories}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Item categories
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-100 dark:border-green-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
              <div className="h-9 w-9 rounded-lg bg-green-50 dark:bg-green-950 flex items-center justify-center">
                <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">
                {isPending ? <Spinner /> : data?.totalUsers}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Registered users
              </p>
            </CardContent>
          </Card>

          <Card className="border-orange-100 dark:border-orange-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Borrows
              </CardTitle>
              <div className="h-9 w-9 rounded-lg bg-orange-50 dark:bg-orange-950 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">
                {isPending ? <Spinner /> : data?.totalBorrows}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Currently borrowed
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <CardTitle className="text-base">Quick Actions</CardTitle>
                  <CardDescription className="text-xs">
                    Manage your system quickly
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full justify-between hover:cursor-pointer border bg-background text-black shadow-xs dark:border-input dark:bg-input/30 dark:text-white hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary transition-colors duration-300"
                asChild
              >
                <Link to="/admin/items">
                  Manage Items
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                className="w-full justify-between hover:cursor-pointer border bg-background text-black shadow-xs dark:border-input dark:bg-input/30 dark:text-white hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary transition-colors duration-300"
                asChild
              >
                <Link to="/admin/categories">
                  Manage Categories
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                className="w-full justify-between hover:cursor-pointer border bg-background text-black shadow-xs dark:border-input dark:bg-input/30 dark:text-white hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary transition-colors duration-300"
                asChild
              >
                <Link to="/admin/users">
                  Manage Users
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                className="w-full justify-between hover:cursor-pointer border bg-background text-black shadow-xs dark:border-input dark:bg-input/30 dark:text-white hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary transition-colors duration-300"
                asChild
              >
                <Link to="/admin/borrow-requests">
                  View Borrow Requests
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Recent Activity</CardTitle>
                    <CardDescription className="text-xs">
                      Latest system activity
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground hover:text-foreground hover:cursor-pointer gap-1 shrink-0"
                  asChild
                >
                  <Link to="/admin/logs">
                    View all
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {logIsPending ? (
                  <Spinner className="w-8 h-8" />
                ) : (
                  logs?.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between px-6 py-3 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="text-sm font-medium leading-tight">
                            {log.activity}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {log.user ? log.user.username : "N/A"}
                          </p>
                        </div>
                      </div>

                      <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset whitespace-nowrap bg-muted/50 text-muted-foreground ring-border ml-3 shrink-0">
                        {formatDate(log.createdAt)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

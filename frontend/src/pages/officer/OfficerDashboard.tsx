import {
  Activity,
  ArrowRight,
  CheckCircle,
  Clock,
  Package,
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
import { useOfficerDashboard } from "../../hooks/api/useDashboard";
import { useAuth } from "../../hooks/api/useAuth";
import { Spinner } from "../../components/ui/spinner";

const OfficerDashboard = () => {
  const { user } = useAuth();
  const { data, isPending } = useOfficerDashboard();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
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
            <h1 className="text-2xl font-bold">Dashboard</h1>
          </div>
          <ButtonThemeSwitcher />
        </div>
      </header>

      <main className="p-6 space-y-6">
        <Card className="border-primary/20 dark:border-primary ">
          <CardContent className="flex items-center gap-5 py-6">
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">{greeting()},</p>
              <p className="text-2xl font-bold tracking-tight truncate">
                Officer {user?.username ?? "—"}
              </p>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                {user?.email && (
                  <span className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </span>
                )}
                {user?.email && user?.phone && (
                  <span className="text-muted-foreground/40 text-xs">·</span>
                )}
                {user?.phone && (
                  <span className="text-xs text-muted-foreground">
                    {user.phone}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card className="border-yellow-100 dark:border-yellow-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Requests
              </CardTitle>
              <div className="h-9 w-9 rounded-lg bg-yellow-50 dark:bg-yellow-950 flex items-center justify-center">
                <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">
                {isPending ? <Spinner /> : (data?.totalPending ?? 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Needs processing
              </p>
            </CardContent>
          </Card>

          <Card className="border-orange-100 dark:border-orange-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Borrows
              </CardTitle>
              <div className="h-9 w-9 rounded-lg bg-orange-50 dark:bg-orange-950 flex items-center justify-center">
                <Users className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">
                {isPending ? <Spinner /> : (data?.totalBorrowed ?? 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Currently borrowed
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-100 dark:border-green-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Returns
              </CardTitle>
              <div className="h-9 w-9 rounded-lg bg-green-50 dark:bg-green-950 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">
                {isPending ? <Spinner /> : (data?.totalReturned ?? 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Items returned
              </p>
            </CardContent>
          </Card>

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
                {isPending ? <Spinner /> : (data?.totalItems ?? 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">In system</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                <Activity className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <CardTitle className="text-base">Quick Actions</CardTitle>
                <CardDescription className="text-xs">
                  Main menu for officers
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              className="w-full justify-between hover:cursor-pointer border bg-background text-black shadow-xs dark:border-input dark:bg-input/30 dark:text-white hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary transition-colors duration-300"
              asChild
            >
              <Link to="/officer/borrow-requests">
                Manage Requests
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              className="w-full justify-between hover:cursor-pointer border bg-background text-black shadow-xs dark:border-input dark:bg-input/30 dark:text-white hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary transition-colors duration-300"
              asChild
            >
              <Link to="/officer/returns">
                Process Returns
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default OfficerDashboard;

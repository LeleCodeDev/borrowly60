import {
  Activity,
  FileText,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Package,
  RotateCcw,
  Users,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import BorrowlyLogo from "../assets/BorrowlyHorizontal.png";
import { useAuth } from "../hooks/api/useAuth";
import type { UserRole } from "../types/user";
import { Button } from "./ui/button";

const LogoutModal = ({
  isOpen,
  onLogout,
  onOpenChange,
}: {
  isOpen: boolean;
  onLogout: () => void;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}) => (
  <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
    <AlertDialogContent className="max-w-sm gap-0 p-0 overflow-hidden">
      <AlertDialogHeader className="px-6 pt-6 pb-4">
        <div className="w-full flex items-center justify-center gap-3 mb-3">
          <AlertDialogTitle className=" text-xl font-semibold">
            Sign out ?
          </AlertDialogTitle>
        </div>
        <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
          You'll be returned to the login page. Any unsaved changes will be
          lost.
        </AlertDialogDescription>
      </AlertDialogHeader>

      <AlertDialogFooter className="px-6 py-4 border-t border-border bg-muted/30 flex flex-row gap-2 sm:gap-2">
        <AlertDialogCancel className="flex-1 cursor-pointer">
          Cancel
        </AlertDialogCancel>
        <Button
          className="flex-1 bg-red-600 hover:bg-red-700 cursor-pointer transition-colors gap-2"
          onClick={onLogout}
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign out
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

const RoleSidebar = ({ role }: { role: UserRole }) => {
  const menuItems = {
    admin: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        url: "/admin/dashboard",
      },
      {
        title: "Users",
        icon: Users,
        url: "/admin/users",
      },
      {
        title: "Items",
        icon: Package,
        url: "/admin/items",
      },
      {
        title: "Categories",
        icon: FolderTree,
        url: "/admin/categories",
      },
      {
        title: "Borrows",
        icon: FileText,
        url: "/admin/borrow-requests",
      },
      {
        title: "Returns",
        icon: RotateCcw,
        url: "/admin/returns",
      },
      {
        title: "Activity Log",
        icon: Activity,
        url: "/admin/logs",
      },
    ],
    borrower: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        url: "/dashboard",
      },
      {
        title: "Items",
        icon: Package,
        url: "/items",
      },
      {
        title: "Borrows",
        icon: FileText,
        url: "/borrow-requests",
      },
      {
        title: "Returns",
        icon: RotateCcw,
        url: "/returns",
      },
    ],
    officer: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        url: "/officer/dashboard",
      },
      {
        title: "Borrows",
        icon: FileText,
        url: "/officer/borrow-requests",
      },
      {
        title: "Returns",
        icon: RotateCcw,
        url: "/officer/returns",
      },
    ],
  };

  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Successfully logout");
    navigate("/login");
  };

  return (
    <Sidebar className="border-4" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link to="/" className="flex gap-3 items-center ">
              <SidebarMenuButton className="w-full py-7 flex items-center hover:cursor-pointer">
                <div className="flex items-center gap-2 text-primary">
                  <img src={BorrowlyLogo} className="max-w-45" />
                </div>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems[role].map((item) => {
                const isActive = location.pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      asChild
                      className={`transition-colors duration-200 ${
                        isActive
                          ? "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 hover:bg-blue-200 hover:text-blue-700 dark:hover:bg-blue-900 dark:hover:text-blue-300"
                          : "hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                      }`}
                    >
                      <Link to={item.url} className="flex items-center gap-2">
                        <item.icon className="w-5 h-4" />
                        <span className="text-base">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => {
                setIsModalOpen(true);
              }}
              className="hover:cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:bg-red-950/50 dark:hover:bg-red-950 px-4 py-2 transition-colors duration-200 flex items-center gap-2 text-base"
              tooltip="Logout"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <LogoutModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onLogout={handleLogout}
      />
    </Sidebar>
  );
};

export default RoleSidebar;

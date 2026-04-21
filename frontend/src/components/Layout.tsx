import { Outlet } from "react-router-dom";
import { SidebarProvider } from "./ui/sidebar";
import { useTheme } from "./ui/theme-provider";
import RoleSidebar from "./Sidebar";
import type { UserRole } from "../types/user";

const Layout = ({ role }: { role: UserRole }) => {
  const { theme } = useTheme();
  return (
    <SidebarProvider>
      <RoleSidebar role={role} />
      <main
        className={`flex-1 ${theme == "light" ? "bg-secondary" : "bg-background"}`}
      >
        <Outlet />
      </main>
    </SidebarProvider>
  );
};

export default Layout;

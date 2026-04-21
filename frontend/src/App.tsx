import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import Layout from "./components/Layout";
import { ThemeProvider, useTheme } from "./components/ui/theme-provider";
import AuthGuard from "./guards/AuthGuard";
import LandingPage from "./pages/LandingPage";
import AdminBorrowRequestPage from "./pages/admin/AdminBorrowRequestPage";
import AdminCategoryPage from "./pages/admin/AdminCategoryPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminItemPage from "./pages/admin/AdminItemPage";
import AdminLogPage from "./pages/admin/AdminLogPage";
import AdminReturnPage from "./pages/admin/AdminReturnPage";
import AdminUserPage from "./pages/admin/AdminUserPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import BorrowerBorrowPage from "./pages/borrower/BorrowerBorrowPage";
import BorrowerDashboard from "./pages/borrower/BorrowerDashboard";
import BorrowerItemPage from "./pages/borrower/BorrowerItemPage";
import BorrowerReturnPage from "./pages/borrower/BorrowerReturnPage";
import OfficerBorrowRequestPage from "./pages/officer/OfficerBorrowRequestPage";
import OfficerDashboard from "./pages/officer/OfficerDashboard";
import OfficerReturnPage from "./pages/officer/OfficerReturnPage";

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AppContent />
    </ThemeProvider>
  );
};

const AppContent = () => {
  const { theme } = useTheme();

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/"
            element={
              <AuthGuard allowedRoles={["borrower"]}>
                <Layout role="borrower" />
              </AuthGuard>
            }
          >
            <Route path="dashboard" element={<BorrowerDashboard />} />
            <Route path="items" element={<BorrowerItemPage />} />
            <Route path="borrow-requests" element={<BorrowerBorrowPage />} />
            <Route path="returns" element={<BorrowerReturnPage />} />
          </Route>

          <Route
            path="/officer"
            element={
              <AuthGuard allowedRoles={["officer"]}>
                <Layout role="officer" />
              </AuthGuard>
            }
          >
            <Route path="dashboard" element={<OfficerDashboard />} />
            <Route
              path="borrow-requests"
              element={<OfficerBorrowRequestPage />}
            />
            <Route path="returns" element={<OfficerReturnPage />} />
          </Route>

          <Route
            path="/admin"
            element={
              <AuthGuard allowedRoles={["admin"]}>
                <Layout role="admin" />
              </AuthGuard>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="items" element={<AdminItemPage />} />
            <Route path="categories" element={<AdminCategoryPage />} />
            <Route path="users" element={<AdminUserPage />} />
            <Route
              path="borrow-requests"
              element={<AdminBorrowRequestPage />}
            />
            <Route path="returns" element={<AdminReturnPage />} />
            <Route path="logs" element={<AdminLogPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster richColors theme={theme} position="top-center" />
    </>
  );
};

export default App;

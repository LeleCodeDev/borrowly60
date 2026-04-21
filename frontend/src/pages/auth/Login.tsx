import type { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import ButtonThemeSwitcher from "../../components/ui/ButtonThemeSwitcher";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import type { ApiError } from "../../types/apiResponse";
import type { LoginError } from "../../types/auth";
import { Spinner } from "../../components/ui/spinner";
import { useAuth } from "../../hooks/api/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<LoginError | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated, user, login } = useAuth();

  if (isAuthenticated) {
    if (user?.role === "admin")
      return <Navigate to="/admin/dashboard" replace />;
    if (user?.role === "officer")
      return <Navigate to="/officer/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors(null);

    login.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          toast.success(data.message);
          const role = data.data.user?.role;

          if (role === "admin") navigate("/admin/dashboard");
          else if (role === "borrower") navigate("/dashboard");
          else if (role === "officer") navigate("/officer/dashboard");
        },
        onError: (err) => {
          const error = err as AxiosError<ApiError<LoginError>>;
          toast.error(error.response?.data.message || "Login failed");
          if (error.response?.data.errors) {
            setFieldErrors(error.response.data.errors);
          }
        },
      },
    );
  };

  return (
    <div className="flex w-full min-h-screen justify-center items-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardAction>
            <ButtonThemeSwitcher />
          </CardAction>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <Label className="mb-3" htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                type="text"
                placeholder="example@email.com"
                className={`${fieldErrors?.email ? "border-red-600 border-3" : ""}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {fieldErrors?.email && (
                <p className="text-sm text-red-600 mt-1">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password" className="mb-3">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="password"
                  value={password}
                  className={`${fieldErrors?.password ? "border-red-600 border-3" : ""}`}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent hover:cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <Eye className="w-4 h-4" aria-hidden="true" />
                  )}
                </Button>
              </div>

              {fieldErrors?.password && (
                <p className="text-sm text-red-600 mt-1">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-4 pt-2">
              <Button
                variant="default"
                className={`w-full bg-primary hover:bg-blue-800 hover:cursor-pointer ${login.isPending && "cursor-not-allowed"} transition-all duration-150`}
                type="submit"
                disabled={login.isPending}
              >
                {login.isPending ? (
                  <span className="flex items-center gap-1">
                    <Spinner data-icon="inline-start" />
                    Loading...
                  </span>
                ) : (
                  "Login"
                )}
              </Button>

              <div className="flex gap-1 justify-center">
                <Label className="text-sm text-gray-500">
                  Don't have an account?
                </Label>
                <Link to="/register">
                  <Label className="text-sm text-primary underline-offset-4 hover:underline transition-all duration-100 hover:cursor-pointer">
                    Sign Up
                  </Label>
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;

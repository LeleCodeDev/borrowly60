import type { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
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
import type { RegisterError, RegisterRequest } from "../../types/auth";
import { Spinner } from "../../components/ui/spinner";
import { useAuth } from "../../hooks/api/useAuth";

const Register = () => {
  const [formData, setFormData] = useState<RegisterRequest>({
    username: "",
    password: "",
    email: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<RegisterError | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated, user, register } = useAuth();

  if (isAuthenticated) {
    if (user?.role === "admin")
      return <Navigate to="/admin/dashboard" replace />;
    if (user?.role === "officer")
      return <Navigate to="/officer/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  const handleRegister = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors(null);

    register.mutate(formData, {
      onSuccess: (data) => {
        toast.success(data.message);

        navigate("/dashboard");
      },
      onError: (err) => {
        const error = err as AxiosError<ApiError<RegisterError>>;
        toast.error(error.response?.data.message || "Register failed");
        if (error.response?.data.errors) {
          setFieldErrors(error.response.data.errors);
        }
      },
    });
  };

  return (
    <div className="flex w-full min-h-screen justify-center items-center ">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>

          <CardAction>
            <ButtonThemeSwitcher />
          </CardAction>
        </CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={handleRegister}>
            <div>
              <Label className="mb-3" htmlFor="username">
                Full name
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="John Doe"
                className={`${fieldErrors?.username ? "border-red-600 border-3" : ""}`}
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />

              {fieldErrors?.username && (
                <p className="text-sm text-red-600 mt-1">
                  {fieldErrors.username}
                </p>
              )}
            </div>

            <div>
              <Label className="mb-3" htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                type="text"
                placeholder="example@email.com"
                className={`${fieldErrors?.email ? "border-red-600 border-3" : ""}`}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              {fieldErrors?.email && (
                <p className="text-sm text-red-600 mt-1">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <Label className="mb-3" htmlFor="password">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="password"
                  className={`${fieldErrors?.password ? "border-red-600 border-3" : ""}`}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
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

            <div>
              <Label className="mb-3" htmlFor="phone">
                Phone
              </Label>
              <Input
                id="phone"
                type="text"
                placeholder="081234567890"
                className={`${fieldErrors?.phone ? "border-red-600 border-3" : ""}`}
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />

              {fieldErrors?.phone && (
                <p className="text-sm text-red-600 mt-1">{fieldErrors.phone}</p>
              )}
            </div>

            <div className="flex flex-col gap-4 pt-2">
              <Button
                variant="default"
                className={`w-full bg-primary hover:bg-blue-800 hover:cursor-pointer ${register.isPending && "cursor-not-allowed"} transition-all duration-150`}
                type="submit"
                disabled={register.isPending}
              >
                {register.isPending ? (
                  <span className="flex items-center gap-1">
                    <Spinner data-icon="inline-start" />
                    Loading...
                  </span>
                ) : (
                  "Register"
                )}
              </Button>

              <div className="flex gap-1 justify-center">
                <Label className="text-sm  text-gray-500">
                  Already have an account ?
                </Label>

                <Link to="/login">
                  <Label className="text-sm text-primary underline-offset-4 hover:underline transition-all duration-100 hover:cursor-pointer">
                    Sign In
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

export default Register;

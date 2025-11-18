import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Eye, EyeOff } from "lucide-react";
import { Logo } from "../components/Logo";
import eStoreLogo from "../assets/images/e-store.png";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema } from "../validations/loginSchema";
import { toast } from "react-toastify";

const Login = () => {
  const { user, login } = useAuth();
 
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [backendError, setBackendError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(loginSchema),
    });

    const onSubmit = async (data) => {
        try {
            setBackendError("");
            const res = await login.mutateAsync({
                email: data.email,
                password: data.password,
            });
            toast.success("Logged in successfully!");
            console.log(res.data.data.user.role);
            
            if (res.data.data.user.role === "admin")
                navigate("/", { replace: true })
            else {
                navigate("/products", { replace: true });
            }
        } catch (err) {
            toast.error("Login failed!");
            if (err.response) {
                const res = err.response;

        if (res.data?.errors) {
          Object.entries(res.data.errors).forEach(([field, message]) => {
            setError(field, { type: "backend", message });
          });
        } else if (res.data?.message) {
          setBackendError(res.data.message);
        } else {
          setBackendError("Something went wrong");
        }
      } else {
        setBackendError("Network error or server not reachable");
      }

      console.error(err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-40 items-center">
      {/* Left side */}
      <div className="hidden md:flex w-2/5 justify-center">
        <img src={eStoreLogo} alt="store" className="w-full object-contain" />
      </div>

      {/* Right side */}
      <div className="w-full md:w-3/5 lg:w-1/3 flex flex-col items-center">
        <Logo className="mb-10" />

        <div className="w-11/12 border border-primary rounded-lg p-6 lg:p-8 bg-background mb-10">
          <h1 className="text-textMain text-xl lg:text-2xl font-semibold text-center mb-6">
            Sign in to your account
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 w-full lg:px-10"
          >
            {/* Email */}
            <div>
              <label className="block text-textMain text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="text"
                {...register("email")}
                placeholder="jhon@example.com"
                className={`w-full bg-surface border rounded-lg px-4 py-3 text-textMain placeholder-textMuted focus:outline-none transition-colors ${
                  errors.email
                    ? "border-red-500"
                    : "border-border focus:border-primary"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-textMain text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="••••••••"
                  className={`w-full bg-surface border rounded-lg px-4 py-3 text-textMain placeholder-textMuted focus:outline-none transition-colors pr-12 ${
                    errors.password
                      ? "border-red-500"
                      : "border-border focus:border-primary"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-textMain transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

                        {backendError && (
                            <p className="text-red-500 text-sm -mt-7">{backendError}</p>
                        )}
                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={login.isPending}
                            className="w-full bg-primary hover:bg-emerald-600 text-textMain font-semibold py-3 rounded-lg transition-colors"
                        >
                            {login.isPending ? "Signing in..." : "Sign In"}
                        </button>


            {/* Sign up */}
            <div className="text-center text-sm text-textMuted">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-primary hover:text-emerald-400"
              >
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

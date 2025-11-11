import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Eye, EyeOff } from "lucide-react";
import { Logo } from "../components/Logo";
import eStoreLogo from "../assets/images/e-store.png";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { registerSchema } from "../validations/registerSchema";
import { toast } from "react-toastify";

const Register = () => {
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [backendError, setBackendError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm({
        resolver: yupResolver(registerSchema),
    });

    const onSubmit = async (data) => {
        try {
            setBackendError(""); // reset
            await registerUser(data.fullName, data.email, data.password);
            toast.success("Register successfully!");
            navigate("/products", { replace: true });
        } catch (err) {
            toast.error("Register failed!");
            if (err.response) {
                const res = err.response;
                // Field-specific backend errors
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
            <div className="w-full md:w-3/5 lg:w-2/5 flex flex-col items-center">
                <Logo className="mb-10" />

                <div className="w-11/12 border border-primary rounded-lg p-6 lg:p-8 bg-background mb-10">
                    <h1 className="text-textMain text-xl lg:text-2xl font-semibold text-center mb-6">
                        Create Your Account And<br />Start Shopping :)
                    </h1>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full lg:px-10">
                        {/* Full Name */}
                        <div>
                            <label className="block text-textMain text-sm font-medium mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                {...register("fullName")}
                                placeholder="John Doe"
                                className={`w-full bg-surface border rounded-lg px-4 py-3 text-textMain placeholder-textMuted focus:outline-none transition-colors ${errors.fullName ? "border-red-500" : "border-border focus:border-primary"
                                    }`}
                            />
                            {errors.fullName && (
                                <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-textMain text-sm font-medium mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                {...register("email")}
                                placeholder="john@example.com"
                                className={`w-full bg-surface border rounded-lg px-4 py-3 text-textMain placeholder-textMuted focus:outline-none transition-colors ${errors.email ? "border-red-500" : "border-border focus:border-primary"
                                    }`}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
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
                                    className={`w-full bg-surface border rounded-lg px-4 py-3 text-textMain placeholder-textMuted focus:outline-none transition-colors pr-12 ${errors.password ? "border-red-500" : "border-border focus:border-primary"
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
                                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-textMain text-sm font-medium mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    {...register("confirmPassword")}
                                    placeholder="••••••••"
                                    className={`w-full bg-surface border rounded-lg px-4 py-3 text-textMain placeholder-textMuted focus:outline-none transition-colors pr-12 ${errors.confirmPassword ? "border-red-500" : "border-border focus:border-primary"
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-textMain transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        {/* Backend general error */}
                        {backendError && (
                            <p className="text-red-500 text-sm mb-2">{backendError}</p>
                        )}

                        {/* Terms */}
                        <div className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                {...register("agreedToTerms")}
                                className="mt-1 w-4 h-4 accent-primary"
                            />
                            <label className="text-sm text-textMuted">
                                I agree to the{" "}
                                <a href="#" className="text-primary hover:text-emerald-400">
                                    Terms of Service
                                </a>{" "}
                                and{" "}
                                <a href="#" className="text-primary hover:text-emerald-400">
                                    Privacy Policy
                                </a>
                            </label>
                            {errors.agreedToTerms && (
                                <p className="text-red-500 text-xs mt-1">{errors.agreedToTerms.message}</p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-primary hover:bg-emerald-600 text-textMain font-semibold py-3 rounded-lg transition-colors"
                        >
                            {isSubmitting ? "Signing up..." : "Sign Up"}
                        </button>

                        <div className="text-center text-sm text-textMuted">
                            Already have an account?{" "}
                            <Link to="/login" className="text-primary hover:text-emerald-400">
                                Sign in
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;

import { lazy, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Eye, EyeOff } from 'lucide-react';
import eStoreLogo from '../../assets/images/e-store.webp';
const Logo = lazy(() => import('../../components/Logo'));

import { useAuth } from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { registerSchema } from '../../validations/registerSchema';
import { toast } from 'react-toastify';

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [backendError, setBackendError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data) => {
    try {
      setBackendError(''); // reset
      await registerUser.mutateAsync({
        fullname: data.fullname,
        email: data.email,
        password: data.password,
      });

      toast.success('Register successfully!');
      navigate('/products', { replace: true });
    } catch (err) {
      toast.error('Register failed!');
      if (err.response) {
        const res = err.response;
        // Field-specific backend errors
        if (res.data?.errors) {
          Object.entries(res.data.errors).forEach(([field, message]) => {
            setError(field, { type: 'backend', message });
          });
        } else if (res.data?.message) {
          setBackendError(res.data.message);
        } else {
          setBackendError('Something went wrong');
        }
      } else {
        setBackendError('Network error or server not reachable');
      }
      console.error(err);
    }
  };

  return (
    <main className="flex flex-col md:flex-row gap-40 items-center">
      {/* Left side */}
      <div className="hidden md:flex w-2/5 justify-center">
        <img
          src={eStoreLogo}
          width={630}
          height={900}
          alt="store"
          className="w-full object-contain"
          fetchPriority="high"
        />
      </div>

      {/* Right side */}
      <div className="w-full md:w-3/5 lg:w-2/5 flex flex-col items-center">
        <Logo className="mb-10" />

        <div className="w-11/12 border border-primary rounded-lg p-6 lg:p-8 bg-background mb-10">
          <h1 className="text-textMain text-xl lg:text-2xl font-semibold text-center mb-6">
            Create Your Account And
            <br />
            Start Shopping :)
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full lg:px-10">
            {/* Full Name */}
            <div>
              <label htmlFor="full_name" className="block text-textMain text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                id="full_name"
                type="text"
                {...register('fullname')}
                placeholder="John Doe"
                className={`w-full bg-surface border rounded-lg px-4 py-3 text-textMain placeholder-textMuted focus:outline-none transition-colors ${
                  errors.fullname ? 'border-red-500' : 'border-border focus:border-primary'
                }`}
              />
              {errors.fullname && (
                <p className="text-red-500 text-xs mt-1">{errors.fullname.message || ' '}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-textMain text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                placeholder="john@example.com"
                className={`w-full bg-surface border rounded-lg px-4 py-3 text-textMain placeholder-textMuted focus:outline-none transition-colors ${
                  errors.email ? 'border-red-500' : 'border-border focus:border-primary'
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message || ' '}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-textMain text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="••••••••"
                  className={`w-full bg-surface border rounded-lg px-4 py-3 text-textMain placeholder-textMuted focus:outline-none transition-colors pr-12 ${
                    errors.password ? 'border-red-500' : 'border-border focus:border-primary'
                  }`}
                />
                <button
                  aria-label="toggle show password"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-textMain transition-colors cursor-pointer w-10 h-10 flex justify-end items-center"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message || ' '}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="password-confirmation"
                className="block text-textMain text-sm font-medium mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="password-confirmation"
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  placeholder="••••••••"
                  className={`w-full bg-surface border rounded-lg px-4 py-3 text-textMain placeholder-textMuted focus:outline-none transition-colors pr-12 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-border focus:border-primary'
                  }`}
                />
                <button
                  type="button"
                  aria-label="toggel show password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-textMain transition-colors cursor-pointer w-10 h-10 flex justify-end items-center"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message || ' '}</p>
              )}
            </div>

            {/* Backend general error */}
            {backendError && <p className="text-red-500 text-sm mb-2">{backendError || ' '}</p>}

            {/* Terms */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms-privacy"
                {...register('agreedToTerms')}
                className="mt-1 w-4 h-4 accent-primary"
              />
              <label htmlFor="terms-privacy" className="text-sm text-textMuted">
                I agree to the{' '}
                <a href="/terms" className="text-primary hover:text-emerald-400">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-primary hover:text-emerald-400">
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
              disabled={registerUser.isPending}
              className="w-full bg-primary hover:bg-emerald-600 text-textMain [text-shadow:0_0_2px_rgba(0,0,0,0.8)] font-semibold py-3 rounded-lg transition-colors"
            >
              {registerUser.isPending ? 'Signing up...' : 'Sign Up'}
            </button>

            <div className="text-center text-sm text-textMuted">
              Already have an account?{' '}
              <Link to="/login" className="text-primary underline hover:text-emerald-400">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Register;

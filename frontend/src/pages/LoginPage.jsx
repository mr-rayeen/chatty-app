import React, { useState } from 'react'
import { Eye, EyeClosed, LoaderCircleIcon, LockKeyhole, Mail, MessageSquare, User2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import AuthImagePattern from '../components/AuthImagePattern';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { login, isLoggingIn } = useAuthStore();

  const validateForm = () => {
    
     if (!formData.email.trim()) {
            toast.error("Email is required");
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            toast.error("Email is invalid");   
            return false;
        }
        if (!formData.password) {
            toast.error("Password is required");
            return false;
        }
        if (formData.password.length < 6) {
                toast.error("Password must be at least 6 characters");
            return false;
        }
    
    return true;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const success = validateForm();

    if (success) login(formData);
  }


  return (
		<div className="min-h-screen grid lg:grid-cols-2 mt-10">
			{/* Left Side  */}
			<div className="flex flex-col justify-center items-center p-6 sm:p-12">
				<div className="w-full max-w-md space-y-8">
					{/* Logo */}
					<div className="text-center mb-8">
						<div className="flex flex-col items-center gap-2 group">
							<div
								className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
                                    group-hover:bg-primary/20 transition-colors"
							>
								<MessageSquare className="size-6 text-primary" />
							</div>
							<h1 className="text-2xl font-bold mt-2">
								Welcome Back!
							</h1>
							<p className="text-base-content/60">
								Sign in to your account.
							</p>
						</div>
					</div>

					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="form-control">
							<label className="label">
								<span className="label-text font-medium">
									Email
								</span>
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
									<Mail className="size-5 text-base-content/40" />
								</div>
								<input
									type="text"
									className={`input input-bordered w-full pl-10`}
									placeholder="you@example.com"
									value={formData.email}
									onChange={(e) =>
										setFormData({
											...formData,
											email: e.target.value,
										})
									}
								/>
							</div>
						</div>

						<div className="form-control">
							<label className="label">
								<span className="label-text font-medium">
									Password
								</span>
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
									<LockKeyhole className="size-5 text-base-content/40" />
								</div>
								<input
									type={
										showPassword
											? "text"
											: "password"
									}
									className={`input input-bordered w-full pl-10`}
									placeholder="********"
									value={formData.password}
									onChange={(e) =>
										setFormData({
											...formData,
											password: e.target.value,
										})
									}
								/>
								<button
									type="button"
									className="absolute inset-y-0 right-0 flex items-center pr-3"
									onClick={() => {
										setShowPassword(
											!showPassword
										);
									}}
								>
									{showPassword ? (
										<EyeClosed className="size-5 text-base-content/40" />
									) : (
										<Eye className="size-5 text-base-content/40" />
									)}
								</button>
							</div>
						</div>

						<button
							type="submit"
							className="btn btn-primary w-full"
							disabled={isLoggingIn}
						>
							{isLoggingIn ? (
								<>
									<LoaderCircleIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
									Loading...
								</>
							) : (
								"Sign In"
							)}
						</button>
					</form>

					<div className="text-center">
						<p className="text-base-content/60">
							Don&apos;t have an account?{" "}
							<Link
								to="/signup"
								className="link link-primary"
							>
								Create account
							</Link>
						</p>
					</div>
				</div>
			</div>

			{/* Right Side */}

			<AuthImagePattern
				title="Welcome Back!"
				subtitle="Sign in to continue your conversations and catch up with your messages."
			/>
		</div>
  );
}

export default LoginPage
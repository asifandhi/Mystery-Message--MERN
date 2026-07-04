import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser,checkUsername } from "../api/api";
import { useToast } from "../components/toast/ToastContext";

export default function Register() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [usernameMsg, setUsernameMsg] = useState("");

  const {register,handleSubmit,getValues,formState: { errors }} = useForm();

  const handleUsernameBlur = async () => {
    const username = getValues("username");
    if (!username || username.length < 3) return;
    try {
      const res = await checkUsername(username);
      setUsernameMsg(res.data.data.isUnique ? "✓ Available" : "✗ Already taken");
      
    } catch {
      setUsernameMsg("");
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser(data);
      showToast("Account created! Please verify your email.", "success");
      navigate(`/verify-code?username=${data.username}`);
    } catch (err) {
      showToast(err.response?.data?.message || "Registration failed. Please try again.", "error");
    
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex p-2 items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8">

        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Create account</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Start receiving anonymous messages</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-700 dark:text-gray-300">Username</label>
            <input
              type="text"
              placeholder="username"
              className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-600"
              {...register("username", {
                required: "Username is required",
                minLength: { value: 3, message: "Min 3 characters" },
                maxLength: { value: 20, message: "Max 20 characters" },
                pattern: { value: /^[a-zA-Z0-9_]+$/, message: "Only letters, numbers, underscore " },
              })}
              onBlur={handleUsernameBlur}
            />
            {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
            {!errors.username && usernameMsg && (
              <p className={`text-xs ${usernameMsg.startsWith("✓") ? "text-green-500" : "text-red-500"}`}>
                {usernameMsg}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              placeholder="email"
              className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-600"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" },
              })}
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              placeholder="password"
              className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-600"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Min 6 characters" },
              })}
            />
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full py-2 text-sm rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Register"}
          </button>

        </form>

        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-gray-900 dark:text-white font-medium hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}
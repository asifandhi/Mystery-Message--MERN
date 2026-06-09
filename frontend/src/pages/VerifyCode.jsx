import React from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate,useSearchParams } from 'react-router-dom'
import { verifyCode } from '../api/api'



function VerifyCode() {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const username = searchParams.get("username");
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);

    const {register,handleSubmit,formState: { errors },} = useForm();

    const onSubmit = async (data) => {
    setServerError("");
    setLoading(true);
    try {
      await verifyCode({ username, code: data.code });
      navigate("/login");
    } catch (err) {
      setServerError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8">

        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Verify your email</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Enter the OTP sent to your email
            {username && (
              <span className="text-gray-900 dark:text-white font-medium"> (@{username})</span>
            )}
          </p>
        </div>

        {serverError && (
          <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2 mb-4">
            {serverError}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-700 dark:text-gray-300">Verification Code</label>
            <input
              type="text"
              placeholder="Enter 6-digit code"
              maxLength={6}
              className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-600 tracking-widest text-center"
              {...register("code", {
                required: "Code is required",
                minLength: { value: 6, message: "Code must be 6 digits" },
                maxLength: { value: 6, message: "Code must be 6 digits" },
                pattern: { value: /^[0-9]+$/, message: "Numbers only" },
              })}
            />
            {errors.code && (
              <p className="text-xs text-red-500">{errors.code.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full py-2 text-sm rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>

        </form>

        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-6">
          Wrong account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-gray-900 dark:text-white font-medium hover:underline cursor-pointer"
          >
            Register again
          </span>
        </p>

      </div>
    </div>
  );
  
}


export default VerifyCode

import React,{useState} from 'react'
import { useForm } from 'react-hook-form'
import { Link,useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '../store/authSlice'
import { loginUser,getMe } from '../api/api'



function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);
    const {register,handleSubmit,formState:{errors}} = useForm();

    const onSubmit = async (data)=>{
        setServerError("");
        setLoading(true)
        try {
            const res = await loginUser(data);
            const me =  await getMe();

            dispatch(login(me.data.data));
            navigate("/dashboard")
        } catch (err) {
            setServerError(err.response?.data?.message || "Login failed. Please try again.");
            
        }
        finally{
            setLoading(false);

        }

    }
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4'>
        <div className='w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8'>
            <div className='mb-6'>
                <h1 className='text-2xl font-semibold text-gray-900 dark:text-white'>Welcome back</h1>
                <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>Login to your MysteryMsg account</p>
            </div>

            {serverError && (
                <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2 mb-4">
                     {serverError}
                </p>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='flex flex-col gap-1'>
                    <label className="text-sm text-gray-700 dark:text-gray-300">  Email</label>
                    <input
                        type="email"
                        placeholder="Email"
                        className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-600"
                        {...register("email", { required: "email is  required",
                            pattern:{ value: /^\S+@\S+\.\S+$/, message: "Invalid email" } },)}
                    />
                    {errors.email && (
                        <p className="text-xs text-red-500">{errors.email.message}</p>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-700 dark:text-gray-300">Password</label>
                    <input
                    type="password"
                    placeholder="Password"
                    className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-600"
                    {...register("password", { required: "Password is required" })}
                    />
                    {errors.password && (
                    <p className="text-xs text-red-500">{errors.password.message}</p>
                    )}
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 w-full py-2 text-sm rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-6">
                Don't have an account?{" "}
                <Link to="/register" className="text-gray-900 dark:text-white font-medium hover:underline">
                    Register
                </Link>
            </p>
        </div>
      
    </div>
  )
}

export default Login

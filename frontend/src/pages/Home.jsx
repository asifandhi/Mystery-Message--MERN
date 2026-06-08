import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Home() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="flex flex-col items-center text-center gap-6 max-w-lg">

        <span className="text-xs px-3 py-1 rounded-full border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400">
          100% Anonymous
        </span>

        <h1 className="text-4xl sm:text-5xl font-semibold text-gray-900 dark:text-white leading-tight">
          Receive messages <br /> without revealing who
        </h1>

        <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">
          Share your link. Get honest, anonymous messages from anyone. Reply privately.
        </p>

        {isAuthenticated ? (
          <Link
            to="/dashboard"
            className="px-6 py-2.5 text-sm rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors"
          >
            Go to Dashboard
          </Link>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/register"
              className="px-6 py-2.5 text-sm rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-6 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Login
            </Link>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mt-6 w-full">
          {[
            { step: "1", text: "Create account" },
            { step: "2", text: "Share your link" },
            { step: "3", text: "Get messages" },
          ].map(({ step, text }) => (
            <div
              key={step}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
            >
              <span className="text-xs font-medium text-gray-400 dark:text-gray-600">Step {step}</span>
              <p className="text-sm text-gray-700 dark:text-gray-300">{text}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
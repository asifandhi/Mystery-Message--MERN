import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { checkThread } from "../api/api";

export default function ThreadCheck() {
  const { threadToken } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await checkThread(threadToken);
        setData(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Thread not found");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [threadToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="w-8 h-8 border-2 border-gray-300 dark:border-gray-700 border-t-gray-900 dark:border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 text-center flex flex-col gap-4">
          <p className="text-sm text-red-500">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="text-sm px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Back 
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 flex flex-col gap-5">

        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Your thread</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Sent to <span className="font-medium text-gray-900 dark:text-white">@{data?.username}</span>
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-xs text-gray-400 dark:text-gray-600 uppercase tracking-wide">Your message</p>
          <div className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-700 dark:text-gray-300">{data?.content}</p>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-xs text-gray-400 dark:text-gray-600 uppercase tracking-wide">Their reply</p>
          {data?.reply ? (
            <div className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-700 dark:text-gray-300">{data.reply}</p>
            </div>
          ) : (
            <div className="px-4 py-3 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-400 dark:text-gray-600">No reply yet — check back later</p>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-600">
          Sent {new Date(data?.createdAt).toLocaleString()}
        </p>

        <button
          onClick={() => navigate(-1)}
          className="w-full py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
         Back
        </button>

      </div>
    </div>
  );
}
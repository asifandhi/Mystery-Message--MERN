import react,{ useState } from "react";
import { useParams } from "react-router-dom";
import { sendMessage } from "../api/api";

export default function PublicProfile() {
  const { username } = useParams();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [threadToken, setThreadToken] = useState(null);

  const handleSend = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await sendMessage(username, { content });
      const token = res.data.data.threadToken;

      const existing = JSON.parse(localStorage.getItem("myThreads") || "[]");
      const updated = [
        ...existing,
        {
          threadToken: token,
          to: username,
          sentAt: new Date().toISOString(),
          preview: content.slice(0, 50),
        },
      ];
      localStorage.setItem("myThreads", JSON.stringify(updated));

      setThreadToken(token);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

 
  if (sent) {
    return (
      
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xl">
            ✓
          </div>
           
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Message sent!</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Sent anonymously to <span className="font-medium text-gray-900 dark:text-white">@{username}</span>
          </p>

           
           <a
            href={`/thread/${threadToken}`}
            className="w-full py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-center"
          >
            Check reply later
          </a>

          
          <button
            onClick={() => { setSent(false); setContent(""); }}
            className="w-full py-2 text-sm rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors"
          >
            Send another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 flex flex-col gap-5">

        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Send a message
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            to <span className="font-medium text-gray-900 dark:text-white">@{username}</span> — 100% anonymous
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <textarea
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your anonymous message..."
          className="w-full text-sm px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-600"
        />

        <button
          onClick={handleSend}
          disabled={loading || !content.trim()}
          className="w-full py-2 text-sm rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send anonymously"}
        </button>

        <p className="text-xs text-center text-gray-400 dark:text-gray-600">
          Your identity is never revealed to @{username}
        </p>

      </div>
    </div>
  );
}
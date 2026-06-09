import react,{ useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { sendMessage } from "../api/api";
import { useNavigate } from "react-router-dom";

import { getPublicAcceptStatus } from "../api/api";

export default function PublicProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [threadToken, setThreadToken] = useState(null);
  const [sent, setSent] = useState(false);
  const [acceptStatus,setAcceptStatus] = useState(true)

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
          preview: content.trim(),
        },
      ];
      localStorage.setItem("myThreads", JSON.stringify(updated));

      setThreadToken(token);
      setContent("")
      setSent(true);

    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  getPublicAcceptStatus(username)
    .then((res) => {
      setAcceptStatus(res.data.data.isAcceptingMessages) 
    })
    .catch(() => setError("User not found"))
}, [username])

 
  if(!acceptStatus) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-red-600  rounded-2xl p-8 flex flex-col gap-5">

          <h1 className=" text-center text-red-600  ">
          {username} is not Accepting the Message 
        </h1>

        

      </div>
      
    </div>

    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      
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


        {sent && (
          <div className="text-sm bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-900 rounded-lg px-3 py-2 flex items-center justify-between">
            <span className="text-green-700 dark:text-green-400">Message sent successfully!</span>
            
          </div>
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

        <button
          onClick={() => navigate(`/threads/${username}`)}
          className="w-full sm:mb-5 m-3 py-2 text-sm text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-gray-400 transition-colors"
        >
          View messages you sent to {username}
        </button>

        <p className="text-xs text-center text-gray-400 dark:text-gray-600">
          Your identity is never revealed to @{username}
        </p>

      </div>
      
    </div>
  );
}
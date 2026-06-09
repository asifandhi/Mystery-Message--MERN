import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

export default function SentThreads() {
  const { username } = useParams()
  const navigate = useNavigate()
  const [threads, setThreads] = useState([])

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem("myThreads") || "[]")
    setThreads(all.filter((t) => t.to === username))
  }, [username])

  return (
    <div className="flex justify-center min-h-screen px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          Messages to @{username}
        </h1>
        <p className="text-sm text-gray-400 mb-6">From this device only</p>

        {threads.length === 0 ? (
          <p className="text-sm text-gray-400">No messages sent to this user from this device.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {threads.map((t) => (
              <button
                key={t.threadToken}
                onClick={() => navigate(`/thread/${t.threadToken}`)}
                className="text-left w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
              >
                <p className="text-sm text-gray-800 dark:text-gray-200 truncate">{t.preview}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(t.sentAt).toLocaleDateString()}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
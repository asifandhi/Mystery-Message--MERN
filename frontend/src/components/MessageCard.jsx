import React,{useState} from 'react'
import { deleteMessage,replyToMessage } from '../api/api.js';

function MessageCard({ message, onDelete }) {

    const [replyText, setReplyText] = useState("");
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [loading, setLoading] = useState(false);
    const [localReply, setLocalReply] = useState(message.reply || null);

     const handleDelete = async () => {
    await deleteMessage(message._id);
    onDelete(message._id);
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;
    setLoading(true);
    await replyToMessage(message._id, { reply: replyText });
    setLocalReply(replyText);
    setShowReplyBox(false);
    setLoading(false);
  };


  return (
    <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col gap-3'>
        <p className='text-gray-800 dark:text-gray-100 text-sm leading-relaxed'>{message.content}</p>
        <span className='text-xs text-gray-400 dark:text-gray-600'>{new Date(message.createdAt).toLocaleDateString()}</span>
        {localReply ? (
            <div className='border-l-2 border-gray-300 dark:border-gray-700 pl-3'>
                <p className='text-xs text-gray-400 dark:text-gray-500 mb-1'>Your reply</p>
                <p className='text-sm text-gray-700 dark:text-gray-300'>{localReply}</p>
            </div>
        ):(
            <>
            {showReplyBox && (
                <div className='flex flex-col gap-2'>
                    <textarea
                    rows={2}
                    value={replyText}
                    onChange={(e)=> setReplyText(e.target.value)}
                    placeholder='Write a reply...!'
                    className='w-full text-sm px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-transparent text-gray-800 dark:text-gray-100 resize-none focus:outline-none focus:ring-1 focus:ring-gray-400'

                    />
                    <div className='flex gap-3'>
                        <button
                        disabled={loading}
                        onClick={handleReply}
                        className='text-xs px-3 py-1.5 rounded-md bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors disabled:opacity-50'
                        >
                            {loading ? "Sending" : "send"}
                        </button>
                        <button
                            onClick={() => setShowReplyBox(false)}
                            className='text-xs px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
                            >
                            Cancel
                        </button>
                    </div>

                </div>
            )}
            </>
        )}

        <div className='flex items-center justify-between pt-1'>
            {!localReply && !showReplyBox && (
                <button
                className='text-xs px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
                onClick={()=> setShowReplyBox(true)}>
                    Reply

                </button>
            )}
            {localReply && <div />}
            <button
          onClick={handleDelete}
          className="text-xs px-3 py-1.5 rounded-md border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors ml-auto"
        >
          Delete
        </button>
        </div>
      
    </div>
  )
}

export default MessageCard

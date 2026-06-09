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
    <div>
        <p>{message.content}</p>
        <span>{new Date(message.createdAt).toLocaleDateString()}</span>
        {localReply ? (
            <div>
                <p>Your reply</p>
                <p>{localReply}</p>
            </div>
        ):(
            <>
            {showReplyBox && (
                <div>
                    <textarea
                    rows={2}
                    value={replyText}
                    onChange={(e)=> setReplyText(e.target.value)}
                    placeholder='Write a reply...!'

                    />
                    <div>
                        <button
                        disabled={loading}
                        onClick={handleReply}
                        >
                            {loading ? "Sending" : "send"}
                        </button>
                        <button
                            onClick={() => setShowReplyBox(false)}
                            >
                            Cancel
                        </button>
                    </div>

                </div>
            )}
            </>
        )}

        <div>
            {!localReply && !showReplyBox && (
                <button
                onClick={()=> showReplyBox(true)}>
                    Reply

                </button>
            )}
            {localReply && <div />}
            <button
          onClick={handleDelete}
          className=""
        >
          Delete
        </button>
        </div>
      
    </div>
  )
}

export default MessageCard

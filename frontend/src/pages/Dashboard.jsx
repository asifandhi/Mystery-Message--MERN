import React,{useState,useEffect} from 'react'
import { useSelector } from 'react-redux'
import { getMessages } from '../api/api.js'
import { toggleAcceptStatus,getAcceptStatus, deleteAccount } from '../api/api.js'
import MessageCard from '../components/MessageCard.jsx'




function Dashboard() {
    const { user } = useSelector((state) => state.auth);
    
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [copied, setCopied] = useState(false);


  const shareLink = `${window.location.origin}/u/${user?.username}`;

    useEffect(()=>{
        const fetchData = async ()=>{
            try {
                const [msgRes,statusRes]= await Promise.all([
                    getMessages(),
                    getAcceptStatus()
                ]);
                
                

                setMessages(msgRes.data.data.messages);
                setIsAccepting(statusRes.data.data.isAcceptingMessages)
            } catch (err) {
                console.error(err);
                
            }
            finally{
                setLoading(false);
            }
        };
        fetchData();
    },[])
    
    
    const handleDelete = async () => {
  if (!window.confirm("Delete your account? This cannot be undone.")) return;
  try {
    await deleteAccount();
    dispatch(logout());
    navigate("/");
  } catch (err) {
    console.error(err);
  }
};
    const handleToggle = async () => {
        setAccepting(true);
        try {
        const res = await toggleAcceptStatus();
        setIsAccepting(res.data.data.isAcceptingMessages);
        } catch (err) {
        console.error(err);
        } finally {
        setAccepting(false);
        }
    };

    const handleDeleteMessage = (id) => {
    setMessages((prev) => prev.filter((m) => m._id !== id));
    };

    const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
                <div className="w-8 h-8 border-2 border-gray-300 dark:border-gray-700 border-t-gray-900 dark:border-t-white rounded-full animate-spin" />
            </div>
        );
    }


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 px-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">

        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">@{user?.username}</p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col gap-3">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Your share link</p>
          <div className="flex items-center gap-2">
            <p className="flex-1 text-sm text-gray-500 dark:text-gray-400 truncate bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg">
              {shareLink}
            </p>
            <button
              onClick={handleCopy}
              disabled={copied}
              className=" bg-transparent  text-sm px-4 py-2 rounded-lg hover:bg-black border border-gray-300 dark:border-gray-700   dark:text-gray-300  dark:hover:bg-white dark:hover:text-black hover:text-white text-black transition-colors whitespace-nowrap"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Accepting messages</p>
            <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">
              {isAccepting ? "People can send you messages" : "No one can send you messages"}
            </p>
          </div>
          <button
            onClick={handleToggle}
            disabled={accepting}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-50 ${
              isAccepting ? "bg-gray-900 dark:bg-white" : "bg-gray-300 dark:bg-gray-700"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform duration-200 ${
                isAccepting
                  ? "translate-x-5 bg-white dark:bg-gray-900"
                  : "translate-x-0 bg-white dark:bg-gray-400"
              }`}
            />
          </button>
        </div>

        <button
          onClick={handleDelete}
          className="bg-white dark:bg-gray-900 border border-red-200 dark:border-red-900 rounded-xl p-4 flex items-center justify-between w-full hover:bg-red-50 dark:hover:bg-red-950 transition-colors "
        >
          <div >
            <p className="text-left text-sm font-medium text-red-600 dark:text-red-400">Delete Account</p>
            <p className=" text-xs text-gray-400 dark:text-gray-600 mt-0.5">Permanently remove your account</p>
          </div>
        </button>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Messages ({messages?.length})
          </p>
          {messages?.length === 0 ? (
            <div className="text-center py-12 text-sm text-gray-400 dark:text-gray-600 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
              No messages yet. Share your link to get started.
            </div>
          ) : (
            messages?.map((msg) => (
              <MessageCard key={msg._id} message={msg} onDelete={handleDeleteMessage} />
            ))
          )}
        </div>

      </div>
    </div>
  );
  
}

export default Dashboard

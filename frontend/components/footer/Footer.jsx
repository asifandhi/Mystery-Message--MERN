import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between h-14 gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span>© {new Date().getFullYear()} MysteryMsg. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-gray-900 dark:hover:text-white transition-colors">Login</Link>
            <Link to="/register" className="hover:text-gray-900 dark:hover:text-white transition-colors">Register</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
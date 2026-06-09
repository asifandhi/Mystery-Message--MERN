import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="w-full items-center border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="w-full   max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex   items-center justify-center h-14 gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span>© {new Date().getFullYear()} MysteryMsg. All rights reserved.</span>          
        </div>
      </div>
    </footer>
  );
}

export default Footer;
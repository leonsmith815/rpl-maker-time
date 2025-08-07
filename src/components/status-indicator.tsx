import { useState, useEffect } from "react";

function StatusIndicator() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkStatus = () => {
      const now = new Date();
      const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const hour = now.getHours();
      
      // Check if it's Sunday (closed all day)
      if (day === 0) {
        setIsOpen(false);
        return;
      }
      
      // Monday-Thursday: 11 AM - 7 PM
      if (day >= 1 && day <= 4) {
        setIsOpen(hour >= 11 && hour < 19);
        return;
      }
      
      // Friday-Saturday: 11 AM - 4 PM
      if (day === 5 || day === 6) {
        setIsOpen(hour >= 11 && hour < 16);
        return;
      }
    };

    checkStatus();
    
    // Update every minute
    const interval = setInterval(checkStatus, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${
      isOpen 
        ? 'bg-green-500/10 border-green-500/20' 
        : 'bg-red-500/10 border-red-500/20'
    }`}>
      <div className={`w-2 h-2 rounded-full animate-pulse ${
        isOpen ? 'bg-green-500' : 'bg-red-500'
      }`} />
      <span className={`text-sm font-medium ${
        isOpen ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
      }`}>
        Currently {isOpen ? 'Open' : 'Closed'}
      </span>
    </div>
  );
}

export { StatusIndicator };
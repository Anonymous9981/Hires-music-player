import React, { useState, useEffect } from 'react';

let showToast;

const Toast = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    showToast = (message, type = 'info') => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, message, type }]);
      
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }, 3000);
    };
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const getToastStyles = (type) => {
    const baseStyles = "mb-2 p-4 rounded-lg shadow-md transition-all duration-300 transform";
    const typeStyles = {
      success: "bg-green-500 text-white",
      error: "bg-red-500 text-white",
      warning: "bg-yellow-500 text-white",
      info: "bg-blue-500 text-white"
    };
    return `${baseStyles} ${typeStyles[type] || typeStyles.info}`;
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={getToastStyles(toast.type)}
          onClick={() => removeToast(toast.id)}
        >
          <div className="flex justify-between items-center">
            <span>{toast.message}</span>
            <button className="ml-4 text-white hover:text-gray-200">
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export { showToast };
export default Toast;

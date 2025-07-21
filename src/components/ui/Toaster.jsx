import React, { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

let toastId = 0;
const toasts = [];
const listeners = [];

const addToast = (toast) => {
  const id = toastId++;
  const newToast = { id, ...toast };
  toasts.push(newToast);
  listeners.forEach(listener => listener([...toasts]));
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    removeToast(id);
  }, 5000);
  
  return id;
};

const removeToast = (id) => {
  const index = toasts.findIndex(toast => toast.id === id);
  if (index > -1) {
    toasts.splice(index, 1);
    listeners.forEach(listener => listener([...toasts]));
  }
};

export const toast = {
  success: (message) => addToast({ type: 'success', message }),
  error: (message) => addToast({ type: 'error', message }),
  warning: (message) => addToast({ type: 'warning', message }),
  info: (message) => addToast({ type: 'info', message }),
};

export const Toaster = () => {
  const [toastList, setToastList] = useState([]);

  useEffect(() => {
    const listener = (newToasts) => {
      setToastList(newToasts);
    };
    
    listeners.push(listener);
    
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-warning-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getBackgroundColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-600';
      case 'error':
        return 'bg-red-600';
      case 'warning':
        return 'bg-warning-600';
      case 'info':
        return 'bg-blue-600';
      default:
        return 'bg-primary-600';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toastList.map((toast) => (
        <div
          key={toast.id}
          className={`${getBackgroundColor(toast.type)} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 max-w-sm animate-slide-up`}
        >
          {getIcon(toast.type)}
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
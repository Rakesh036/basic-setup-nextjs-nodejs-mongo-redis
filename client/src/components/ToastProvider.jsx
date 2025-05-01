// components/ToastProvider.js
'use client';

import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within a ToastProvider');
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = (message, duration = 3000) => {
        const id = Date.now().toString();
        setToasts((prev) => [...prev, { id, message, duration }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-5 right-5 flex flex-col gap-2 z-50 min-h-7">
                {toasts.map((toast) => (
                    <Toast key={toast.id} message={toast.message} duration={toast.duration} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

const Toast = ({ message, duration }) => {
    return (
        <div className="bg-white h-full text-black shadow-lg rounded-xl p-4 w-80 relative overflow-hidden">
            <p>{message}</p>
            <div
                className="absolute bottom-0 left-0 h-full bg-blue-500 animate-progress"
                style={{ animationDuration: `${duration}ms` }}
            >ghghfgh
                <div className="absolute top-0 left-0 w-full h-full bg-blue-500 animate-progress" />
            </div>
        </div>
    );
};

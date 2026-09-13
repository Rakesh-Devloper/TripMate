import React from 'react';
export default function Toast({toast,onClose=()=>{}}){if(!toast)return null;return <div className="fixed bottom-5 right-5 z-[100] max-w-sm rounded-2xl bg-slate-900 text-white px-5 py-4 shadow-2xl"><div className="font-semibold">{toast.message}</div><button onClick={onClose} className="text-xs opacity-70 mt-1">Dismiss</button></div>}

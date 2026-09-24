import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16 space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-soft">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="font-serif text-3xl font-extrabold text-navy-900">Access Restricted</h1>
      <p className="text-sm text-gray-500 max-w-sm">
        This area is restricted to campus administrators or authorized exchange participants only.
      </p>
      <div className="pt-2 flex items-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-900 text-white text-xs font-bold hover:bg-navy-800 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Return to Safety</span>
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;

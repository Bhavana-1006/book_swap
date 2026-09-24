import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16 space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-cream-200 text-brand-600 flex items-center justify-center shadow-soft">
        <BookOpen className="w-8 h-8" />
      </div>
      <h1 className="font-serif text-5xl font-extrabold text-navy-900">404</h1>
      <h2 className="font-serif text-2xl font-bold text-navy-900">Page Not Found</h2>
      <p className="text-sm text-gray-500 max-w-sm">
        The book listing or campus page you are looking for may have been moved, removed, or doesn't exist.
      </p>
      <div className="pt-2 flex items-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Go to Home</span>
        </Link>
        <Link
          to="/browse"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-cream-300 bg-white text-navy-900 text-xs font-bold hover:bg-cream-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Books</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

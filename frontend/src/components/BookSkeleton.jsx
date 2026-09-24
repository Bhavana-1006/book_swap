import React from 'react';

const BookSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-cream-200 overflow-hidden shadow-soft animate-pulse flex flex-col h-full">
      <div className="aspect-[4/3] w-full bg-cream-200/80"></div>
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="h-3 w-1/3 bg-cream-200 rounded mb-2"></div>
          <div className="h-5 w-4/5 bg-cream-300 rounded mb-1"></div>
          <div className="h-3 w-1/2 bg-cream-200 rounded"></div>
        </div>
        <div className="pt-3 border-t border-cream-200 flex items-center justify-between">
          <div className="h-3 w-1/4 bg-cream-200 rounded"></div>
          <div className="h-3 w-1/4 bg-cream-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default BookSkeleton;

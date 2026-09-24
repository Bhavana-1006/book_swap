import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ShieldCheck, Heart, MapPin, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-navy-900 text-cream-100 border-t border-navy-800 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-navy-800">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white">
                <BookOpen className="w-5 h-5 text-cream-50" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Book<span className="text-brand-500">Swap</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Empowering college students to save money, recycle academic resources, and exchange second-hand books right on campus.
            </p>
            <div className="flex items-center gap-2 text-xs text-brand-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Campus Community</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-base font-semibold text-white mb-4">Explore Marketplace</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link to="/browse" className="hover:text-brand-400 transition-colors">
                  Browse All Textbooks
                </Link>
              </li>
              <li>
                <Link to="/browse?type=SELL" className="hover:text-brand-400 transition-colors">
                  Discounted Student Books
                </Link>
              </li>
              <li>
                <Link to="/browse?type=DONATE" className="hover:text-brand-400 transition-colors">
                  Free Donated Books
                </Link>
              </li>
              <li>
                <Link to="/swaps" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Smart Swap Matches</span>
                </Link>
              </li>
              <li>
                <Link to="/nearby" className="hover:text-brand-400 transition-colors">
                  Books Near My Campus
                </Link>
              </li>
            </ul>
          </div>

          {/* Student Tools */}
          <div>
            <h4 className="font-serif text-base font-semibold text-white mb-4">Student Hub</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link to="/create-listing" className="hover:text-brand-400 transition-colors">
                  List a Book for Sale / Swap
                </Link>
              </li>
              <li>
                <Link to="/my-listings" className="hover:text-brand-400 transition-colors">
                  Manage Listings
                </Link>
              </li>
              <li>
                <Link to="/requests" className="hover:text-brand-400 transition-colors">
                  Exchange Requests
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-brand-400 transition-colors">
                  Saved Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Safety & Campus Tips */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-white mb-4">Campus Exchange Tips</h4>
            <div className="bg-navy-800/80 p-4 rounded-xl border border-navy-700 space-y-2 text-xs text-gray-300">
              <p className="font-semibold text-white flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-400" />
                Meet in Public Campus Spaces
              </p>
              <p className="text-gray-400 leading-normal">
                Exchange books safely at the college library, student union, or campus cafeteria during daylight hours.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} BookSwap Platform. Built for College Students.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for academic sustainability
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

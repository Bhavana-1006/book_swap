import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Sparkles, AlertCircle, Compass, Search } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import BookCard from '../components/BookCard';
import BookSkeleton from '../components/BookSkeleton';

const BooksNearMe = () => {
  const { success, error, info } = useToast();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [coords, setCoords] = useState(null);
  const [searchMode, setSearchMode] = useState(''); // 'geospatial' | 'city-fallback'
  const [radius, setRadius] = useState(30000); // 30km default (in meters)
  const [cityInput, setCityInput] = useState('');

  // Request browser geolocation on user click
  const handleUseGeolocation = () => {
    if (!navigator.geolocation) {
      error('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    info('Requesting your GPS coordinates...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ latitude, longitude });
        fetchNearby(longitude, latitude, radius);
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        setLoading(false);
        error('Location access was denied or timed out. Falling back to city search.');
        handleCitySearch('Boston'); // default campus city demo fallback
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const fetchNearby = async (lng, lat, maxDist) => {
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await api.get(`/api/books/nearby?longitude=${lng}&latitude=${lat}&maxDistance=${maxDist}`);
      if (res.data.success) {
        setBooks(res.data.books || []);
        setSearchMode(res.data.mode || 'geospatial');
        success(`Found ${res.data.books?.length || 0} books near your campus location!`);
      }
    } catch (err) {
      error(err.response?.data?.message || 'Could not retrieve nearby books');
    } finally {
      setLoading(false);
    }
  };

  const handleCitySearch = async (targetCity) => {
    const queryCity = targetCity || cityInput;
    if (!queryCity.trim()) {
      error('Please enter a city or campus location name');
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      const res = await api.get(`/api/books/nearby?city=${encodeURIComponent(queryCity.trim())}`);
      if (res.data.success) {
        setBooks(res.data.books || []);
        setSearchMode('city-fallback');
      }
    } catch (err) {
      error('Failed to search books by city');
    } finally {
      setLoading(false);
    }
  };

  // Run initial query on page load with sample city so the page is never empty
  useEffect(() => {
    handleCitySearch('Boston');
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-sm">
          <Compass className="w-3.5 h-3.5 text-emerald-600 animate-spin-slow" />
          <span>Geo-Discovery for Campus Meetups</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
          Books Near My Campus
        </h1>
        <p className="text-sm text-gray-500">
          Discover textbooks available within walking or driving distance of your college.
        </p>
      </div>

      {/* Discovery Controls Bar */}
      <div className="bg-white p-5 rounded-3xl border border-cream-200 shadow-soft max-w-3xl mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* GPS Button */}
          <button
            onClick={handleUseGeolocation}
            disabled={loading}
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Navigation className="w-4 h-4" />
            <span>Use My Exact GPS Location</span>
          </button>

          {/* Radius Selector */}
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 w-full sm:w-auto justify-end">
            <span>Radius:</span>
            <select
              value={radius}
              onChange={(e) => {
                const r = Number(e.target.value);
                setRadius(r);
                if (coords) fetchNearby(coords.longitude, coords.latitude, r);
              }}
              className="px-3 py-1.5 rounded-xl border border-cream-300 bg-cream-50 text-navy-900 font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="5000">5 km (Campus Walk)</option>
              <option value="15000">15 km (College Town)</option>
              <option value="30000">30 km (Metro Area)</option>
              <option value="50000">50 km (Regional)</option>
            </select>
          </div>
        </div>

        {/* Fallback City Search */}
        <div className="pt-3 border-t border-cream-200 flex gap-2">
          <div className="relative flex-1">
            <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCitySearch()}
              placeholder="Or enter city / campus name (e.g. Cambridge, Boston, Palo Alto)..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-cream-300 bg-cream-50 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <button
            onClick={() => handleCitySearch()}
            className="px-4 py-2 rounded-xl bg-navy-900 text-white text-xs font-bold hover:bg-navy-800 transition-colors"
          >
            Search City
          </button>
        </div>
      </div>

      {/* Discovery Status Banner */}
      {searchMode && (
        <div className="text-center">
          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold bg-cream-200 text-navy-800">
            {searchMode === 'geospatial'
              ? `Displaying books within ${(radius / 1000).toFixed(0)} km of your coordinates`
              : `Showing books available in and around ${cityInput || 'Boston'}`}
          </span>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(6)
            .fill(0)
            .map((_, i) => <BookSkeleton key={i} />)
        ) : books.length > 0 ? (
          books.map((book) => <BookCard key={book._id} book={book} />)
        ) : (
          <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-cream-200 p-8 space-y-3">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-navy-900">
              No textbooks found in this radius
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Try expanding your search radius to 30km or 50km, or search by a nearby city name.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BooksNearMe;

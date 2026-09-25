import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  Search,
  Sparkles,
  MapPin,
  X,
  BookOpen,
  DollarSign,
  Repeat,
  HeartHandshake,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CATEGORIES_DATA, ALL_CATEGORIES } from '../utils/categories';

const CreateListing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error, info } = useToast();

  // Form Fields
  const [isbn, setIsbn] = useState('');
  const [lookingUpIsbn, setLookingUpIsbn] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('Engineering');
  const [publisher, setPublisher] = useState('');
  const [edition, setEdition] = useState('');
  const [subject, setSubject] = useState('Computer Science');
  const [semester, setSemester] = useState('Semester 1');
  const [branch, setBranch] = useState('Computer Science & Engineering');
  const [condition, setCondition] = useState('Like New');
  const [listingType, setListingType] = useState('SELL');
  const [price, setPrice] = useState('');
  const [swapPreferences, setSwapPreferences] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState(user?.city || '');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [gettingLocation, setGettingLocation] = useState(false);

  // Images state
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [externalCoverUrl, setExternalCoverUrl] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const semestersList = [
    'Semester 1',
    'Semester 2',
    'Semester 3',
    'Semester 4',
    'Semester 5',
    'Semester 6',
    'Semester 7',
    'Semester 8',
    'Class 6',
    'Class 7',
    'Class 8',
    'Class 9',
    'Class 10',
    '1st Year',
    '2nd Year',
    'General Reading',
    'Entrance Prep'
  ];

  // Auto-fill from Google Books API
  const handleLookupISBN = async () => {
    if (!isbn.trim()) {
      error('Please enter an ISBN-10 or ISBN-13');
      return;
    }

    setLookingUpIsbn(true);
    try {
      const res = await api.get(`/api/books/isbn/${encodeURIComponent(isbn.trim())}`);
      if (res.data.success && res.data.book) {
        const b = res.data.book;
        if (b.title) setTitle(b.title);
        if (b.authors) setAuthor(b.authors);
        if (b.publisher) setPublisher(b.publisher);
        if (b.description) setDescription(b.description);
        if (b.coverImage) {
          setExternalCoverUrl(b.coverImage);
          setImagePreviews((prev) => [b.coverImage, ...prev]);
        }
        success('Book details auto-filled from Google Books!');
      }
    } catch (err) {
      error(err.response?.data?.message || 'Could not find book for this ISBN. You can still enter details manually.');
    } finally {
      setLookingUpIsbn(false);
    }
  };

  // Browser Geolocation
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      error('Geolocation is not supported by your browser');
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude.toFixed(6));
        setLongitude(pos.coords.longitude.toFixed(6));
        setGettingLocation(false);
        info('Coordinates obtained! Nearby campus peers will discover your book.');
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        setGettingLocation(false);
        error('Unable to retrieve location. Please type your city name manually.');
      },
      { timeout: 10000 }
    );
  };

  // Handle local image file selections
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imageFiles.length > 5) {
      error('You can upload a maximum of 5 images');
      return;
    }

    const newFiles = [...imageFiles, ...files];
    setImageFiles(newFiles);

    // Create local object URLs for preview
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    if (externalCoverUrl && index === 0) {
      setExternalCoverUrl('');
    } else {
      const fileIndex = externalCoverUrl ? index - 1 : index;
      setImageFiles((prev) => prev.filter((_, i) => i !== fileIndex));
    }
  };

  const validate = () => {
    const errors = {};
    if (!title.trim()) errors.title = 'Title is required';
    if (!author.trim()) errors.author = 'Author name is required';
    if (!subject.trim()) errors.subject = 'Subject/course is required';
    if (!description.trim()) errors.description = 'Please describe the book edition or notes';
    if (listingType === 'SELL') {
      const p = parseFloat(price);
      if (isNaN(p) || p <= 0) errors.price = 'Please enter a valid price greater than $0';
    }
    if (listingType === 'SWAP' && !swapPreferences.trim()) {
      errors.swapPreferences = 'Please describe what book or subject you want in return';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('author', author.trim());
      if (isbn) formData.append('isbn', isbn.trim());
      formData.append('category', category);
      if (publisher) formData.append('publisher', publisher.trim());
      if (edition) formData.append('edition', edition.trim());
      formData.append('subject', subject.trim());
      formData.append('semester', semester);
      formData.append('branch', branch.trim());
      formData.append('description', description.trim());
      formData.append('condition', condition);
      formData.append('listingType', listingType);
      formData.append('price', listingType === 'SELL' ? price : '0');
      if (swapPreferences) formData.append('swapPreferences', swapPreferences.trim());
      formData.append('city', city.trim() || user?.city || '');
      if (latitude) formData.append('latitude', latitude);
      if (longitude) formData.append('longitude', longitude);
      if (externalCoverUrl) formData.append('coverImage', externalCoverUrl);

      imageFiles.forEach((file) => {
        formData.append('images', file);
      });

      const res = await api.post('/api/books', formData);

      if (res.data.success) {
        success('Book listed successfully on the campus marketplace!');
        navigate('/browse');
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to list book');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
          List a Textbook
        </h1>
        <p className="text-sm text-gray-500">
          Sell, donate, or exchange your course books with students on your campus
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-cream-200 shadow-soft">
        {/* SECTION 1: ISBN AUTO-FILL TOOLBAR */}
        <div className="p-5 rounded-2xl bg-cream-100/70 border border-cream-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-navy-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>Instant ISBN Auto-Fill (Google Books)</span>
            </span>
            <span className="text-[11px] text-gray-500">Optional</span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              placeholder="e.g. 9780262033848 (ISBN-10 or ISBN-13)"
              className="flex-1 px-4 py-2.5 rounded-xl border border-cream-300 bg-white text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              type="button"
              onClick={handleLookupISBN}
              disabled={lookingUpIsbn || !isbn.trim()}
              className="px-5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{lookingUpIsbn ? 'Searching...' : 'Find Book'}</span>
            </button>
          </div>
          <p className="text-[11px] text-gray-500">
            Entering the ISBN will automatically pull the book's official title, authors, description, and cover image.
          </p>
        </div>

        {/* SECTION 2: LISTING TYPE SELECTOR */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
            Choose Listing Type <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* SELL */}
            <div
              onClick={() => setListingType('SELL')}
              className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                listingType === 'SELL'
                  ? 'border-brand-600 bg-brand-50/50 shadow-sm'
                  : 'border-cream-300 hover:border-cream-400 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <DollarSign className={`w-6 h-6 ${listingType === 'SELL' ? 'text-brand-600' : 'text-gray-400'}`} />
                {listingType === 'SELL' && <CheckCircle className="w-4 h-4 text-brand-600" />}
              </div>
              <h4 className="font-bold text-sm text-navy-900">Sell Textbook</h4>
              <p className="text-xs text-gray-500 mt-1">Set a price and receive money directly from the buyer.</p>
            </div>

            {/* DONATE */}
            <div
              onClick={() => {
                setListingType('DONATE');
                setPrice('0');
              }}
              className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                listingType === 'DONATE'
                  ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                  : 'border-cream-300 hover:border-cream-400 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <HeartHandshake className={`w-6 h-6 ${listingType === 'DONATE' ? 'text-emerald-600' : 'text-gray-400'}`} />
                {listingType === 'DONATE' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
              </div>
              <h4 className="font-bold text-sm text-navy-900">Free Donation</h4>
              <p className="text-xs text-gray-500 mt-1">Give it for free to help a junior student in need.</p>
            </div>

            {/* SWAP */}
            <div
              onClick={() => setListingType('SWAP')}
              className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                listingType === 'SWAP'
                  ? 'border-accent-600 bg-accent-50/50 shadow-sm'
                  : 'border-cream-300 hover:border-cream-400 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Repeat className={`w-6 h-6 ${listingType === 'SWAP' ? 'text-accent-600' : 'text-gray-400'}`} />
                {listingType === 'SWAP' && <CheckCircle className="w-4 h-4 text-accent-600" />}
              </div>
              <h4 className="font-bold text-sm text-navy-900">Exchange / Swap</h4>
              <p className="text-xs text-gray-500 mt-1">Trade for another book you need this semester.</p>
            </div>
          </div>
        </div>

        {/* PRICE INPUT (Only if SELL) */}
        {listingType === 'SELL' && (
          <div className="space-y-1">
            <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
              Selling Price (₹ INR) <span className="text-rose-500">*</span>
            </label>
            <div className="relative max-w-xs">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
              <input
                type="number"
                min="1"
                step="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="299"
                className={`w-full pl-8 pr-4 py-2.5 rounded-xl border ${
                  formErrors.price ? 'border-rose-500' : 'border-cream-300'
                } bg-white text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500 font-bold`}
              />
            </div>
            {formErrors.price && <p className="text-xs text-rose-600">{formErrors.price}</p>}
          </div>
        )}

        {/* SWAP PREFERENCES (If SWAP) */}
        {listingType === 'SWAP' && (
          <div className="space-y-1">
            <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
              Desired Swap Books / Subjects <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={swapPreferences}
              onChange={(e) => setSwapPreferences(e.target.value)}
              placeholder="e.g. Seeking Database System Concepts or any Semester 4 CS core book"
              className={`w-full px-4 py-2.5 rounded-xl border ${
                formErrors.swapPreferences ? 'border-rose-500' : 'border-cream-300'
              } bg-white text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500`}
            />
            {formErrors.swapPreferences && <p className="text-xs text-rose-600">{formErrors.swapPreferences}</p>}
            <p className="text-[11px] text-gray-500">
              Our Smart Swap engine will compare this with other students' listings to find reciprocal matches.
            </p>
          </div>
        )}

        {/* SECTION 3: BOOK DETAILS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Title */}
          <div className="sm:col-span-2 space-y-1">
            <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
              Book Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Operating System Concepts"
              className={`w-full px-4 py-2.5 rounded-xl border ${
                formErrors.title ? 'border-rose-500' : 'border-cream-300'
              } bg-white text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500`}
            />
            {formErrors.title && <p className="text-xs text-rose-600">{formErrors.title}</p>}
          </div>

          {/* Author */}
          <div className="sm:col-span-2 space-y-1">
            <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
              Author(s) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. Silberschatz, Galvin, Gagne"
              className={`w-full px-4 py-2.5 rounded-xl border ${
                formErrors.author ? 'border-rose-500' : 'border-cream-300'
              } bg-white text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500`}
            />
            {formErrors.author && <p className="text-xs text-rose-600">{formErrors.author}</p>}
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
              Academic Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-white text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
            >
              {ALL_CATEGORIES.filter(c => c !== 'All').map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Subject / Course */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
              Subject Area / Course <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Data Structures, Physics, Mathematics 1A"
              className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-white text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Publisher */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
              Publisher (optional)
            </label>
            <input
              type="text"
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
              placeholder="e.g. Pearson, McGraw-Hill, NCERT"
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-white text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Edition */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
              Edition (optional)
            </label>
            <input
              type="text"
              value={edition}
              onChange={(e) => setEdition(e.target.value)}
              placeholder="e.g. 10th Edition, 2024 Revised"
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-white text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Semester / Class */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
              Relevant Semester / Class <span className="text-rose-500">*</span>
            </label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-white text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {semestersList.map((sem) => (
                <option key={sem} value={sem}>
                  {sem}
                </option>
              ))}
            </select>
          </div>

          {/* Branch / Stream */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
              Branch / Stream
            </label>
            <input
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              placeholder="e.g. CSE, MPC, MBBS, CBSE"
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-white text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Condition */}
          <div className="sm:col-span-2 space-y-1">
            <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
              Condition <span className="text-rose-500">*</span>
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-white text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="New">New (Unused, clean spine)</option>
              <option value="Like New">Like New (Very gentle wear, no writing)</option>
              <option value="Good">Good (Some highlighting or minor cover wear)</option>
              <option value="Acceptable">Acceptable (Readable, marked, signs of use)</option>
            </select>
          </div>

          {/* Description */}
          <div className="sm:col-span-2 space-y-1">
            <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
              Description & Notes <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail the edition number, inclusion of access codes, chapter highlights, or reason for selling..."
              className={`w-full px-4 py-2.5 rounded-xl border ${
                formErrors.description ? 'border-rose-500' : 'border-cream-300'
              } bg-white text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none`}
            ></textarea>
            {formErrors.description && <p className="text-xs text-rose-600">{formErrors.description}</p>}
          </div>
        </div>

        {/* SECTION 4: PHOTOS UPLOAD */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
              Book Photos (Up to 5 images)
            </label>
            <span className="text-[11px] text-gray-500 font-medium">Front, Back, Index, Real Condition</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-gray-600 bg-cream-50 p-2.5 rounded-xl border border-cream-200">
            <span className="flex items-center gap-1 font-semibold text-navy-900">1. Front Cover</span>
            <span className="flex items-center gap-1 font-semibold text-navy-900">2. Back & ISBN</span>
            <span className="flex items-center gap-1 font-semibold text-navy-900">3. Contents Page</span>
            <span className="flex items-center gap-1 font-semibold text-navy-900">4. Real Condition</span>
          </div>

          {/* Image Previews with Angle Badges */}
          {imagePreviews.length > 0 && (
            <div className="flex flex-wrap gap-3 pb-2">
              {imagePreviews.map((url, idx) => {
                const angleNames = ['Front Cover', 'Back Cover', 'Index / Sample', 'Actual Condition', 'Additional'];
                return (
                  <div key={idx} className="relative w-28 h-32 rounded-xl overflow-hidden border-2 border-cream-300 shadow-sm group bg-cream-100 flex flex-col justify-between">
                    <img src={url} alt="preview" className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 inset-x-0 py-0.5 text-[9px] font-bold text-center bg-navy-900/90 text-white truncate px-1">
                      {angleNames[idx] || `Photo ${idx + 1}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full opacity-90 hover:opacity-100 transition-opacity shadow-sm"
                      title="Remove image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* File input drop area */}
          <label className="border-2 border-dashed border-cream-300 hover:border-brand-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-cream-50/50 hover:bg-cream-100/50 transition-colors">
            <Upload className="w-8 h-8 text-brand-600 mb-2" />
            <span className="text-xs font-bold text-navy-900">Click or drag photos to upload</span>
            <span className="text-[11px] text-gray-500 mt-1">PNG, JPG, WEBP up to 5MB (Upload front, back, index & actual wear photos)</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* SECTION 5: CAMPUS LOCATION */}
        <div className="p-5 rounded-2xl bg-cream-100/70 border border-cream-200 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-navy-900 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Campus / City Location</span>
            </label>
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={gettingLocation}
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{gettingLocation ? 'Locating...' : 'Use My GPS Location'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Hyderabad"
                className="w-full px-3.5 py-2 rounded-xl border border-cream-300 bg-white text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">Latitude (optional)</label>
              <input
                type="text"
                readOnly
                value={latitude}
                placeholder="Auto-filled via GPS"
                className="w-full px-3.5 py-2 rounded-xl border border-cream-200 bg-cream-100 text-xs text-gray-600"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">Longitude (optional)</label>
              <input
                type="text"
                readOnly
                value={longitude}
                placeholder="Auto-filled via GPS"
                className="w-full px-3.5 py-2 rounded-xl border border-cream-200 bg-cream-100 text-xs text-gray-600"
              />
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-cream-200">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-3 rounded-2xl border border-cream-300 text-sm font-semibold text-gray-700 hover:bg-cream-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
          >
            {submitting ? 'Publishing Listing...' : 'Publish Book Listing'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateListing;

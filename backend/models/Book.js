const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Book listing must have an owner']
    },
    title: {
      type: String,
      required: [true, 'Please provide the book title'],
      trim: true
    },
    author: {
      type: String,
      required: [true, 'Please provide the author name'],
      trim: true
    },
    isbn: {
      type: String,
      trim: true,
      default: ''
    },
    category: {
      type: String,
      enum: ['School', 'Intermediate', 'Engineering', 'Medical', 'Competitive Exams', 'Degree', 'Novels', 'General'],
      default: 'Engineering',
      index: true
    },
    publisher: {
      type: String,
      trim: true,
      default: ''
    },
    edition: {
      type: String,
      trim: true,
      default: ''
    },
    subject: {
      type: String,
      required: [true, 'Please specify the academic subject/course'],
      trim: true
    },
    semester: {
      type: String,
      required: [true, 'Please specify the relevant semester'],
      trim: true
    },
    branch: {
      type: String,
      trim: true,
      default: 'General'
    },
    description: {
      type: String,
      required: [true, 'Please provide a book description'],
      trim: true
    },
    condition: {
      type: String,
      enum: ['New', 'Like New', 'Good', 'Acceptable'],
      required: [true, 'Please select book condition']
    },
    listingType: {
      type: String,
      enum: ['SELL', 'DONATE', 'SWAP'],
      required: [true, 'Please select listing type (SELL, DONATE, or SWAP)']
    },
    price: {
      type: Number,
      default: 0,
      min: [0, 'Price cannot be negative']
    },
    swapPreferences: {
      type: String,
      trim: true,
      default: ''
    },
    images: {
      type: [String],
      default: []
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: undefined,
        validate: {
          validator: function (val) {
            if (!val || val.length === 0) return true;
            if (val.length !== 2) return false;
            const [lng, lat] = val;
            return typeof lng === 'number' && typeof lat === 'number' &&
                   lng >= -180 && lng <= 180 &&
                   lat >= -90 && lat <= 90;
          },
          message: 'Coordinates must be valid [longitude (-180 to 180), latitude (-90 to 90)]'
        }
      },
      city: {
        type: String,
        trim: true,
        default: ''
      }
    },
    status: {
      type: String,
      enum: ['Available', 'Reserved', 'Exchanged', 'Removed'],
      default: 'Available'
    }
  },
  {
    timestamps: true
  }
);

// Indexes for fast search and filtering
bookSchema.index({ title: 'text', author: 'text', subject: 'text', isbn: 'text' });
bookSchema.index({ status: 1, listingType: 1, createdAt: -1 });
bookSchema.index({ 'location.city': 1 });
bookSchema.index({ owner: 1 });
// 2dsphere index with sparse: true so items without valid coordinates are safely indexed
bookSchema.index({ 'location.coordinates': '2dsphere' }, { sparse: true });

module.exports = mongoose.model('Book', bookSchema);

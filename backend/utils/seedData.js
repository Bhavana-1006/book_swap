const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Book = require('../models/Book');

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bookswap';
    await mongoose.connect(mongoUri, { dbName: 'bookswap' });
    console.log('[Seed] Connected to MongoDB');

    const bookCount = await Book.countDocuments();
    if (bookCount > 0) {
      console.log(`[Seed] Database already has ${bookCount} books. Skipping initial seed.`);
      process.exit(0);
    }

    console.log('[Seed] Seeding initial campus community data...');

    // Create initial verified users
    const users = await User.create([
      {
        name: 'Prof. Sarah Jenkins (Admin)',
        email: 'admin@bookswap.edu',
        password: 'password123',
        college: 'State Technical University',
        city: 'Boston',
        role: 'ADMIN',
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Alex Rivera',
        email: 'alex@student.edu',
        password: 'password123',
        college: 'State Technical University',
        city: 'Boston',
        role: 'USER',
        profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Priya Sharma',
        email: 'priya@student.edu',
        password: 'password123',
        college: 'City Engineering College',
        city: 'Cambridge',
        role: 'USER',
        profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Marcus Vance',
        email: 'marcus@student.edu',
        password: 'password123',
        college: 'Metropolitan Institute of Technology',
        city: 'Boston',
        role: 'USER',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
      }
    ]);

    const [admin, alex, priya, marcus] = users;

    // Seed academic books with realistic coordinates (around Boston / Cambridge area)
    const books = [
      {
        owner: alex._id,
        title: 'Introduction to Algorithms (CLRS 3rd Edition)',
        author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest',
        isbn: '9780262033848',
        subject: 'Computer Science',
        semester: 'Semester 3',
        branch: 'Computer Science & Engineering',
        description: 'Comprehensive textbook covering data structures, dynamic programming, graph algorithms, and NP-completeness. In pristine condition with clean pages.',
        condition: 'Like New',
        listingType: 'SWAP',
        price: 0,
        swapPreferences: 'Looking for Database System Concepts or Computer Networks',
        images: ['https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=800&q=80'],
        location: {
          type: 'Point',
          coordinates: [-71.0589, 42.3601], // Boston [lng, lat]
          city: 'Boston'
        },
        status: 'Available'
      },
      {
        owner: priya._id,
        title: 'Database System Concepts (7th Edition)',
        author: 'Abraham Silberschatz, Henry F. Korth, S. Sudarshan',
        isbn: '9780078022159',
        subject: 'Computer Science',
        semester: 'Semester 4',
        branch: 'Information Technology',
        description: 'Covers relational models, SQL, indexing, transaction processing, and distributed database architectures. Ready for swap.',
        condition: 'Good',
        listingType: 'SWAP',
        price: 0,
        swapPreferences: 'Looking for Introduction to Algorithms (CLRS)',
        images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'],
        location: {
          type: 'Point',
          coordinates: [-71.1097, 42.3736], // Cambridge [lng, lat]
          city: 'Cambridge'
        },
        status: 'Available'
      },
      {
        owner: marcus._id,
        title: 'Operating System Concepts (10th Edition)',
        author: 'Abraham Silberschatz, Peter B. Galvin, Greg Gagne',
        isbn: '9781119456339',
        subject: 'Computer Science',
        semester: 'Semester 4',
        branch: 'Computer Science & Engineering',
        description: 'The dinosaur book! Covers threads, CPU scheduling, synchronization, deadlocks, and virtual memory. Very lightly highlighted.',
        condition: 'Good',
        listingType: 'SELL',
        price: 42,
        swapPreferences: '',
        images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80'],
        location: {
          type: 'Point',
          coordinates: [-71.0601, 42.3554],
          city: 'Boston'
        },
        status: 'Available'
      },
      {
        owner: alex._id,
        title: 'Calculus: Early Transcendentals',
        author: 'James Stewart',
        isbn: '9781285741550',
        subject: 'Mathematics',
        semester: 'Semester 1',
        branch: 'Common First Year',
        description: 'Donating my first-year engineering calculus textbook to help any junior! Covers limits, derivatives, integrals, and vector calculus.',
        condition: 'Acceptable',
        listingType: 'DONATE',
        price: 0,
        swapPreferences: '',
        images: ['https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80'],
        location: {
          type: 'Point',
          coordinates: [-71.0589, 42.3601],
          city: 'Boston'
        },
        status: 'Available'
      },
      {
        owner: priya._id,
        title: 'Artificial Intelligence: A Modern Approach (4th Edition)',
        author: 'Stuart Russell, Peter Norvig',
        isbn: '9780134610993',
        subject: 'Computer Science',
        semester: 'Semester 6',
        branch: 'AI & Data Science',
        description: 'Hardcover edition. Explores search, logic, probabilistic reasoning, machine learning, and deep learning architectures.',
        condition: 'New',
        listingType: 'SELL',
        price: 65,
        swapPreferences: '',
        images: ['https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80'],
        location: {
          type: 'Point',
          coordinates: [-71.1097, 42.3736],
          city: 'Cambridge'
        },
        status: 'Available'
      },
      {
        owner: marcus._id,
        title: 'Engineering Mechanics: Dynamics (14th Edition)',
        author: 'Russell C. Hibbeler',
        isbn: '9780133915389',
        subject: 'Mechanical Engineering',
        semester: 'Semester 2',
        branch: 'Mechanical Engineering',
        description: 'Essential textbook for kinematics and kinetics of particles and rigid bodies. Free donation for fellow engineering students in need.',
        condition: 'Good',
        listingType: 'DONATE',
        price: 0,
        swapPreferences: '',
        images: ['https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80'],
        location: {
          type: 'Point',
          coordinates: [-71.0601, 42.3554],
          city: 'Boston'
        },
        status: 'Available'
      }
    ];

    await Book.insertMany(books);
    console.log(`[Seed] Successfully seeded ${users.length} users and ${books.length} academic books!`);
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error.message);
    process.exit(1);
  }
};

seedDatabase();

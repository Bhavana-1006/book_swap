const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Book = require('../models/Book');

dotenv.config();

const sampleUsers = [
  {
    name: 'Prof. Sarah Jenkins (Admin)',
    email: 'admin@bookswap.edu',
    password: 'password123',
    college: 'Campus Tech University',
    city: 'Hyderabad',
    role: 'ADMIN',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Rahul Sharma',
    email: 'rahul.eng@campus.edu',
    password: 'password123',
    college: 'CBIT Engineering College',
    city: 'Hyderabad',
    role: 'USER',
    profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Ananya Reddy',
    email: 'ananya.med@campus.edu',
    password: 'password123',
    college: 'Osmania Medical College',
    city: 'Hyderabad',
    role: 'USER',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Vikram Patel',
    email: 'vikram.tech@campus.edu',
    password: 'password123',
    college: 'IIT Madras',
    city: 'Chennai',
    role: 'USER',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Sneha Kulkarni',
    email: 'sneha.degree@campus.edu',
    password: 'password123',
    college: 'St. Xavier’s College',
    city: 'Mumbai',
    role: 'USER',
    profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Arjun Das',
    email: 'arjun.prep@campus.edu',
    password: 'password123',
    college: 'Sri Chaitanya Academy',
    city: 'Bengaluru',
    role: 'USER',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
  }
];

const sampleBooksData = [
  // ================= 1. SCHOOL =================
  {
    title: 'NCERT Mathematics Class 10',
    author: 'NCERT Editorial Board',
    isbn: '9788174506344',
    category: 'School',
    publisher: 'National Council of Educational Research and Training',
    edition: 'Revised Edition 2024',
    subject: 'Class 10 - Mathematics',
    semester: 'Class 10',
    branch: 'CBSE Board',
    description: 'Complete NCERT textbook for Class 10 with solved real numbers, polynomials, triangles, coordinate geometry, and trigonometry exercises.',
    condition: 'Like New',
    listingType: 'DONATE',
    price: 0,
    swapPreferences: '',
    images: ['https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80'],
    location: { type: 'Point', coordinates: [78.4867, 17.3850], city: 'Hyderabad' }
  },
  {
    title: 'NCERT Science Textbook for Class 10',
    author: 'NCERT Board',
    isbn: '9788174506481',
    category: 'School',
    publisher: 'NCERT',
    edition: 'Latest CBSE Curriculum',
    subject: 'Class 10 - Science',
    semester: 'Class 10',
    branch: 'CBSE / NCERT',
    description: 'Covers Chemical Reactions, Life Processes, Light Reflection & Refraction, Electricity, and Magnetic Effects with labeled diagrams.',
    condition: 'Good',
    listingType: 'SELL',
    price: 8,
    swapPreferences: '',
    images: ['https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=800&q=80'],
    location: { type: 'Point', coordinates: [78.4867, 17.3850], city: 'Hyderabad' }
  },
  {
    title: 'NCERT Social Science: India and the Contemporary World II',
    author: 'NCERT Council',
    isbn: '9788174507075',
    category: 'School',
    publisher: 'NCERT',
    edition: '2023 Edition',
    subject: 'Class 10 - Social Science',
    semester: 'Class 10',
    branch: 'CBSE',
    description: 'History and Democratic Politics for Class 10. Clean pages, no highlighting, excellent for CBSE board preparation.',
    condition: 'Like New',
    listingType: 'SWAP',
    price: 0,
    swapPreferences: 'Looking for Class 10 English First Flight or Footprints Without Feet',
    images: ['https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80'],
    location: { type: 'Point', coordinates: [77.5946, 12.9716], city: 'Bengaluru' }
  },
  {
    title: 'ICSE Total English Class 9',
    author: 'Pamela Pinto & Xavier Pinto',
    isbn: '9789389234891',
    category: 'School',
    publisher: 'Morning Star',
    edition: 'ICSE Syllabus Edition',
    subject: 'Class 9 - English Grammar',
    semester: 'Class 9',
    branch: 'ICSE Board',
    description: 'Grammar exercises, composition writing, comprehension passages, and practice specimen test papers.',
    condition: 'Good',
    listingType: 'SELL',
    price: 6,
    swapPreferences: '',
    images: ['https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80'],
    location: { type: 'Point', coordinates: [72.8777, 19.0760], city: 'Mumbai' }
  },

  // ================= 2. INTERMEDIATE =================
  {
    title: 'Intermediate Mathematics 1A',
    author: 'Telugu Academy Board',
    isbn: '9788181804501',
    category: 'Intermediate',
    publisher: 'Telugu Academy',
    edition: 'State Board 1st Year',
    subject: 'Mathematics 1A',
    semester: '1st Year',
    branch: 'MPC',
    description: 'Covers Functions, Mathematical Induction, Matrices, Trigonometric Ratios, Transformations, and Hyperbolic Functions.',
    condition: 'Like New',
    listingType: 'SELL',
    price: 10,
    swapPreferences: '',
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'],
    location: { type: 'Point', coordinates: [78.4867, 17.3850], city: 'Hyderabad' }
  },
  {
    title: 'Intermediate Mathematics 1B (Coordinate Geometry & Calculus)',
    author: 'Telugu Academy Board',
    isbn: '9788181804518',
    category: 'Intermediate',
    publisher: 'Telugu Academy',
    edition: 'State Board 1st Year',
    subject: 'Mathematics 1B',
    semester: '1st Year',
    branch: 'MPC',
    description: 'Locus, Transformation of Axes, Straight Lines, Pair of Straight Lines, 3D Coordinates, Limits, and Derivatives.',
    condition: 'Good',
    listingType: 'SWAP',
    price: 0,
    swapPreferences: 'Seeking Intermediate Physics 1st Year or Chemistry 1st Year',
    images: ['https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80'],
    location: { type: 'Point', coordinates: [78.4867, 17.3850], city: 'Hyderabad' }
  },
  {
    title: 'Intermediate Physics 2nd Year Textbook',
    author: 'Board of Intermediate Education',
    isbn: '9788181805218',
    category: 'Intermediate',
    publisher: 'Telugu Academy',
    edition: '2nd Year Edition',
    subject: 'Physics',
    semester: '2nd Year',
    branch: 'MPC / BiPC',
    description: 'Waves, Ray Optics, Wave Optics, Electric Charges & Fields, Magnetism, Alternating Current, and Semiconductor Electronics.',
    condition: 'Acceptable',
    listingType: 'DONATE',
    price: 0,
    swapPreferences: '',
    images: ['https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=800&q=80'],
    location: { type: 'Point', coordinates: [80.2707, 13.0827], city: 'Chennai' }
  },
  {
    title: 'Intermediate BiPC Botany & Zoology Vol 2',
    author: 'State Academic Council',
    isbn: '9788181806338',
    category: 'Intermediate',
    publisher: 'Telugu Academy',
    edition: 'Revised Curriculum',
    subject: 'Biology / Botany',
    semester: '2nd Year',
    branch: 'BiPC',
    description: 'Genetics, Molecular Biology, Biotechnology, Human Physiology, and Environmental Biology with labeled diagrams.',
    condition: 'Like New',
    listingType: 'SELL',
    price: 12,
    swapPreferences: '',
    images: ['https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80'],
    location: { type: 'Point', coordinates: [77.5946, 12.9716], city: 'Bengaluru' }
  },

  // ================= 3. ENGINEERING =================
  {
    title: 'Introduction to Algorithms (CLRS 3rd Edition)',
    author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest',
    isbn: '9780262033848',
    category: 'Engineering',
    publisher: 'MIT Press',
    edition: '3rd International Edition',
    subject: 'Data Structures & Algorithms',
    semester: 'Semester 3',
    branch: 'CSE',
    description: 'Comprehensive core text on asymptotic analysis, divide and conquer, greedy algorithms, dynamic programming, graph algorithms, and NP-completeness.',
    condition: 'Like New',
    listingType: 'SWAP',
    price: 0,
    swapPreferences: 'Looking for Database System Concepts or Computer Networks',
    images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80'],
    location: { type: 'Point', coordinates: [78.4867, 17.3850], city: 'Hyderabad' }
  },
  {
    title: 'Database System Concepts (7th Edition)',
    author: 'Abraham Silberschatz, Henry F. Korth, S. Sudarshan',
    isbn: '9780078022159',
    category: 'Engineering',
    publisher: 'McGraw-Hill Education',
    edition: '7th Edition',
    subject: 'Database Management Systems',
    semester: 'Semester 4',
    branch: 'CSE / IT',
    description: 'Relational algebra, SQL, normalization (BCNF, 3NF), indexing, B+ trees, query optimization, ACID transactions, and NoSQL databases.',
    condition: 'Good',
    listingType: 'SWAP',
    price: 0,
    swapPreferences: 'Looking for Introduction to Algorithms (CLRS)',
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'],
    location: { type: 'Point', coordinates: [78.4867, 17.3850], city: 'Hyderabad' }
  },
  {
    title: 'Operating System Concepts (10th Dinosaur Edition)',
    author: 'Abraham Silberschatz, Peter B. Galvin, Greg Gagne',
    isbn: '9781119456339',
    category: 'Engineering',
    publisher: 'Wiley',
    edition: '10th Global Edition',
    subject: 'Operating Systems',
    semester: 'Semester 4',
    branch: 'CSE',
    description: 'Threads, CPU scheduling, semaphores, mutex locks, deadlock handling, virtual memory management, and file systems.',
    condition: 'Like New',
    listingType: 'SELL',
    price: 25,
    swapPreferences: '',
    images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80'],
    location: { type: 'Point', coordinates: [78.4867, 17.3850], city: 'Hyderabad' }
  },
  {
    title: 'Computer Networking: A Top-Down Approach (8th Edition)',
    author: 'James F. Kurose, Keith W. Ross',
    isbn: '9780136681557',
    category: 'Engineering',
    publisher: 'Pearson',
    edition: '8th Edition',
    subject: 'Computer Networks',
    semester: 'Semester 5',
    branch: 'CSE / IT',
    description: 'Application layer (HTTP, DNS), Transport layer (TCP, UDP, congestion control), Network layer (BGP, OSPF), and Data Link Layer.',
    condition: 'Good',
    listingType: 'SELL',
    price: 22,
    swapPreferences: '',
    images: ['https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'],
    location: { type: 'Point', coordinates: [80.2707, 13.0827], city: 'Chennai' }
  },
  {
    title: 'Pattern Recognition and Machine Learning',
    author: 'Christopher M. Bishop',
    isbn: '9780387310732',
    category: 'Engineering',
    publisher: 'Springer',
    edition: 'Information Science & Statistics',
    subject: 'Machine Learning',
    semester: 'Semester 6',
    branch: 'CSE-AIML',
    description: 'Bayesian methods, linear models for regression & classification, neural networks, kernel methods, SVMs, and graphical models.',
    condition: 'New',
    listingType: 'SELL',
    price: 35,
    swapPreferences: '',
    images: ['https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80'],
    location: { type: 'Point', coordinates: [77.5946, 12.9716], city: 'Bengaluru' }
  },
  {
    title: 'The C Programming Language (ANSI C)',
    author: 'Brian W. Kernighan, Dennis M. Ritchie',
    isbn: '9780131103627',
    category: 'Engineering',
    publisher: 'Prentice Hall',
    edition: '2nd Classic Edition',
    subject: 'C Programming',
    semester: 'Semester 1',
    branch: 'Common First Year',
    description: 'The iconic K&R C programming guide. Pointers, memory allocation, structures, and UNIX system interfaces. Donated to help first-year juniors!',
    condition: 'Good',
    listingType: 'DONATE',
    price: 0,
    swapPreferences: '',
    images: ['https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80'],
    location: { type: 'Point', coordinates: [78.4867, 17.3850], city: 'Hyderabad' }
  },
  {
    title: 'Digital Design: With an Introduction to Verilog HDL',
    author: 'M. Morris Mano, Michael D. Ciletti',
    isbn: '9780132774208',
    category: 'Engineering',
    publisher: 'Pearson',
    edition: '5th Edition',
    subject: 'Digital Electronics',
    semester: 'Semester 3',
    branch: 'ECE / EEE',
    description: 'Boolean algebra, Karnaugh maps, combinational logic, flip-flops, synchronous sequential logic, registers, and memory decoding.',
    condition: 'Like New',
    listingType: 'SELL',
    price: 18,
    swapPreferences: '',
    images: ['https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'],
    location: { type: 'Point', coordinates: [72.8777, 19.0760], city: 'Mumbai' }
  },
  {
    title: 'Engineering Thermodynamics (6th Edition)',
    author: 'P.K. Nag',
    isbn: '9789352606429',
    category: 'Engineering',
    publisher: 'McGraw-Hill India',
    edition: '6th Edition',
    subject: 'Mechanical Engineering Core',
    semester: 'Semester 3',
    branch: 'Mechanical',
    description: 'Laws of thermodynamics, entropy, pure substances, Rankine cycles, Brayton cycles, refrigeration, and gas mixtures with worked examples.',
    condition: 'Good',
    listingType: 'SELL',
    price: 16,
    swapPreferences: '',
    images: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'],
    location: { type: 'Point', coordinates: [80.2707, 13.0827], city: 'Chennai' }
  },

  // ================= 4. MEDICAL =================
  {
    title: 'BD Chaurasia Human Anatomy: Regional & Applied (Vol 1-3)',
    author: 'Dr. B.D. Chaurasia',
    isbn: '9789388902724',
    category: 'Medical',
    publisher: 'CBS Publishers',
    edition: '8th Edition',
    subject: 'Human Anatomy',
    semester: '1st Year MBBS',
    branch: 'MBBS',
    description: 'Upper limb, thorax, lower limb, abdomen, pelvis, head, neck, and brain with clinical correlation and dissection guides.',
    condition: 'Like New',
    listingType: 'SELL',
    price: 45,
    swapPreferences: '',
    images: ['https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80'],
    location: { type: 'Point', coordinates: [78.4867, 17.3850], city: 'Hyderabad' }
  },
  {
    title: 'Guyton and Hall Textbook of Medical Physiology',
    author: 'John E. Hall, Michael E. Hall',
    isbn: '9780323597128',
    category: 'Medical',
    publisher: 'Elsevier',
    edition: '14th South Asia Edition',
    subject: 'Physiology',
    semester: '1st Year MBBS',
    branch: 'MBBS / BDS',
    description: 'Cardiovascular system, neurophysiology, renal mechanics, respiration, gastrointestinal physiology, and endocrinology.',
    condition: 'Good',
    listingType: 'SWAP',
    price: 0,
    swapPreferences: 'Looking for Robbins Pathology or KD Tripathi Pharmacology',
    images: ['https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80'],
    location: { type: 'Point', coordinates: [78.4867, 17.3850], city: 'Hyderabad' }
  },
  {
    title: 'KD Tripathi Essentials of Medical Pharmacology',
    author: 'K.D. Tripathi',
    isbn: '9789352704996',
    category: 'Medical',
    publisher: 'Jaypee Brothers',
    edition: '8th Edition',
    subject: 'Pharmacology',
    semester: '2nd Year MBBS',
    branch: 'MBBS / Pharmacy',
    description: 'Drugs acting on ANS, CNS, CVS, kidneys, hormones, chemotherapy of infections, and toxicology. Crisp notes.',
    condition: 'Like New',
    listingType: 'SELL',
    price: 30,
    swapPreferences: '',
    images: ['https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=800&q=80'],
    location: { type: 'Point', coordinates: [77.5946, 12.9716], city: 'Bengaluru' }
  },
  {
    title: 'Robbins and Cotran Pathologic Basis of Disease',
    author: 'Vinay Kumar, Abul K. Abbas, Jon C. Aster',
    isbn: '9780323531139',
    category: 'Medical',
    publisher: 'Elsevier',
    edition: '10th Edition',
    subject: 'Pathology',
    semester: '2nd Year MBBS',
    branch: 'MBBS',
    description: 'Cellular pathology, inflammation, hemodynamic disorders, neoplasia, infectious diseases, and systemic pathology. Donating for juniors in financial need.',
    condition: 'Good',
    listingType: 'DONATE',
    price: 0,
    swapPreferences: '',
    images: ['https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80'],
    location: { type: 'Point', coordinates: [72.8777, 19.0760], city: 'Mumbai' }
  },

  // ================= 5. COMPETITIVE EXAMS =================
  {
    title: 'Concepts of Physics (Vol 1 & Vol 2)',
    author: 'Dr. H.C. Verma',
    isbn: '9788177091878',
    category: 'Competitive Exams',
    publisher: 'Bharati Bhawan',
    edition: 'Complete Set',
    subject: 'JEE / NEET Physics',
    semester: 'Entrance Prep',
    branch: 'JEE / NEET',
    description: 'The golden standard physics reference for JEE Main, JEE Advanced, and NEET. Mechanics, optics, electromagnetism, and modern physics with full exercises.',
    condition: 'Like New',
    listingType: 'SELL',
    price: 15,
    swapPreferences: '',
    images: ['https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80'],
    location: { type: 'Point', coordinates: [78.4867, 17.3850], city: 'Hyderabad' }
  },
  {
    title: 'EAMCET / EAPCET Mathematics 15-Year Solved Papers',
    author: 'Arihant Experts',
    isbn: '9789325298811',
    category: 'Competitive Exams',
    publisher: 'Arihant Publications',
    edition: '2024 Exam Edition',
    subject: 'EAMCET Mathematics',
    semester: 'Entrance Prep',
    branch: 'EAMCET / EAPCET',
    description: 'Chapter-wise previous year questions for Andhra Pradesh & Telangana Engineering entrance tests with step-by-step solutions.',
    condition: 'Good',
    listingType: 'SELL',
    price: 9,
    swapPreferences: '',
    images: ['https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80'],
    location: { type: 'Point', coordinates: [78.4867, 17.3850], city: 'Hyderabad' }
  },
  {
    title: 'Trueman’s Objective Biology for NEET (Vol 1 & 2)',
    author: 'K.N. Bhatia, M.P. Tyagi',
    isbn: '9788187223801',
    category: 'Competitive Exams',
    publisher: 'Trueman Book Company',
    edition: 'NEET Target Edition',
    subject: 'NEET Biology',
    semester: 'Entrance Prep',
    branch: 'NEET / Medical',
    description: 'Exhaustive MCQs covering NCERT botany and zoology with explanatory diagrams and assertion-reason questions.',
    condition: 'Like New',
    listingType: 'SWAP',
    price: 0,
    swapPreferences: 'Looking for HC Verma Concepts of Physics or MTG Chemistry at Your Fingertips',
    images: ['https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80'],
    location: { type: 'Point', coordinates: [77.5946, 12.9716], city: 'Bengaluru' }
  },
  {
    title: 'GATE Computer Science & IT: 30 Years Chapterwise Solved',
    author: 'Made Easy Editorial Team',
    isbn: '9789391061982',
    category: 'Competitive Exams',
    publisher: 'Made Easy Publications',
    edition: '2024 Edition',
    subject: 'GATE CSE / IT',
    semester: 'GATE Exam Prep',
    branch: 'GATE',
    description: 'Algorithms, TOC, Compilers, OS, DBMS, Computer Networks, and Discrete Mathematics with detailed analytical solutions.',
    condition: 'Like New',
    listingType: 'SELL',
    price: 20,
    swapPreferences: '',
    images: ['https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'],
    location: { type: 'Point', coordinates: [80.2707, 13.0827], city: 'Chennai' }
  },

  // ================= 6. DEGREE =================
  {
    title: 'Financial Accounting for B.Com',
    author: 'S.N. Maheshwari, S.K. Maheshwari',
    isbn: '9789352718917',
    category: 'Degree',
    publisher: 'Vikas Publishing',
    edition: '6th Edition',
    subject: 'Financial Accounting',
    semester: 'Semester 1',
    branch: 'B.Com',
    description: 'Journal entries, ledger posting, trial balance, depreciation accounting, partnership accounts, and company final accounts.',
    condition: 'Good',
    listingType: 'SELL',
    price: 14,
    swapPreferences: '',
    images: ['https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80'],
    location: { type: 'Point', coordinates: [72.8777, 19.0760], city: 'Mumbai' }
  },
  {
    title: 'Marketing Management (15th Global Edition)',
    author: 'Philip Kotler, Kevin Lane Keller',
    isbn: '9780133856460',
    category: 'Degree',
    publisher: 'Pearson',
    edition: '15th Edition',
    subject: 'Marketing / Business Strategy',
    semester: 'Semester 2',
    branch: 'BBA / MBA',
    description: 'Brand equity, customer value, market segmentation, pricing strategies, integrated marketing communications, and global marketing.',
    condition: 'Like New',
    listingType: 'DONATE',
    price: 0,
    swapPreferences: '',
    images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'],
    location: { type: 'Point', coordinates: [78.4867, 17.3850], city: 'Hyderabad' }
  },
  {
    title: 'Mathematical Physics for B.Sc (Honours)',
    author: 'H.K. Dass, Rama Verma',
    isbn: '9788121914697',
    category: 'Degree',
    publisher: 'S. Chand Publishing',
    edition: '8th Revised Edition',
    subject: 'Physics & Mathematics',
    semester: 'Semester 3',
    branch: 'B.Sc',
    description: 'Vector calculus, differential equations, Fourier series, Laplace transforms, complex variables, and tensors for undergraduate physics.',
    condition: 'Good',
    listingType: 'SWAP',
    price: 0,
    swapPreferences: 'Seeking B.Sc Quantum Mechanics or Classical Electrodynamics',
    images: ['https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80'],
    location: { type: 'Point', coordinates: [77.5946, 12.9716], city: 'Bengaluru' }
  },

  // ================= 7. NOVELS =================
  {
    title: 'Atomic Habits: Tiny Changes, Remarkable Results',
    author: 'James Clear',
    isbn: '9780735211292',
    category: 'Novels',
    publisher: 'Avery / Penguin Random House',
    edition: 'International Bestseller',
    subject: 'Self-Help / Productivity',
    semester: 'General Reading',
    branch: 'General',
    description: 'An easy & proven way to build good habits & break bad ones. Great read for college students optimizing study routines. Pristine copy.',
    condition: 'New',
    listingType: 'SELL',
    price: 11,
    swapPreferences: '',
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'],
    location: { type: 'Point', coordinates: [78.4867, 17.3850], city: 'Hyderabad' }
  },
  {
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    isbn: '9789390166268',
    category: 'Novels',
    publisher: 'Harriman House',
    edition: '1st Edition',
    subject: 'Finance & Behavioral Economics',
    semester: 'General Reading',
    branch: 'General',
    description: 'Timeless lessons on wealth, greed, and happiness. Donating my paperback copy so more students can learn financial wisdom.',
    condition: 'Like New',
    listingType: 'DONATE',
    price: 0,
    swapPreferences: '',
    images: ['https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&w=800&q=80'],
    location: { type: 'Point', coordinates: [80.2707, 13.0827], city: 'Chennai' }
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '9780060935467',
    category: 'Novels',
    publisher: 'Harper Perennial',
    edition: '50th Anniversary Edition',
    subject: 'Classic Literature / Fiction',
    semester: 'General Reading',
    branch: 'Literature',
    description: 'Pulitzer Prize-winning masterpiece exploring human morality, racial injustice, and childhood innocence.',
    condition: 'Good',
    listingType: 'SWAP',
    price: 0,
    swapPreferences: 'Seeking 1984 by George Orwell or The Alchemist by Paulo Coelho',
    images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80'],
    location: { type: 'Point', coordinates: [72.8777, 19.0760], city: 'Mumbai' }
  }
];

const runSeed = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is missing');
    }

    console.log('[Seed] Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri, { dbName: 'bookswap' });
    console.log('[Seed] Connected successfully to MongoDB Atlas!');

    // Check existing users or create demo users
    const existingCount = await Book.countDocuments();
    const isForce = process.argv.includes('--force');

    if (existingCount >= 30 && !isForce) {
      console.log(`[Seed] Database already has ${existingCount} books. Use --force to replace.`);
      process.exit(0);
    }

    if (isForce) {
      console.log('[Seed] Force flag detected. Cleaning existing test books...');
      await Book.deleteMany({});
    }

    // Ensure sample users exist
    const userDocs = [];
    for (const u of sampleUsers) {
      let existingUser = await User.findOne({ email: u.email });
      if (!existingUser) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(u.password, salt);
        existingUser = await User.create({
          ...u,
          password: hashedPassword
        });
        console.log(`[Seed] Created demo user: ${u.name} (${u.email})`);
      }
      userDocs.push(existingUser);
    }

    // Distribute books among sample users
    const booksToInsert = sampleBooksData.map((book, index) => {
      const assignedUser = userDocs[index % userDocs.length];
      return {
        ...book,
        owner: assignedUser._id,
        status: 'Available'
      };
    });

    console.log(`[Seed] Inserting ${booksToInsert.length} realistic academic listings into MongoDB Atlas...`);
    const inserted = await Book.insertMany(booksToInsert);
    console.log(`[Seed] SUCCESS: Inserted ${inserted.length} book listings across 7 categories (School, Intermediate, Engineering, Medical, Competitive Exams, Degree, Novels).`);

    const finalCount = await Book.countDocuments();
    console.log(`[Seed] Total active books in MongoDB: ${finalCount}`);
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error.message);
    process.exit(1);
  }
};

runSeed();

/**
 * Subject & Category topic highlights mapper for Book Details page.
 */

export const TOPIC_MAPPINGS = [
  {
    keywords: ['data structure', 'algorithm', 'dsa'],
    category: 'Engineering',
    subject: 'Data Structures & Algorithms',
    topics: [
      { name: 'Arrays & Strings', summary: 'Linear memory indexing, searching algorithms, sliding window techniques.' },
      { name: 'Linked Lists', summary: 'Singly, doubly, and circular chain pointer manipulations.' },
      { name: 'Stacks & Queues', summary: 'LIFO & FIFO models, recursion simulation, monotonic structures.' },
      { name: 'Trees & Graphs', summary: 'Binary search trees, AVL, BFS/DFS traversals, and shortest path.' },
      { name: 'Dynamic Programming', summary: 'Optimal substructure, memoization tables, and knapsack problem.' }
    ]
  },
  {
    keywords: ['artificial intelligence', 'machine learning', 'aiml', 'ai', 'deep learning'],
    category: 'Engineering',
    subject: 'Artificial Intelligence & ML',
    topics: [
      { name: 'Machine Learning Basics', summary: 'Supervised, unsupervised, and reinforcement learning foundations.' },
      { name: 'Neural Networks', summary: 'Perceptrons, backpropagation, and deep activation layers.' },
      { name: 'Classification & Regression', summary: 'Decision trees, SVM, logistic and linear predictions.' },
      { name: 'Model Evaluation', summary: 'Confusion matrix, precision, recall, ROC-AUC metrics.' }
    ]
  },
  {
    keywords: ['database', 'dbms', 'sql'],
    category: 'Engineering',
    subject: 'Database Management Systems',
    topics: [
      { name: 'Relational Model & SQL', summary: 'DDL, DML, joins, subqueries, and views.' },
      { name: 'Normalization', summary: '1NF to BCNF schemas eliminating insertion and update anomalies.' },
      { name: 'Transactions & ACID', summary: 'Atomicity, consistency, isolation levels, and concurrency control.' },
      { name: 'Indexing & Storage', summary: 'B+ trees, hashing indexes, and query execution plans.' }
    ]
  },
  {
    keywords: ['engineering mathematics', 'engg math', 'm1', 'm2', 'm3', 'calculus'],
    category: 'Engineering',
    subject: 'Engineering Mathematics',
    topics: [
      { name: 'Matrices & Linear Algebra', summary: 'Eigenvalues, eigenvectors, rank, and Cayley-Hamilton theorem.' },
      { name: 'Differential Calculus', summary: 'Taylor series, partial derivatives, and maxima-minima.' },
      { name: 'Vector Calculus', summary: 'Gradient, divergence, curl, Greens and Stokes theorems.' },
      { name: 'Transforms & Series', summary: 'Laplace, Fourier series, and Z-transforms.' }
    ]
  },
  {
    keywords: ['anatomy', 'human anatomy', 'medical', 'mbbs'],
    category: 'Medical',
    subject: 'Human Anatomy',
    topics: [
      { name: 'Skeletal & Bone System', summary: 'Axial and appendicular skeleton, joint mechanics.' },
      { name: 'Muscular System', summary: 'Muscle fiber architecture, origin, insertion, and innervation.' },
      { name: 'Cardiovascular System', summary: 'Heart chambers, systemic circulation, and coronary vessels.' },
      { name: 'Nervous System & Brain', summary: 'Central and peripheral pathways, cranial nerves.' }
    ]
  },
  {
    keywords: ['physiology', 'biochemistry', 'pathology'],
    category: 'Medical',
    subject: 'Human Physiology',
    topics: [
      { name: 'Cellular Physiology', summary: 'Membrane transport, resting potentials, and action potentials.' },
      { name: 'Blood & Hematology', summary: 'RBCs, coagulation cascade, and immune antibodies.' },
      { name: 'Endocrine Regulation', summary: 'Pituitary, thyroid, and pancreatic hormonal feedback.' },
      { name: 'Renal & Excretory', summary: 'Nephron filtration, countercurrent multiplier, and GFR.' }
    ]
  },
  {
    keywords: ['physics', 'mpc physics', 'intermediate physics'],
    category: 'Intermediate',
    subject: 'Intermediate Physics (MPC/BiPC)',
    topics: [
      { name: 'Mechanics & Dynamics', summary: 'Newton laws, rotational inertia, gravitation, and conservation.' },
      { name: 'Waves & Oscillations', summary: 'Simple harmonic motion, Doppler effect, and sound resonance.' },
      { name: 'Electricity & Magnetism', summary: 'Coulomb law, circuits, electromagnetic induction, and AC.' },
      { name: 'Ray & Wave Optics', summary: 'Interference, diffraction, lenses, and polarization.' }
    ]
  },
  {
    keywords: ['chemistry', 'mpc chemistry', 'organic chemistry'],
    category: 'Intermediate',
    subject: 'Intermediate Chemistry',
    topics: [
      { name: 'Organic Reaction Mechanisms', summary: 'Nucleophilic substitution, elimination, and electrophilic addition.' },
      { name: 'Atomic Structure & Periodicity', summary: 'Quantum orbitals, hybridization, and periodic trends.' },
      { name: 'Chemical Kinetics & Equilibrium', summary: 'Rate laws, Le Chateliers principle, and activation energy.' },
      { name: 'Electrochemistry', summary: 'Nernst equation, galvanic cells, and conductance.' }
    ]
  },
  {
    keywords: ['10th mathematics', 'class 10 maths', 'secondary maths', 'geometry', 'trigonometry'],
    category: '10th Class',
    subject: '10th Secondary Mathematics',
    topics: [
      { name: 'Polynomials & Quadratic Equations', summary: 'Roots, factorization, and quadratic formula.' },
      { name: 'Coordinate Geometry', summary: 'Distance formula, section formula, and area of triangles.' },
      { name: 'Trigonometry & Heights', summary: 'Identities, complementary angles, and practical elevation.' },
      { name: 'Statistics & Probability', summary: 'Mean, median, mode of grouped data, and sample spaces.' }
    ]
  },
  {
    keywords: ['10th science', 'class 10 science', 'physical science', 'biology class 10'],
    category: '10th Class',
    subject: '10th Secondary Science',
    topics: [
      { name: 'Chemical Reactions & Acids', summary: 'Redox, neutralization, pH scale, and salts.' },
      { name: 'Life Processes & Reproduction', summary: 'Nutrition, respiration, transport, and genetics.' },
      { name: 'Electricity & Magnetic Effects', summary: 'Ohms law, series-parallel circuits, and solenoids.' },
      { name: 'Light, Reflection & Refraction', summary: 'Mirrors, lenses, and the human eye.' }
    ]
  },
  {
    keywords: ['social studies', '10th social', 'history', 'geography', 'civics'],
    category: '10th Class',
    subject: '10th Social Studies',
    topics: [
      { name: 'Indian Physical Geography', summary: 'Relief features, climate, rivers, and agriculture.' },
      { name: 'Democratic Politics & Governance', summary: 'Power sharing, federalism, and fundamental rights.' },
      { name: 'Economic Development', summary: 'Sectors of Indian economy, money, and credit.' }
    ]
  }
];

export const getTopicsForBook = (book) => {
  if (!book) return null;
  const searchStr = `${book.title || ''} ${book.subject || ''} ${book.category || ''} ${book.branch || ''}`.toLowerCase();

  const matched = TOPIC_MAPPINGS.find((item) =>
    item.keywords.some((kw) => searchStr.includes(kw))
  );

  if (matched) return matched;

  // Generic fallback based on category
  const category = book.category || 'Academic';
  return {
    category,
    subject: book.subject || book.title || 'Course Textbook',
    topics: [
      { name: 'Core Foundations', summary: 'Fundamental principles and theoretical concepts for this course.' },
      { name: 'Applied Methodology', summary: 'Practical problems, case studies, and textbook exercises.' },
      { name: 'Examination Modules', summary: 'Key questions, chapter-end summaries, and revision notes.' }
    ]
  };
};

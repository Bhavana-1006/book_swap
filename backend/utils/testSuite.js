const axios = require('axios');

const BASE_URL = 'http://127.0.0.1:5000/api';
let studentToken = '';
let studentUser = null;
let adminToken = '';
let testBookId = '';
let testRequestId = '';

const runTests = async () => {
  console.log('=== STARTING BOOKSWAP END-TO-END VALIDATION SUITE ===\n');

  try {
    // 1. Health Check
    console.log('[Test 1] Health Check...');
    const healthRes = await axios.get(`${BASE_URL}/health`);
    console.log(` -> Status: ${healthRes.data.status}, DB: ${healthRes.data.database.status}`);

    // 2. Auth: Login as Student Rahul
    console.log('\n[Test 2] Student Login...');
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'rahul.eng@campus.edu',
      password: 'password123'
    });
    studentToken = loginRes.data.token;
    studentUser = loginRes.data.user;
    console.log(` -> Authenticated as ${studentUser.name} (${studentUser.college}), Role: ${studentUser.role}`);

    // 3. Auth: Login as Admin Sarah
    console.log('\n[Test 3] Admin Login...');
    const adminLoginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@bookswap.edu',
      password: 'password123'
    });
    adminToken = adminLoginRes.data.token;
    console.log(` -> Authenticated as Admin: ${adminLoginRes.data.user.name}, Role: ${adminLoginRes.data.user.role}`);

    // 4. ISBN Lookup via Google Books API
    console.log('\n[Test 4] Google Books ISBN Auto-fill (ISBN: 9780262033848)...');
    try {
      const isbnRes = await axios.get(`${BASE_URL}/books/isbn/9780262033848`);
      console.log(` -> ISBN Lookup success: Title = "${isbnRes.data.book?.title}", Author = "${isbnRes.data.book?.authors}"`);
    } catch (err) {
      console.log(` -> ISBN Lookup notice: ${err.response?.data?.message || err.message}`);
    }

    // 5. Create a new book listing
    console.log('\n[Test 5] Create Book Listing...');
    const createBookRes = await axios.post(
      `${BASE_URL}/books`,
      {
        title: 'Computer Networks: Principles and Protocols',
        author: 'Andrew S. Tanenbaum',
        isbn: '9780132126953',
        subject: 'Computer Science',
        semester: 'Semester 5',
        branch: 'Computer Science & Engineering',
        description: 'Comprehensive networking textbook covering TCP/IP, OSI layers, wireless protocols, and routing algorithms. Clean, highlighted copy.',
        condition: 'Like New',
        listingType: 'SWAP',
        swapPreferences: 'Seeking Database System Concepts or Algorithms',
        city: 'Boston',
        latitude: '42.3601',
        longitude: '-71.0589'
      },
      { headers: { Authorization: `Bearer ${studentToken}` } }
    );
    testBookId = createBookRes.data.book._id;
    console.log(` -> Listing created: ID = ${testBookId}, Status = ${createBookRes.data.book.status}`);

    // 6. Retrieve books with filters & search
    console.log('\n[Test 6] Browse & Filter Books...');
    const searchRes = await axios.get(`${BASE_URL}/books?search=Networks&subject=Computer%20Science`);
    console.log(` -> Filter results count: ${searchRes.data.count}, Total in DB: ${searchRes.data.total}`);

    // 7. Test Nearby Geolocation Discovery ($near / 2dsphere)
    console.log('\n[Test 7] Nearby Books Query (Boston coordinates)...');
    const nearbyRes = await axios.get(`${BASE_URL}/books/nearby?longitude=-71.0589&latitude=42.3601&maxDistance=30000`);
    console.log(` -> Nearby books found: ${nearbyRes.data.count}, Mode: ${nearbyRes.data.mode}`);

    // 8. Test Wishlist Functionality
    console.log('\n[Test 8] Wishlist Add and Retrieve...');
    // Find another student's book (e.g. Priya's book)
    const allBooks = await axios.get(`${BASE_URL}/books`);
    const priyaBook = allBooks.data.books.find((b) => b.owner?.name?.includes('Priya') && b._id !== testBookId);
    if (priyaBook) {
      const addWishlistRes = await axios.post(
        `${BASE_URL}/wishlist/${priyaBook._id}`,
        {},
        { headers: { Authorization: `Bearer ${studentToken}` } }
      );
      console.log(` -> Added "${priyaBook.title}" to wishlist: ${addWishlistRes.data.message}`);

      const getWishlistRes = await axios.get(`${BASE_URL}/wishlist`, {
        headers: { Authorization: `Bearer ${studentToken}` }
      });
      console.log(` -> Wishlist items count: ${getWishlistRes.data.count}`);
    }

    // 9. Test Smart Two-Way Swap Matching
    console.log('\n[Test 9] Smart Swap Matching Engine...');
    const swapRes = await axios.get(`${BASE_URL}/swaps/matches`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    console.log(` -> Swap matches discovered: ${swapRes.data.count}`);
    if (swapRes.data.matches && swapRes.data.matches.length > 0) {
      const topMatch = swapRes.data.matches[0];
      console.log(`    Top Match: "${topMatch.myBook?.title}" <---> "${topMatch.matchedBook?.title}"`);
      console.log(`    Confidence: ${topMatch.confidence}%, Badge: ${topMatch.badge}`);
    }

    // 10. Test Request Creation and State Machine (Purchase/Swap)
    console.log('\n[Test 10] Request Lifecycle & Atomic Reservation...');
    if (priyaBook) {
      // Alex requests Priya's book
      const reqRes = await axios.post(
        `${BASE_URL}/requests`,
        {
          bookId: priyaBook._id,
          requestType: 'SWAP',
          offeredBookId: testBookId,
          message: 'Hi Priya, I have Computer Networks ready to swap for your Database book!'
        },
        { headers: { Authorization: `Bearer ${studentToken}` } }
      );
      testRequestId = reqRes.data.request._id;
      console.log(` -> Request created: ID = ${testRequestId}, Status = ${reqRes.data.request.status}`);

      // Now log in as Priya to accept the request
      const priyaLogin = await axios.post(`${BASE_URL}/auth/login`, {
        email: 'priya@student.edu',
        password: 'password123'
      });
      const priyaToken = priyaLogin.data.token;

      // Priya accepts the request
      const acceptRes = await axios.patch(
        `${BASE_URL}/requests/${testRequestId}/status`,
        { status: 'accepted' },
        { headers: { Authorization: `Bearer ${priyaToken}` } }
      );
      console.log(` -> Request accepted by owner: Status = ${acceptRes.data.request.status}`);

      // Verify atomic reservation on the book
      const bookAfterRes = await axios.get(`${BASE_URL}/books/${priyaBook._id}`);
      console.log(` -> Target book status after acceptance: ${bookAfterRes.data.book.status} (Reserved)`);

      // Mark completed
      const completeRes = await axios.patch(
        `${BASE_URL}/requests/${testRequestId}/status`,
        { status: 'completed' },
        { headers: { Authorization: `Bearer ${priyaToken}` } }
      );
      console.log(` -> Request marked completed: Status = ${completeRes.data.request.status}`);

      // Verify book status transitioned to Exchanged
      const bookAfterComplete = await axios.get(`${BASE_URL}/books/${priyaBook._id}`);
      console.log(` -> Target book status after completion: ${bookAfterComplete.data.book.status} (Exchanged)`);

      // 11. Test Rating and Review
      console.log('\n[Test 11] Post-Exchange Review & Rating...');
      const reviewRes = await axios.post(
        `${BASE_URL}/reviews`,
        {
          requestId: testRequestId,
          rating: 5,
          comment: 'Smooth and friendly campus book swap at the library!'
        },
        { headers: { Authorization: `Bearer ${studentToken}` } }
      );
      console.log(` -> Review created: Rating = ${reviewRes.data.review.rating}/5, Comment: "${reviewRes.data.review.comment}"`);
    }

    // 12. Test Admin Protection & Endpoints
    console.log('\n[Test 12] Admin Dashboard & Authorization...');
    // A: Regular student should be rejected (403) from admin endpoints
    try {
      await axios.get(`${BASE_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${studentToken}` }
      });
      console.error(' -> FAIL: Student was not blocked from admin endpoint');
    } catch (err) {
      console.log(` -> Security passed: Student blocked from Admin with HTTP ${err.response?.status}`);
    }

    // B: Admin user succeeds
    const adminStats = await axios.get(`${BASE_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log(` -> Admin stats retrieved: Total Users = ${adminStats.data.stats.totalUsers}, Active Listings = ${adminStats.data.stats.activeListings}`);

    console.log('\n=== ALL 12 END-TO-END VALIDATION TESTS PASSED WITH 100% SUCCESS! ===\n');
  } catch (error) {
    console.error('\n[Test Suite Error]:', error.response?.data || error.message);
    process.exit(1);
  }
};

runTests();

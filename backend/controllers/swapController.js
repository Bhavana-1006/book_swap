const Book = require('../models/Book');
const Wishlist = require('../models/Wishlist');

// Helper to sanitize and tokenize keywords
const getKeywords = (text) => {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !['the', 'and', 'for', 'with', 'any', 'book', 'want', 'looking'].includes(w));
};

// @desc    Get smart two-way and preference swap matches for authenticated user
// @route   GET /api/swaps/matches
// @access  Private
const getSwapMatches = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Fetch user's available SWAP books
    const mySwapBooks = await Book.find({
      owner: userId,
      listingType: 'SWAP',
      status: 'Available'
    });

    if (mySwapBooks.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        matches: [],
        message: 'List a book with listing type SWAP and specify your swap preferences to discover matches!'
      });
    }

    // 2. Fetch user's wishlist books (books the user actively desires)
    const myWishlistItems = await Wishlist.find({ user: userId }).populate('book');
    const myDesiredTitles = myWishlistItems
      .filter((w) => w.book)
      .map((w) => w.book.title.toLowerCase());
    const myDesiredIsbns = myWishlistItems
      .filter((w) => w.book && w.book.isbn)
      .map((w) => w.book.isbn.trim());

    // 3. Fetch candidate swap books listed by OTHER users
    const otherSwapBooks = await Book.find({
      owner: { $ne: userId },
      listingType: 'SWAP',
      status: 'Available'
    }).populate('owner', 'name email college city profileImage');

    const matches = [];

    // 4. Evaluate pairings between User's SWAP books and Other users' SWAP books
    for (const myBook of mySwapBooks) {
      const myPrefs = (myBook.swapPreferences || '').toLowerCase();
      const myPrefKeywords = getKeywords(myPrefs);
      const myTitleKeywords = getKeywords(myBook.title);

      for (const otherBook of otherSwapBooks) {
        const otherPrefs = (otherBook.swapPreferences || '').toLowerCase();
        const otherPrefKeywords = getKeywords(otherPrefs);
        const otherTitleKeywords = getKeywords(otherBook.title);

        let myBookMatchesOtherWants = false;
        let otherBookMatchesMyWants = false;
        let matchReasons = [];

        // Check if other book matches my wants:
        // A: Via ISBN
        if (myBook.isbn && otherPrefs.includes(myBook.isbn.toLowerCase())) {
          myBookMatchesOtherWants = true;
          matchReasons.push(`Other user explicitly mentioned your book ISBN (${myBook.isbn})`);
        }
        // B: Via Title / keywords in other user's preferences
        if (
          otherPrefs.length > 0 &&
          (otherPrefs.includes(myBook.title.toLowerCase()) ||
            myTitleKeywords.some((kw) => otherPrefs.includes(kw)))
        ) {
          myBookMatchesOtherWants = true;
          matchReasons.push(`Your book "${myBook.title}" matches what they are looking for`);
        }
        // C: Subject match
        if (otherPrefs.includes(myBook.subject.toLowerCase())) {
          myBookMatchesOtherWants = true;
          matchReasons.push(`Matches their requested subject: ${myBook.subject}`);
        }

        // Check if I want their book:
        // A: In my wishlist?
        if (
          myDesiredTitles.includes(otherBook.title.toLowerCase()) ||
          (otherBook.isbn && myDesiredIsbns.includes(otherBook.isbn.trim()))
        ) {
          otherBookMatchesMyWants = true;
          matchReasons.push(`"${otherBook.title}" is in your saved Wishlist`);
        }
        // B: In my book's swap preferences?
        if (
          myPrefs.length > 0 &&
          (myPrefs.includes(otherBook.title.toLowerCase()) ||
            otherTitleKeywords.some((kw) => myPrefs.includes(kw)))
        ) {
          otherBookMatchesMyWants = true;
          matchReasons.push(`Matches your requested book "${otherBook.title}"`);
        }
        // C: In my requested subject?
        if (myPrefs.includes(otherBook.subject.toLowerCase())) {
          otherBookMatchesMyWants = true;
          matchReasons.push(`Matches your desired subject "${otherBook.subject}"`);
        }

        // Determine Match Type & Confidence
        if (myBookMatchesOtherWants && otherBookMatchesMyWants) {
          // PERFECT RECIPROCAL TWO-WAY MATCH
          matches.push({
            myBook: {
              _id: myBook._id,
              title: myBook.title,
              author: myBook.author,
              subject: myBook.subject,
              images: myBook.images,
              swapPreferences: myBook.swapPreferences
            },
            matchedBook: otherBook,
            matchType: 'PERFECT_TWO_WAY',
            confidence: 96,
            badge: 'Perfect Match',
            reasons: matchReasons
          });
        } else if (otherBookMatchesMyWants) {
          // One-way direct match (you want their book, same or compatible field)
          const sameSubject = myBook.subject.toLowerCase() === otherBook.subject.toLowerCase();
          matches.push({
            myBook: {
              _id: myBook._id,
              title: myBook.title,
              author: myBook.author,
              subject: myBook.subject,
              images: myBook.images,
              swapPreferences: myBook.swapPreferences
            },
            matchedBook: otherBook,
            matchType: 'PREFERENCE_MATCH',
            confidence: sameSubject ? 85 : 75,
            badge: sameSubject ? 'High Compatibility' : 'Potential Swap',
            reasons: matchReasons.length > 0 ? matchReasons : [`Both in ${myBook.subject}`]
          });
        } else if (myBook.subject.toLowerCase() === otherBook.subject.toLowerCase()) {
          // Same academic department/semester swap opportunity
          matches.push({
            myBook: {
              _id: myBook._id,
              title: myBook.title,
              author: myBook.author,
              subject: myBook.subject,
              images: myBook.images,
              swapPreferences: myBook.swapPreferences
            },
            matchedBook: otherBook,
            matchType: 'ACADEMIC_PEER',
            confidence: 68,
            badge: 'Department Peer',
            reasons: [`Both books belong to ${myBook.subject} / ${myBook.semester}`]
          });
        }
      }
    }

    // Sort by confidence descending
    matches.sort((a, b) => b.confidence - a.confidence);

    return res.status(200).json({
      success: true,
      count: matches.length,
      matches
    });
  } catch (error) {
    console.error('[Get Swap Matches Error]:', error.message);
    return res.status(500).json({ success: false, message: 'Server error calculating swap matches' });
  }
};

module.exports = { getSwapMatches };

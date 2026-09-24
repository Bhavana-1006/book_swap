const axios = require('axios');

/**
 * Service to query Google Books API by ISBN or query terms
 */
const fetchBookByISBN = async (isbn) => {
  // Normalize ISBN: remove hyphens, spaces
  const cleanIsbn = isbn.replace(/[-\s]/g, '').trim();

  // Validate clean ISBN length (typically 10 or 13 digits)
  if (!/^(?:\d{9}[\dX]|\d{13})$/i.test(cleanIsbn)) {
    throw new Error('Invalid ISBN format. Must be a 10 or 13-character ISBN.');
  }

  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${cleanIsbn}${apiKey ? `&key=${apiKey}` : ''}`;

  try {
    const response = await axios.get(url, { timeout: 8000 });
    const data = response.data;

    if (!data.items || data.items.length === 0) {
      return null;
    }

    const volumeInfo = data.items[0].volumeInfo;

    // Extract cover image safely (upgrade to https if needed)
    let coverImage = '';
    if (volumeInfo.imageLinks) {
      coverImage = volumeInfo.imageLinks.thumbnail || volumeInfo.imageLinks.smallThumbnail || '';
      coverImage = coverImage.replace(/^http:\/\//i, 'https://');
    }

    // Extract best category / subject
    const subject = volumeInfo.categories && volumeInfo.categories.length > 0
      ? volumeInfo.categories[0]
      : 'General';

    return {
      title: volumeInfo.title || '',
      authors: volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown Author',
      description: volumeInfo.description || '',
      isbn: cleanIsbn,
      publishedDate: volumeInfo.publishedDate || '',
      pageCount: volumeInfo.pageCount || 0,
      publisher: volumeInfo.publisher || '',
      subject: subject,
      coverImage: coverImage
    };
  } catch (error) {
    if (error.response && error.response.status === 429) {
      throw new Error('Google Books API rate limit reached. Please enter details manually.');
    }
    console.error('[Google Books Service] API Error:', error.message);
    throw new Error(`Failed to fetch book data: ${error.message}`);
  }
};

module.exports = { fetchBookByISBN };

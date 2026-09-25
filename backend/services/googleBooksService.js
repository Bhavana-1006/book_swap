const axios = require('axios');

/**
 * Fallback service to query Open Library by ISBN (free, open, no API key required)
 */
const fetchFromOpenLibrary = async (cleanIsbn) => {
  try {
    const res = await axios.get(`https://openlibrary.org/isbn/${cleanIsbn}.json`, { timeout: 8000 });
    const data = res.data;
    if (!data) return null;

    let coverImage = '';
    if (data.covers && data.covers.length > 0) {
      coverImage = `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg`;
    }

    let authors = 'Unknown Author';
    if (data.authors && data.authors.length > 0 && data.authors[0].key) {
      try {
        const authorRes = await axios.get(`https://openlibrary.org${data.authors[0].key}.json`, { timeout: 5000 });
        if (authorRes.data && authorRes.data.name) {
          authors = authorRes.data.name;
        }
      } catch (e) {
        // author resolution failed, keep fallback
      }
    }

    return {
      title: data.title || '',
      authors: authors,
      description: typeof data.description === 'string' ? data.description : (data.description && data.description.value ? data.description.value : ''),
      isbn: cleanIsbn,
      publishedDate: data.publish_date || '',
      pageCount: data.number_of_pages || 0,
      publisher: data.publishers && Array.isArray(data.publishers) ? data.publishers.join(', ') : '',
      subject: (data.subjects && data.subjects[0]) || 'General',
      coverImage: coverImage
    };
  } catch (err) {
    return null;
  }
};

/**
 * Service to query Google Books API by ISBN with Open Library zero-key fallback
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

    if (data.items && data.items.length > 0) {
      const volumeInfo = data.items[0].volumeInfo;

      let coverImage = '';
      if (volumeInfo.imageLinks) {
        coverImage = volumeInfo.imageLinks.thumbnail || volumeInfo.imageLinks.smallThumbnail || '';
        coverImage = coverImage.replace(/^http:\/\//i, 'https://');
      }

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
    }
  } catch (error) {
    console.warn(`[Google Books Service] Google Books lookup unavailable (${error.message}). Attempting Open Library fallback...`);
  }

  // Fallback to Open Library
  const openLibResult = await fetchFromOpenLibrary(cleanIsbn);
  if (openLibResult) {
    return openLibResult;
  }

  return null;
};

module.exports = { fetchBookByISBN };

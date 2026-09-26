const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://angirekulabhavana_db_user:TeeDChVuiqZPjN2y@cluster0.hriwqkq.mongodb.net/bookswap?retryWrites=true&w=majority';

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB Atlas...');
  const booksCollection = mongoose.connection.collection('books');
  const books = await booksCollection.find({}).toArray();

  console.log(`Processing ${books.length} books in DB...`);

  for (const b of books) {
    if (Array.isArray(b.images) && b.images.length > 0) {
      // Keep ONLY the exact original first primary image URL
      const originalFirstImage = b.images[0];
      await booksCollection.updateOne(
        { _id: b._id },
        {
          $set: {
            images: [originalFirstImage]
          }
        }
      );
      console.log(`Updated "${b.title}" -> images: 1 (kept original first cover: ${originalFirstImage.substring(0, 50)}...)`);
    }
  }

  console.log('Successfully updated all books in MongoDB to keep ONLY the original first image!');
  process.exit(0);
}

run().catch((err) => {
  console.error('Error updating book images:', err);
  process.exit(1);
});

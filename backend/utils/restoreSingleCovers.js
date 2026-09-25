const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://angirekulabhavana_db_user:TeeDChVuiqZPjN2y@cluster0.hriwqkq.mongodb.net/bookswap?retryWrites=true&w=majority';

// Curated primary clean textbook covers
const cleanPrimaryCovers = {
  maths10: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
  science10: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
  physics: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=800&q=80',
  chemistry: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&w=800&q=80',
  biology: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=800&q=80',
  engineeringCSE: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
  engineeringCore: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
  medical: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=800&q=80',
  business: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
  novels: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
};

function getCleanCover(title, category, subject, existingImages) {
  if (existingImages && existingImages.length > 0 && existingImages[0] && existingImages[0].startsWith('http')) {
    return existingImages[0];
  }
  const t = (title + ' ' + category + ' ' + subject).toLowerCase();
  if (t.includes('anatomy') || t.includes('mbbs') || t.includes('medical') || t.includes('pharmacology') || t.includes('patholog') || t.includes('physiology')) {
    return cleanPrimaryCovers.medical;
  }
  if (t.includes('algorithm') || t.includes('database') || t.includes('operating system') || t.includes('networking') || t.includes('pattern recognition') || t.includes('c programming') || t.includes('gate computer')) {
    return cleanPrimaryCovers.engineeringCSE;
  }
  if (t.includes('thermodynamics') || t.includes('digital design') || t.includes('verilog') || t.includes('engineering')) {
    return cleanPrimaryCovers.engineeringCore;
  }
  if (t.includes('physics')) {
    return cleanPrimaryCovers.physics;
  }
  if (t.includes('chemistry')) {
    return cleanPrimaryCovers.chemistry;
  }
  if (t.includes('biology') || t.includes('botany') || t.includes('neet')) {
    return cleanPrimaryCovers.biology;
  }
  if (t.includes('math') || t.includes('calculus') || t.includes('eamcet')) {
    return cleanPrimaryCovers.maths10;
  }
  if (t.includes('accounting') || t.includes('marketing') || t.includes('b.com') || t.includes('management')) {
    return cleanPrimaryCovers.business;
  }
  if (t.includes('atomic habits') || t.includes('psychology of money') || t.includes('mockingbird') || t.includes('novel')) {
    return cleanPrimaryCovers.novels;
  }
  return cleanPrimaryCovers.science10;
}

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB Atlas...');
  const booksCollection = mongoose.connection.collection('books');
  const books = await booksCollection.find({}).toArray();

  for (const b of books) {
    const singleCover = getCleanCover(b.title, b.category, b.subject, b.images);
    await booksCollection.updateOne(
      { _id: b._id },
      {
        $set: {
          images: [singleCover]
        }
      }
    );
    console.log(`Cleaned: ${b.title} -> 1 Image: ${singleCover}`);
  }

  console.log('All books updated to single clean primary cover image!');
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

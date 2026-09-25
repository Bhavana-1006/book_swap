const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://angirekulabhavana_db_user:TeeDChVuiqZPjN2y@cluster0.hriwqkq.mongodb.net/bookswap?retryWrites=true&w=majority';

// Curated 4-image sets: [0: Front Cover, 1: Back Cover & ISBN, 2: Index / Contents Page, 3: Real Physical Condition Photo]
const academicGalleries = {
  maths10: [
    'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1000&q=80'
  ],
  science10: [
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=1000&q=80'
  ],
  physics: [
    'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1588580000645-4562a6d2c839?auto=format&fit=crop&w=1000&q=80'
  ],
  chemistry: [
    'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=1000&q=80'
  ],
  biology: [
    'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1000&q=80'
  ],
  engineeringCSE: [
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1000&q=80'
  ],
  engineeringCore: [
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1000&q=80'
  ],
  medical: [
    'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1000&q=80'
  ],
  business: [
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80'
  ],
  novels: [
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1000&q=80'
  ]
};

function getGalleryForBook(title, category, subject) {
  const t = (title + ' ' + category + ' ' + subject).toLowerCase();
  if (t.includes('anatomy') || t.includes('mbbs') || t.includes('medical') || t.includes('pharmacology') || t.includes('patholog') || t.includes('physiology')) {
    return academicGalleries.medical;
  }
  if (t.includes('algorithm') || t.includes('database') || t.includes('operating system') || t.includes('networking') || t.includes('pattern recognition') || t.includes('c programming') || t.includes('gate computer')) {
    return academicGalleries.engineeringCSE;
  }
  if (t.includes('thermodynamics') || t.includes('digital design') || t.includes('verilog') || t.includes('engineering')) {
    return academicGalleries.engineeringCore;
  }
  if (t.includes('physics')) {
    return academicGalleries.physics;
  }
  if (t.includes('chemistry')) {
    return academicGalleries.chemistry;
  }
  if (t.includes('biology') || t.includes('botany') || t.includes('neet')) {
    return academicGalleries.biology;
  }
  if (t.includes('math') || t.includes('calculus') || t.includes('eamcet')) {
    return academicGalleries.maths10;
  }
  if (t.includes('accounting') || t.includes('marketing') || t.includes('b.com') || t.includes('management')) {
    return academicGalleries.business;
  }
  if (t.includes('atomic habits') || t.includes('psychology of money') || t.includes('mockingbird') || t.includes('novel')) {
    return academicGalleries.novels;
  }
  return academicGalleries.science10;
}

function getRealisticPrice(book) {
  if (book.listingType === 'DONATE' || book.listingType === 'SWAP') return 0;
  const t = (book.title + ' ' + book.category).toLowerCase();
  if (t.includes('anatomy') || t.includes('medical') || t.includes('patholog') || t.includes('physiology')) {
    return 1150; // Medical
  }
  if (t.includes('algorithm') || t.includes('database') || t.includes('operating system') || t.includes('machine learning') || t.includes('gate')) {
    return 650; // Engineering
  }
  if (t.includes('physics') || t.includes('chemistry') || t.includes('intermediate') || t.includes('eamcet')) {
    return 420; // Intermediate
  }
  if (t.includes('class 10') || t.includes('class 9') || t.includes('ncert')) {
    return 240; // School NCERT
  }
  if (t.includes('b.com') || t.includes('marketing') || t.includes('accounting')) {
    return 380; // Commerce
  }
  return 290; // General / Novels
}

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB Atlas...');
  const booksCollection = mongoose.connection.collection('books');
  const books = await booksCollection.find({}).toArray();

  console.log(`Processing ${books.length} books in DB...`);

  for (const b of books) {
    const gallery = getGalleryForBook(b.title, b.category, b.subject);
    const updatedPrice = b.listingType === 'SELL' ? getRealisticPrice(b) : 0;

    const finalImages = [
      b.images && b.images.length > 0 && b.images[0].startsWith('http') ? b.images[0] : gallery[0],
      gallery[1],
      gallery[2],
      gallery[3]
    ];

    await booksCollection.updateOne(
      { _id: b._id },
      {
        $set: {
          images: finalImages,
          price: updatedPrice
        }
      }
    );
    console.log(`Updated: ${b.title} | Price: ₹${updatedPrice} | Images: ${finalImages.length}`);
  }

  console.log('All books updated successfully in MongoDB Atlas!');
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

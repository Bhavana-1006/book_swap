# 📚 BookSwap – Campus Book Exchange & Second-Hand Marketplace

A full-stack modern MERN web application engineered for college students to sell, donate, or exchange second-hand course textbooks directly with verified campus peers.

---

## 🌟 Key Features

### 1. 🔐 User Authentication & Profiles
- Secure JWT authentication with HTTP-bearer headers.
- Passwords securely hashed with `bcryptjs`.
- Academic profiles containing College/University name, City, Avatar, listings count, completed exchange metrics, and peer reputation stars.
- Role-based authorization (`USER` and `ADMIN`).

### 2. 📖 Comprehensive Textbook Listings
- **Three Listing Modes**:
  - **SELL**: Set custom student prices with zero marketplace commissions.
  - **DONATE**: Pass textbooks down to juniors for $0.
  - **SWAP**: Direct course book trades with customizable swap preferences.
- Image uploads powered by **Multer** with preview, type validation, and file-size constraints.
- Course taxonomy metadata: Academic Subject, Semester (1-8), Department/Branch, Book Condition (New, Like New, Good, Acceptable), and Description.

### 3. 🔍 Smart Search, Filtering & Pagination
- Debounced search across Book Title, Author, Subject, Branch, and ISBN.
- Multifaceted filters for Subject, Semester, Condition, Listing Type, City, and Price Range.
- Server-side MongoDB pagination and sorting (Newest, Price: Low to High, Price: High to Low, Oldest).
- Shareable URL query parameters.

### 4. 🔄 Request State Machine & Atomic Book Reservation
- Complete exchange lifecycle:
  - `pending` ➔ `accepted` (Atomic reservation: book is instantly flagged `Reserved` to prevent double-claiming)
  - `pending` ➔ `rejected`
  - `pending` ➔ `cancelled`
  - `accepted` ➔ `completed` (Marks book as `Exchanged`)
- Strict authorization: Users cannot request their own listings; only owners can accept/reject.

### 5. ⚡ Smart Two-Way Swap Matching Engine (`/api/swaps/matches`)
- Identifies reciprocal textbook trades:
  - **User A** owns *Algorithms* and seeks *Database Systems*.
  - **User B** owns *Database Systems* and seeks *Algorithms*.
- Calculates match confidence scores (up to 96%) and tags pairings with transparent match reasons.

### 6. 📍 Geolocation & Books Near Me (`/api/books/nearby`)
- MongoDB `2dsphere` index on GeoJSON `Point` coordinates (`[longitude, latitude]`).
- Geospatial queries via `$near` with custom radius filters (5km, 15km, 30km, 50km).
- Browser GPS integration with automatic fallback to city-based search.

### 7. 🏷️ Google Books API ISBN Auto-Fill (`/api/books/isbn/:isbn`)
- Automatically populates Title, Authors, Description, Subject, and Cover thumbnail from ISBN-10 or ISBN-13.

### 8. 💬 Real-Time Campus Chat (Socket.io)
- Integrated conversation between exchange participants in private rooms.
- Fallback persistent storage in MongoDB.

### 9. ⭐ Post-Exchange Ratings & Reviews
- Eligible participants rate exchanges from 1 to 5 stars upon transaction completion.
- Displays average rating and student feedback on user profiles.

### 10. 🛡️ Admin Dashboard & Moderation
- Real-time statistics: Total Students, Active Listings, Completed Exchanges, and Suspended Accounts.
- User management table with search and Ban / Unban actions.
- Listing moderation with removal of inappropriate listings.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, React Router DOM, Axios, Lucide React, Canvas Confetti |
| **Backend** | Node.js, Express.js, JWT, bcryptjs, Multer, Morgan, Socket.io |
| **Database** | MongoDB Atlas / Local MongoDB (Mongoose ODM, 2dsphere indexes) |
| **External** | Google Books API |

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas cluster connection string OR local MongoDB instance running on port `27017`

### 2. Backend Setup
```bash
cd backend
npm install
```
Configure your environment variables in `backend/.env`:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/bookswap?retryWrites=true&w=majority
JWT_SECRET=super_secret_bookswap_jwt_key_2026_xyz
PORT=5000
CLIENT_URL=http://localhost:5173
GOOGLE_BOOKS_API_KEY=
```
Seed initial campus demo data:
```bash
node utils/seedData.js
```
Start backend server:
```bash
node server.js
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 👥 Demo Accounts (1-Click Login Ready)

| Role | Email | Password | College |
| :--- | :--- | :--- | :--- |
| **Student** | `alex@student.edu` | `password123` | State Technical University |
| **Student** | `priya@student.edu` | `password123` | City Engineering College |
| **Student** | `marcus@student.edu` | `password123` | Metropolitan Institute of Tech |
| **Admin** | `admin@bookswap.edu` | `password123` | State Technical University |

---

## 📡 API Reference Summary

### Authentication
- `POST /api/auth/register` - Create student account (supports avatar file)
- `POST /api/auth/login` - Authenticate & obtain JWT
- `GET /api/auth/me` - Current authenticated profile & stats

### Books
- `GET /api/books` - Search & filter listings with pagination
- `POST /api/books` - Create listing (protected, supports photos & GPS)
- `GET /api/books/:id` - Single listing details
- `PUT /api/books/:id` - Update listing (owner/admin)
- `DELETE /api/books/:id` - Soft-delete listing (owner/admin)
- `GET /api/books/my/listings` - Current user's listings
- `GET /api/books/nearby` - Geospatial 2dsphere discovery
- `GET /api/books/isbn/:isbn` - Google Books metadata auto-fill

### Requests & Exchanges
- `POST /api/requests` - Send Purchase / Donation / Swap request
- `GET /api/requests/my` - Requests sent by logged-in user
- `GET /api/requests/incoming` - Requests received for user's listings
- `PATCH /api/requests/:id/status` - State transitions (`accepted`, `rejected`, `cancelled`, `completed`)

### Smart Swaps & Wishlist
- `GET /api/swaps/matches` - Two-way swap matching algorithm
- `GET /api/wishlist` - User saved books
- `POST /api/wishlist/:bookId` - Save to wishlist
- `DELETE /api/wishlist/:bookId` - Remove from wishlist

### Admin & Reviews
- `GET /api/admin/stats` - Platform health stats
- `GET /api/admin/users` - All users list
- `PATCH /api/admin/users/:id/ban` - Ban user
- `PATCH /api/admin/users/:id/unban` - Unban user
- `DELETE /api/admin/listings/:id` - Remove listing
- `POST /api/reviews` - Rate & review completed exchange
- `GET /api/reviews/user/:userId` - Received student reviews
- `GET /api/health` - System health check

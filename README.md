# LoanLink - Loan Management System

A modern, full-stack loan management application built with React and Express.

## 🚀 Live Demo

**[Visit Live Site →](https://loan-link-two.vercel.app/)**

## 📋 Features

- **User Authentication**: Firebase authentication with email/password and Google login
- **Role-Based Access**: Borrower, Manager, and Admin roles
- **Loan Management**: Browse, apply, and manage loans
- **Payment Integration**: Stripe payment gateway for application fees
- **Dashboard**: Comprehensive dashboard for users and administrators
- **Responsive Design**: Mobile-friendly interface with DaisyUI and Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- React 19
- React Router DOM
- TanStack Query (React Query)
- Framer Motion
- DaisyUI + Tailwind CSS
- Firebase Authentication
- Axios
- React Hook Form
- Recharts

### Backend
- Node.js + Express
- MongoDB
- JWT Authentication
- Stripe Payment API
- Cookie Parser
- CORS

## 🔧 Environment Variables

### Client (.env.local)
```env
VITE_apiKey=your_firebase_api_key
VITE_authDomain=your_firebase_auth_domain
VITE_projectId=your_firebase_project_id
VITE_storageBucket=your_firebase_storage_bucket
VITE_messagingSenderId=your_firebase_messaging_sender_id
VITE_appId=your_firebase_app_id
VITE_API_URL=your_backend_api_url
```

### Server (.env)
```env
PORT=5000
MongoURI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
CLIENT_URL=your_frontend_url
NODE_ENV=production
```

## 📦 Installation

### Clone the repository
```bash
git clone https://github.com/AH-Muzahid/LoanLink.git
cd LoanLink
```

### Install Client Dependencies
```bash
cd "LoanLinks clients"
npm install
```

### Install Server Dependencies
```bash
cd ../Server
npm install
```

## 🏃 Running Locally

### Start the Backend Server
```bash
cd Server
npm run dev
```

### Start the Frontend
```bash
cd "LoanLinks clients"
npm run dev
```

The application will be available at `http://localhost:5173`

## 🚢 Deployment

### Frontend (Vercel)
1. Push your code to GitHub
2. Import project in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Backend (Render/Railway/Heroku)
1. Push your code to GitHub
2. Create new web service
3. Set environment variables
4. Deploy

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**AH Muzahid**
- GitHub: [@AH-Muzahid](https://github.com/AH-Muzahid)

## 🙏 Acknowledgments

- Firebase for authentication
- Stripe for payment processing
- MongoDB for database
- Vercel for hosting

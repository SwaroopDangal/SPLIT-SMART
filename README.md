# 💰 SplitSmart

> **Split expenses, stay smart** - The easiest way to share bills and track expenses with friends.

A modern, full-stack expense splitting application built with the MERN stack that helps groups manage shared expenses effortlessly.



## ✨ Features

### 🎯 Core Functionality

- **User Authentication** - Secure authentication powered by Clerk
- **Group Management** - Create and manage expense groups with multiple members
- **Expense Tracking** - Add, view, and delete expenses with detailed information
- **Smart Splitting** - Three split types:
  - ✅ Split Equally
  - 💰 Split Unequally (custom amounts)
  - 📊 Split by Percentage
- **Multiple Payers** - Support for expenses paid by multiple people
- **Balance Calculation** - Real-time balance tracking for all members
- **Settlement Suggestions** - Smart algorithms to minimize number of transactions
- **Invitation System** - Generate shareable invitation links for groups
- **Printable Summaries** - Export group balance reports as PDF

### 🎨 UI/UX Features

- **Modern Design** - Clean, gradient-based UI with Tailwind CSS & DaisyUI
- **Responsive Layout** - Fully responsive design that works on all devices
- **Interactive Modals** - Smooth animations and user-friendly dialogs
- **Real-time Validation** - Live feedback on split amounts and percentages
- **Loading States** - Beautiful loading animations for better UX
- **Toast Notifications** - Informative success/error messages

## 🛠️ Tech Stack

### Frontend

- **React** (v18+) - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library for Tailwind
- **Lucide React** - Icon library
- **React Query** - Data fetching and state management
- **Clerk** - Authentication and user management
- **React-to-Print** - PDF generation

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Development Tools

- **Vite** - Build tool and dev server
- **ESLint** - Code linting
- **Git** - Version control

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Clerk account for authentication

### Clone the Repository

```bash
git clone https://github.com/SwaroopDangal/SPLIT-SMART
cd splitsmart
```

### Frontend Setup

```bash
cd client
npm install

# Create .env file
echo "VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key" > .env
echo "VITE_API_URL=http://localhost:5000/api" >> .env

npm run dev
```

### Backend Setup

```bash
cd server
npm install

# Create .env file
echo "MONGODB_URI=your_mongodb_uri" > .env
echo "PORT=5000" >> .env
echo "CLERK_SECRET_KEY=your_clerk_secret" >> .env

npm start
```

## 🚀 Usage

### Creating a Group

1. Sign in with Clerk authentication
2. Navigate to Dashboard
3. Click "Create New Group"
4. Upload group picture (optional) and enter group name
5. Invite members using the invitation link

### Adding Expenses

1. Open a group from the sidebar
2. Click "Add Expense" button
3. Fill in expense details:
   - Description
   - Amount
   - Date
   - Paid by (single or multiple people)
   - Split type (Equally/Unequally/Percentage)
4. Click "Add Expense" to save

### Viewing Balances

1. Click "View Balance" in the group page
2. See detailed breakdown of:
   - Total group expenses
   - Individual member balances
   - Suggested settlements
3. Admin can record settlements to reset balances

### Printing Summary

1. Click "Print Summary" button
2. Review the formatted report
3. Print or save as PDF


## 🏗️ Project Structure

```
splitsmart/
├── frontend/                # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # API functions and utilities
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── public/            # Static assets
│   └── package.json
│
├── backend/
|   ├── src/                # Backend Express application
│   |   ├── models/            # Mongoose schemas
│   |   ├── routes/            # API routes
│   |   ├── controllers/       # Route controllers
│   |   ├── middleware/        # Custom middleware
│   |   ├── utils/             # Utility functions
│   ├── server.js          # Entry point
│   └── package.json
│
└── README.md
```

## 🔑 Environment Variables

### Frontend (.env)

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)

```env
MONGODB_URI=mongodb://localhost:27017/splitsmart
PORT=5000
CLERK_SECRET_KEY=sk_test_xxxxx
NODE_ENV=development
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👨‍💻 Author

**Your Name**

- GitHub: [@SwaroopDangal](https://github.com/SwaroopDangal)
- LinkedIn: [Swaroop Dangal](https://www.linkedin.com/in/swaroop-dangal-891a05375/)
- Email: swaroopdangal732@gmail.com

## 🙏 Acknowledgments

- [Clerk](https://clerk.com/) - Authentication solution
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [DaisyUI](https://daisyui.com/) - Component library
- [Lucide](https://lucide.dev/) - Icon library
- [React Query](https://tanstack.com/query) - Data fetching

---

<div align="center">
  <p>Made with ❤️ by the SplitSmart Team</p>
  <p>⭐ Star us on GitHub — it helps!</p>
</div>

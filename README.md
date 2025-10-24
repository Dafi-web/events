# DafiTech - Business, Events & Learning Platform

A comprehensive MERN stack application that empowers professionals, entrepreneurs, and learners through business networking, event management, and educational resources.

## 🌟 Features

### Core Functionality
- **User Authentication**: Secure registration and login with JWT
- **Business Directory**: Professional listings and business discovery
- **Event Management**: Event creation, RSVP functionality, and networking
- **Learning Platform**: Online courses and skill development programs
- **News & Stories**: Industry insights and platform updates
- **Admin Dashboard**: Comprehensive management panel

### Website Pages
1. **Home Page**: Platform overview, upcoming events, latest news, course highlights
2. **About Page**: Mission, vision, values, and team information
3. **Events Page**: Professional events with filters, search, and RSVP functionality
4. **News & Stories**: Industry news with category filtering
5. **Directory**: Business and professional listings with search
6. **Tutorials**: Learning courses and skill development programs
7. **Join Us**: Registration and community membership
8. **Contact**: Contact form and support information

## 🚀 Tech Stack

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Cloudinary** for image management
- **Nodemailer** for email functionality

### Frontend
- **React** with modern hooks and context
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Axios** for API communication

### Deployment
- **Vercel** for frontend hosting
- **Render** for backend hosting
- **MongoDB Atlas** for cloud database

## 📁 Project Structure

```
DafiTech/
├── server/                 # Backend Express.js application
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Authentication middleware
│   └── index.js           # Server entry point
├── client/                # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context providers
│   │   └── utils/         # Utility functions
├── package.json           # Root package configuration
└── README.md             # This file
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DafiTech
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   
   Create `.env` file in the `server` directory:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/dafitech
   JWT_SECRET=your_jwt_secret_key_here
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   ```

   Create `.env` file in the `client` directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and React development server (port 6000).

## 🔧 Development Commands

### Root Level
- `npm run dev` - Start both frontend and backend in development mode
- `npm run install-all` - Install dependencies for both frontend and backend

### Backend (server/)
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Frontend (client/)
- `npm start` - Start React development server
- `npm run build` - Build for production
- `npm test` - Run tests

## 📊 Database Models

### User Model
- Personal information (name, email, country, profession)
- Authentication (password, role, verification status)
- Profile details (bio, interests, social links)

### Event Model
- Event details (title, description, date, time, location)
- Organization and attendance tracking
- Category and tagging system

### News Model
- Article content (title, content, excerpt, images)
- Publishing workflow (draft, published, featured)
- Author and category management

### Directory Model
- Business/professional listings
- Contact information and location details
- Verification and approval system

### Course Enrollment Model
- Student enrollment information
- Course selection and progress tracking
- Payment and completion status

## 🔐 Authentication & Authorization

- JWT-based authentication system
- Role-based access control (member, admin)
- Protected routes and API endpoints
- Secure password hashing with bcrypt

## 🎨 UI/UX Features

- Responsive design for all devices
- Modern and clean interface
- Accessibility considerations
- Smooth animations and transitions
- Loading states and error handling

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Events
- `GET /api/events` - Get events with filtering
- `POST /api/events` - Create event (authenticated)
- `GET /api/events/:id` - Get event details
- `POST /api/events/:id/rsvp` - RSVP to event

### News
- `GET /api/news` - Get published articles
- `POST /api/news` - Create article (authenticated)
- `GET /api/news/:id` - Get article details

### Directory
- `GET /api/directory` - Get approved listings
- `POST /api/directory` - Submit listing
- `PUT /api/directory/admin/:id/approve` - Approve listing (admin)

### Tutorials
- `GET /api/tutorials/courses` - Get available courses
- `POST /api/tutorials/enroll` - Enroll in course
- `GET /api/tutorials/my-enrollments` - Get user enrollments
- `GET /api/tutorials/enrollments` - Get all enrollments (admin)

### Contact
- `POST /api/contact` - Send contact form

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Render)
1. Connect your GitHub repository to Render
2. Set environment variables in Render dashboard
3. Configure build and start commands

### Database (MongoDB Atlas)
1. Create cluster on MongoDB Atlas
2. Set up database user and network access
3. Update connection string in environment variables

## 🔮 Future Enhancements

- **Mobile App**: React Native version for iOS and Android
- **Advanced Analytics**: Business insights and user engagement metrics
- **Payment Integration**: Stripe integration for course payments
- **Video Learning**: Live streaming and recorded course sessions
- **AI Features**: Personalized course recommendations and business matching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions, contact the DafiTech team at wediabrhana@gmail.com.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Developer

**Dawit Abrha** - Full-Stack Developer
- Email: wediabrhana@gmail.com
- Specializes in React, Node.js, MongoDB, and modern web technologies
- Available for custom web development projects
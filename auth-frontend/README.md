# 🔐 Auth System Frontend

A modern, secure authentication frontend built with React, TypeScript, and Tailwind CSS. This application provides a complete authentication flow with OTP support, user management, and a beautiful UI.

## ✨ Features

### Authentication
- ✅ Email/Phone + Password login
- ✅ OTP (One-Time Password) authentication
- ✅ Auto-detect new vs existing users
- ✅ Secure token management with refresh tokens
- ✅ Protected routes and role-based access

### User Features
- 👤 User dashboard with account details
- 📝 Profile management
- 🔑 Password management (set/update)
- 📱 Support for both email and phone authentication

### Admin Features
- 👥 User management dashboard
- 🔍 Search and filter users
- 🔒 Lock/unlock user accounts
- 🔑 Reset user passwords
- 🗑️ Delete user accounts

### UI/UX
- 🎨 Modern, responsive design with Tailwind CSS
- 🌐 RTL support for Persian language
- 📱 Mobile-friendly interface
- 🎯 Intuitive user flow
- 🔔 Real-time notifications with toast messages

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ and npm
- Backend API running (Laravel Auth Module)

### Installation

1. **Clone the repository**
```bash
cd auth-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
```
Edit `.env` and set your API URL:
```
REACT_APP_API_URL=http://localhost:8000/api
```

4. **Start development server**
```bash
npm start
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── Layout.tsx      # Main layout with navigation
│   └── ProtectedRoute.tsx # Route protection wrapper
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state management
├── pages/              # Page components
│   ├── Login.tsx       # Login/Register page
│   ├── Dashboard.tsx   # User dashboard
│   ├── Profile.tsx     # Profile management
│   └── admin/          # Admin pages
│       └── UserManagement.tsx
├── services/           # API services
│   └── AuthService.ts  # Authentication API client
├── types/              # TypeScript type definitions
│   └── auth.types.ts   # Auth-related types
└── App.tsx            # Main app component with routing
```

## 🔐 Authentication Flow

### For New Users:
1. Enter email/phone → System detects new user
2. Receive OTP → Enter name and OTP code
3. Account created → Redirected to dashboard

### For Existing Users with Password:
1. Enter email/phone → System detects existing user
2. Enter password → Login successful
3. Redirected to dashboard

### For Existing Users (OTP Only):
1. Enter email/phone → System detects OTP-only user
2. Receive OTP → Enter OTP code
3. Login successful → Redirected to dashboard

## 🛠️ Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject configuration (not recommended)
npm run eject
```

## 🔧 Configuration

### API Endpoints
The application expects the following API endpoints to be available:

- `POST /auth/check-user` - Check if user exists
- `POST /auth/send-otp` - Send OTP code
- `POST /auth/verify-otp` - Verify OTP and login
- `POST /auth/login-password` - Password login
- `POST /auth/refresh` - Refresh access token
- `GET /auth/user` - Get current user
- `POST /auth/logout` - Logout current session
- `POST /auth/profile/update` - Update user profile
- `POST /auth/password/set` - Set password for OTP users
- `POST /auth/password/update` - Update existing password

### Environment Variables
- `REACT_APP_API_URL` - Backend API base URL
- `REACT_APP_ENV` - Environment (development/production)

## 🎨 Customization

### Theme Colors
Edit `tailwind.config.js` to customize the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom primary colors
      }
    }
  }
}
```

### Language & Localization
The app is configured for Persian (RTL) by default. Text strings are hardcoded in Persian but can be easily extracted to a localization system.

## 🔒 Security Features

- **Token Storage**: Tokens stored in localStorage with automatic refresh
- **Protected Routes**: Automatic redirect for unauthenticated users
- **Role-Based Access**: Admin-only routes protected
- **Input Validation**: Form validation with Yup
- **XSS Protection**: React's built-in XSS protection
- **HTTPS Ready**: Configured for secure connections

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🧪 Testing

### Development Testing
- Use OTP code `123456` in development environment
- Test accounts can be created with any email/phone
- Admin features accessible with username `admin`

## 🚢 Production Deployment

1. **Build the application**
```bash
npm run build
```

2. **Configure production environment**
```bash
cp .env.example .env.production
# Edit with production API URL
```

3. **Deploy the `build` folder** to your web server

### Deployment Options:
- **Static hosting**: Netlify, Vercel, GitHub Pages
- **Traditional hosting**: Apache/Nginx
- **Cloud platforms**: AWS S3, Google Cloud Storage

### Nginx Configuration Example:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/auth-frontend/build;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /api {
        proxy_pass http://backend-server:8000;
    }
}
```

## 🐛 Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Ensure backend allows frontend origin
   - Check API URL in `.env`

2. **Token Expired**
   - App automatically refreshes tokens
   - If refresh fails, user is logged out

3. **Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility

## 📄 License

This project is part of a complete authentication system. Use according to your project's license.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For issues and questions:
- Check the documentation
- Review existing issues
- Create a new issue with details

---

Built with ❤️ using React, TypeScript, and Tailwind CSS
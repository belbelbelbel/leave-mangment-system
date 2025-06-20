# Leave Management System

A full-stack web application for managing employee leave requests in small organizations. Built with Node.js, Express, MongoDB, and modern frontend technologies.

## 🚀 Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Employee & Admin)
- Secure password hashing with bcrypt
- Protected routes and middleware

### 👤 Employee Features
- **Dashboard**: Overview with leave balance, recent requests, and notices
- **Leave Application**: Submit new leave requests with validation
- **Leave History**: View all past and pending leave requests with filtering
- **Notice Board**: Read company announcements and notices
- **Leave Balance**: Real-time balance tracking for different leave types

### 🛠️ Admin Features
- **Dashboard**: Analytics with charts and statistics
- **Leave Management**: Approve/reject leave requests
- **User Management**: Create, edit, and delete users
- **Notice Management**: Create, edit, and delete company notices
- **Balance Management**: Adjust employee leave balances

### 📊 Additional Features
- Real-time data updates
- Search and filtering capabilities
- Responsive design for all devices
- Modern UI with Tailwind CSS
- Interactive charts and statistics

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **HTML5** - Markup
- **CSS3** - Styling
- **JavaScript (ES6+)** - Programming language
- **Tailwind CSS** - Utility-first CSS framework
- **Alpine.js** - Lightweight JavaScript framework
- **Axios** - HTTP client
- **Chart.js** - Charting library
- **Font Awesome** - Icons

## 📁 Project Structure

```
leave-management-system/
├── frontend/
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── login.html
│   │   │   └── register.html
│   │   ├── employee/
│   │   │   ├── employee-dashboard.html
│   │   │   ├── leave-request.html
│   │   │   ├── my-leaves.html
│   │   │   └── employee-notices.html
│   │   ├── admin/
│   │   │   ├── admin-dashboard.html
│   │   │   ├── manage-leaves.html
│   │   │   ├── manage-users.html
│   │   │   ├── notice-board.html
│   │   │   └── adjust-balance.html
│   │   └── components/
│   ├── assets/
│   │   ├── css/
│   │   ├── js/
│   │   └── images/
│   ├── package.json
│   └── index.html
├── models/
│   ├── User.js
│   ├── Leave.js
│   ├── Balance.js
│   └── Notice.js
├── controllers/
│   ├── authController.js
│   ├── leaveController.js
│   ├── balanceController.js
│   ├── noticeController.js
│   └── userController.js
├── middleware/
│   ├── auth.js
│   └── role.js
├── routes/
│   ├── authRoutes.js
│   ├── leaveRoutes.js
│   ├── balanceRoutes.js
│   ├── noticeRoutes.js
│   └── userRoutes.js
├── server.js
├── package.json
└── README.md
```

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['Employee', 'Admin']),
  profilePhoto: String (optional),
  timestamps: true
}
```

### Leave Model
```javascript
{
  employeeId: ObjectId (ref: User),
  startDate: Date (required),
  endDate: Date (required),
  leaveType: String (enum: ['Sick', 'Vacation', 'Personal']),
  description: String (required),
  status: String (enum: ['Pending', 'Approved', 'Rejected']),
  approvedBy: ObjectId (ref: User),
  approvedAt: Date,
  timestamps: true
}
```

### Balance Model
```javascript
{
  employeeId: ObjectId (ref: User),
  leaveType: String (enum: ['Sick', 'Vacation', 'Personal']),
  balance: Number (required, min: 0),
  timestamps: true
}
```

### Notice Model
```javascript
{
  title: String (required, max: 200),
  content: String (required),
  postedBy: ObjectId (ref: User),
  postedDate: Date (default: now),
  isActive: Boolean (default: true),
  timestamps: true
}
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup
1. Clone the repository:
```bash
git clone <repository-url>
cd leave-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/leave-management
JWT_SECRET=your-super-secret-jwt-key
```

4. Start the server:
```bash
npm start
```

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. The frontend is served statically by the backend, so no separate server is needed.

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Leave Management
- `POST /api/leaves` - Apply for leave (Employee)
- `GET /api/leaves` - Get user's leaves (Employee)
- `GET /api/leaves/all` - Get all leaves (Admin)
- `PUT /api/leaves/:id` - Update leave status (Admin)

### Balance Management
- `GET /api/balances` - Get user's balance (Employee)
- `GET /api/balances/all` - Get all balances (Admin)
- `PUT /api/balances/:employeeId` - Update balance (Admin)

### Notice Management
- `GET /api/notices` - Get all notices
- `POST /api/notices` - Create notice (Admin)
- `PUT /api/notices/:id` - Update notice (Admin)
- `DELETE /api/notices/:id` - Delete notice (Admin)

### User Management
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get user by ID (Admin)
- `PUT /api/users/:id` - Update user (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update current user profile

### Admin Statistics
- `GET /api/admin/stats` - Get dashboard statistics (Admin)

## 🎨 UI Features

### Employee Interface
- **Dashboard**: Overview cards with leave balance and recent activity
- **Leave Application**: Form with validation and balance checking
- **Leave History**: Filterable list with status indicators
- **Notice Board**: Searchable notices with modal details

### Admin Interface
- **Dashboard**: Statistics cards and interactive charts
- **Leave Management**: Table with approval/rejection actions
- **User Management**: CRUD operations with role management
- **Notice Management**: Create and manage company announcements
- **Balance Management**: Adjust employee leave balances

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control
- Protected API endpoints
- Input validation and sanitization
- CORS configuration

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Environment Variables
- `PORT` - Server port (default: 3000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🔧 Customization

### Adding New Leave Types
1. Update the Leave model enum
2. Update the Balance model enum
3. Modify frontend forms and displays
4. Update validation logic

### Adding New User Roles
1. Update the User model enum
2. Modify role middleware
3. Update frontend role checks
4. Adjust navigation and permissions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Version History

- **v1.0.0** - Initial release with core features
- Complete leave management system
- Role-based access control
- Modern responsive UI
- Full CRUD operations 
# Telegram Web App - Employee Registration System

A Telegram Web Application that allows employees to register and administrators to approve registrations. The system consists of a React frontend and a FastAPI backend, with MongoDB Atlas as the database.

## Features

- Employee registration through Telegram Web App
- Admin approval system
- Secure authentication with JWT
- MongoDB Atlas integration
- Real-time status updates

## Project Structure

```
.
├── backend/
│   ├── main.py           # FastAPI application
│   ├── models.py         # Pydantic models
│   ├── auth.py          # Authentication logic
│   ├── database.py      # Database connection
│   └── requirements.txt  # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── App.tsx     # Main application
│   │   └── main.tsx    # Entry point
│   ├── .env            # Frontend environment variables
│   └── package.json    # Node.js dependencies
└── README.md
```

## Prerequisites

- Node.js 16+ and npm
- Python 3.8+
- MongoDB Atlas account
- Telegram Bot Token (for production)

## Setup Instructions

### Backend Setup

1. Create and activate a virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the backend directory:
```env
MONGODB_URI=your_mongodb_uri
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin
JWT_SECRET=your-secret-key
```

4. Run the development server:
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:8000
```

3. Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

### Employee Endpoints

- `POST /register` - Register a new employee
  - Required fields: name, phone, telegram_id

### Admin Endpoints

- `POST /admin/login` - Admin login
  - Required fields: username, password
- `GET /admin/requests` - Get pending registration requests
- `POST /admin/approve/{user_id}` - Approve a registration request
- `POST /admin/reject/{user_id}` - Reject a registration request
- `GET /user/status/{telegram_id}` - Check user registration status

## Deployment

### Backend Deployment (Railway)

1. Create a new project on Railway
2. Connect your GitHub repository
3. Add environment variables
4. Deploy

### Frontend Deployment (Vercel)

1. Push your code to GitHub
2. Create a new project on Vercel
3. Import your repository
4. Configure environment variables
5. Deploy

### Database (MongoDB Atlas)

1. Create a cluster on MongoDB Atlas
2. Configure network access
3. Create a database user
4. Get your connection string
5. Add it to your backend environment variables

## Security Considerations

- All passwords are securely hashed
- JWT tokens are used for authentication
- CORS is properly configured
- Environment variables are used for sensitive data
- Input validation is implemented
- Rate limiting should be added in production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
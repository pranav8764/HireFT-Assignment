# Job Match Analyzer

A full-stack web application that compares job descriptions with candidate resumes to provide match analysis, skill gap identification, and AI-powered resume improvement suggestions.

## Features

- **Job Analysis**: Scrape job postings from URLs to extract requirements and skills
- **Resume Parsing**: Extract text and skills from PDF resume files
- **Skill Matching**: Compare job requirements with resume skills using intelligent matching
- **Match Scoring**: Calculate compatibility percentage between job and resume
- **AI Suggestions**: Get personalized resume improvement recommendations using OpenAI GPT-4
- **Analysis History**: Store and track analysis results in MongoDB

## Architecture

- **Frontend**: React 18 + Vite development server
- **Backend**: Node.js + Express REST API
- **Database**: MongoDB for analysis history storage
- **AI Service**: OpenAI API for resume improvement suggestions
- **File Processing**: PDF parsing and web scraping capabilities

## Prerequisites

Before running this application, ensure you have:

- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)
- **MongoDB Atlas account** (for cloud database) or local MongoDB installation
- **OpenAI API key** (for AI-powered suggestions)

### Getting API Keys

1. **MongoDB Atlas**:
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Get your connection string from the "Connect" button

2. **OpenAI API Key**:
   - Sign up at [OpenAI Platform](https://platform.openai.com/)
   - Navigate to [API Keys](https://platform.openai.com/api-keys)
   - Create a new API key

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd job-match-analyzer
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your configuration
# Required variables:
# - MONGODB_URI: Your MongoDB connection string
# - OPENAI_API_KEY: Your OpenAI API key
# - PORT: Server port (default: 9000)
# - FRONTEND_URL: Frontend URL for CORS (default: http://localhost:5173)
```

**Backend Environment Variables (.env)**:
```env
# MongoDB connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/job-match-analyzer

# OpenAI API key for AI suggestions
OPENAI_API_KEY=sk-your-openai-api-key-here

# Server port (default: 9000)
PORT=9000

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file if needed (default should work)
```

**Frontend Environment Variables (.env)**:
```env
# Backend API URL
VITE_API_URL=http://localhost:9000
```

## Running the Application

### Development Mode

**Start Backend Server**:
```bash
cd backend
npm run dev
```
The backend API will be available at `http://localhost:9000`

**Start Frontend Development Server** (in a new terminal):
```bash
cd frontend
npm run dev
```
The frontend will be available at `http://localhost:5173`

### Production Mode

**Backend**:
```bash
cd backend
npm start
```

**Frontend**:
```bash
cd frontend
npm run build
npm run preview
```

## API Endpoints

### POST /api/analyze

Performs complete job-resume analysis.

**Request**:
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body:
  - `jobUrl`: Job posting URL (string)
  - `resumeFile`: PDF resume file

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "analysis_id",
    "jobTitle": "Software Engineer",
    "company": "Tech Company",
    "jobSkills": ["JavaScript", "React", "Node.js"],
    "resumeSkills": ["JavaScript", "Python", "React"],
    "matchScore": 66.67,
    "matchingSkills": ["JavaScript", "React"],
    "missingSkills": ["Node.js"],
    "suggestions": [
      "Add Node.js experience to your resume",
      "Highlight JavaScript projects more prominently"
    ],
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### GET /health

Health check endpoint to verify API status.

**Response**:
```json
{
  "status": "OK",
  "message": "Job Match Analyzer API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Usage Guide

1. **Enter Job URL**: Paste the URL of a job posting you're interested in
2. **Upload Resume**: Select and upload your resume as a PDF file
3. **Analyze**: Click the analyze button to start the comparison
4. **Review Results**: 
   - View your match score percentage
   - See which skills you have that match the job
   - Identify missing skills you should develop
   - Read AI-generated suggestions for resume improvement

## Supported Job Sites

The application can scrape job postings from most websites that have standard HTML structure, including:
- LinkedIn Jobs
- Indeed
- Glassdoor
- Company career pages
- Job boards with standard HTML formatting

## Technical Details

### Skill Detection

The application uses a comprehensive skill dictionary including:
- **Programming Languages**: Python, JavaScript, TypeScript, Java, C++, C#, Go, Rust
- **Frontend Frameworks**: React, Angular, Vue, HTML, CSS
- **Backend Technologies**: Node.js, Express, Django, Flask, Spring
- **Databases**: SQL, MongoDB, PostgreSQL, MySQL, Redis
- **Cloud Platforms**: AWS, Azure, GCP, Docker, Kubernetes
- **Tools**: Git, CI/CD, Jenkins, Airflow, Tableau

### AI Suggestions

The application uses OpenAI's GPT-4 model to generate personalized suggestions focusing on:
- Adding missing skills or keywords
- Highlighting relevant experience
- Improving resume structure
- Quantifying achievements
- Tailoring content to job requirements

## Troubleshooting

### Common Issues

**Backend won't start**:
- Check that all environment variables are set in `.env`
- Verify MongoDB connection string is correct
- Ensure OpenAI API key is valid
- Check if port 9000 is already in use

**Frontend can't connect to backend**:
- Verify backend is running on port 9000
- Check `VITE_API_URL` in frontend `.env` file
- Ensure CORS is properly configured

**PDF upload fails**:
- Verify file is a valid PDF
- Check file size is under 5MB limit
- Ensure PDF contains extractable text

**Job scraping fails**:
- Verify the job URL is accessible
- Some sites may block automated requests
- Try different job posting URLs

### Port Conflicts

If you encounter port conflicts:

**Backend (default port 9000)**:
```bash
# Change PORT in backend/.env
PORT=8000

# Update VITE_API_URL in frontend/.env
VITE_API_URL=http://localhost:8000
```

**Frontend (default port 5173)**:
```bash
# Vite will automatically use next available port
# Update FRONTEND_URL in backend/.env if needed
```

## Development

### Project Structure

```
job-match-analyzer/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── .env.example     # Environment template
│   ├── package.json     # Dependencies
│   └── server.js        # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API client
│   │   └── App.jsx      # Main app component
│   ├── .env.example     # Environment template
│   ├── package.json     # Dependencies
│   └── vite.config.js   # Vite configuration
└── README.md            # This file
```

### Available Scripts

**Backend**:
- `npm run dev`: Start development server with nodemon
- `npm start`: Start production server
- `npm test`: Run tests (not implemented)

**Frontend**:
- `npm run dev`: Start Vite development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.
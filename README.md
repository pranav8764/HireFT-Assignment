# Job Match Analyzer

A full-stack web application that compares job descriptions with candidate resumes to provide comprehensive match analysis, skill gap identification, and AI-powered resume improvement suggestions.

## Features

- **Advanced Job Scraping**: Intelligent web scraping with platform-specific parsers (Greenhouse, Lever, Ashby) and generic fallback
- **Resume Parsing**: Extract text and skills from PDF resume files with comprehensive skill detection
- **Multi-Factor Matching Engine**: Sophisticated matching across multiple dimensions:
  - Skills matching with fuzzy logic and synonym detection
  - Experience level matching (years and seniority)
  - Education requirements matching
  - Responsibility alignment analysis
  - Weighted final score calculation
- **Match Scoring**: Calculate detailed compatibility percentage with factor breakdowns
- **AI Suggestions**: Get personalized resume improvement recommendations using Groq (Llama 3.3 70B)
- **Analysis History**: Store and track analysis results in MongoDB
- **Error Handling**: Comprehensive error boundaries and graceful degradation
- **Property-Based Testing**: Robust test coverage with fast-check for correctness validation

## Architecture

- **Frontend**: React 18 + Vite with comprehensive error handling and loading states
- **Backend**: Node.js + Express REST API with modular service architecture
- **Database**: MongoDB for analysis history storage
- **AI Service**: Groq API with Llama 3.3 70B Versatile model for resume improvement suggestions
- **Scraping Engine**: Puppeteer-based scraper with platform detection and content scoring
- **Matching Engine**: Multi-factor matching system with weighted scoring
- **Testing**: Vitest + Jest with property-based testing using fast-check

## Prerequisites

Before running this application, ensure you have:

- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)
- **MongoDB Atlas account** (for cloud database) or local MongoDB installation
- **Groq API key** (for AI-powered suggestions)

### Getting API Keys

1. **MongoDB Atlas**:
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Get your connection string from the "Connect" button

2. **Groq API Key**:
   - Visit [Groq Console](https://console.groq.com/keys)
   - Sign in or create an account
   - Click "Create API Key" and copy the generated key
   - Free tier: Fast inference with generous rate limits

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
# - GROQ_API_KEY: Your Groq API key
# - PORT: Server port (default: 9000)
# - FRONTEND_URL: Frontend URL for CORS (default: http://localhost:5173)
```

**Backend Environment Variables (.env)**:
```env
# MongoDB connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/job-match-analyzer

# Groq API key for AI suggestions
GROQ_API_KEY=gsk_your-groq-api-key-here

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
    "matchScore": 75.5,
    "factorScores": {
      "skills": 66.67,
      "experience": 85.0,
      "education": 100.0,
      "responsibilities": 70.0
    },
    "matchingSkills": ["JavaScript", "React"],
    "missingSkills": ["Node.js"],
    "suggestions": [
      "Add Node.js experience to your resume with specific projects",
      "Highlight JavaScript projects more prominently",
      "Quantify your React development achievements"
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

The application features an intelligent scraping engine with:
- **Platform-Specific Parsers**: Optimized extraction for Greenhouse, Lever, and Ashby ATS platforms
- **Generic Parser**: Fallback parser with content scoring for any job site
- **Puppeteer Rendering**: JavaScript-heavy page support
- **Content Validation**: Quality scoring to ensure accurate extraction

Successfully tested with:
- LinkedIn Jobs
- Indeed
- Glassdoor
- Company career pages (Greenhouse, Lever, Ashby)
- Most standard job boards

## Technical Details

### Multi-Factor Matching Engine

The application uses a sophisticated matching system that evaluates multiple dimensions:

**1. Skills Matching (40% weight)**
- Fuzzy matching with synonym detection
- Technical skills prioritization
- Comprehensive skill dictionary (500+ skills)
- Partial match scoring

**2. Experience Matching (30% weight)**
- Years of experience comparison
- Seniority level alignment
- Career progression analysis

**3. Education Matching (15% weight)**
- Degree level comparison
- Field of study relevance
- Certification recognition

**4. Responsibility Matching (15% weight)**
- Job duty alignment
- Role scope comparison
- Leadership indicators

### Skill Detection

Comprehensive skill dictionary including:
- **Programming Languages**: Python, JavaScript, TypeScript, Java, C++, C#, Go, Rust, Ruby, PHP, Swift, Kotlin
- **Frontend**: React, Angular, Vue, Svelte, Next.js, HTML, CSS, Tailwind
- **Backend**: Node.js, Express, Django, Flask, Spring Boot, FastAPI, .NET
- **Databases**: SQL, MongoDB, PostgreSQL, MySQL, Redis, Cassandra, DynamoDB
- **Cloud**: AWS, Azure, GCP, Docker, Kubernetes, Terraform
- **Tools**: Git, CI/CD, Jenkins, GitHub Actions, Jira, Agile, Scrum
- **Data Science**: Machine Learning, TensorFlow, PyTorch, Pandas, NumPy

### AI Suggestions

The application uses Groq's Llama 3.3 70B Versatile model to generate personalized suggestions:
- Adding missing skills or keywords
- Highlighting relevant experience
- Improving resume structure
- Quantifying achievements
- Tailoring content to job requirements
- Ultra-fast response times with high-quality output

## Troubleshooting

### Common Issues

**Backend won't start**:
- Check that all environment variables are set in `.env`
- Verify MongoDB connection string is correct
- Ensure Groq API key is valid (starts with `gsk_`)
- Check if port 9000 is already in use
- Run `npm install` to ensure all dependencies are installed

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
- Some sites may block automated requests or require authentication
- Check browser console for specific error messages
- Try different job posting URLs from supported platforms
- Ensure Puppeteer dependencies are installed correctly

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

### Testing

The project includes comprehensive test coverage:

**Property-Based Testing**:
- Uses `fast-check` library for property-based testing
- Validates correctness properties across input ranges
- Tests in `backend/services/matching/__tests__/`
- Frontend component property tests

**Unit Tests**:
- Jest for backend testing
- Vitest for frontend testing
- Component tests with React Testing Library

**Integration Tests**:
- End-to-end flow validation
- API endpoint testing
- Error handling verification

Run tests:
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Watch mode for development
npm run test:watch
```

### Recent Improvements

**Multi-Factor Matching Engine**:
- Replaced simple skill matching with comprehensive multi-factor analysis
- Weighted scoring across skills, experience, education, and responsibilities
- Improved accuracy and relevance of match scores

**Enhanced Job Scraping**:
- Platform-specific parsers for major ATS systems
- Content quality scoring and validation
- Better handling of JavaScript-heavy pages
- Fallback mechanisms for reliability

**AI Service Migration**:
- Migrated from OpenAI to Groq with Llama 3.3 70B Versatile
- Ultra-fast response times (significantly faster than GPT models)
- More cost-effective with generous free tier
- High-quality, focused suggestions

**Error Handling & UX**:
- Comprehensive error boundaries
- Graceful degradation for partial failures
- Loading states and user feedback
- Input validation and sanitization

### Project Structure

```
job-match-analyzer/
├── backend/
│   ├── config/              # Database configuration
│   ├── controllers/         # Request handlers
│   ├── middleware/          # Validation middleware
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API routes
│   ├── services/
│   │   ├── matching/        # Multi-factor matching engine
│   │   │   ├── skillMatcher.js
│   │   │   ├── experienceMatcher.js
│   │   │   ├── educationMatcher.js
│   │   │   ├── responsibilityMatcher.js
│   │   │   ├── finalScoreCalculator.js
│   │   │   └── __tests__/   # Property-based tests
│   │   ├── scraper/         # Job scraping engine
│   │   │   ├── platformParsers/  # ATS-specific parsers
│   │   │   ├── genericParser.js
│   │   │   ├── contentScorer.js
│   │   │   └── renderPage.js
│   │   ├── aiSuggestions.js # Groq (Llama 3.3 70B) integration
│   │   ├── resumeParser.js  # PDF parsing
│   │   └── skillExtractor.js
│   ├── .env.example         # Environment template
│   ├── package.json         # Dependencies
│   └── server.js            # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── GracefulDegradation.jsx
│   │   │   ├── JobInput.jsx
│   │   │   ├── ResumeUpload.jsx
│   │   │   ├── Results.jsx
│   │   │   └── __tests__/   # Component tests
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # API client
│   │   └── App.jsx          # Main app component
│   ├── .env.example         # Environment template
│   ├── package.json         # Dependencies
│   ├── vite.config.js       # Vite configuration
│   └── vitest.config.js     # Test configuration
├── .kiro/
│   └── specs/               # Feature specifications
└── README.md                # This file
```

### Available Scripts

**Backend**:
- `npm run dev`: Start development server with nodemon
- `npm start`: Start production server
- `npm test`: Run Jest tests
- `npm run test:watch`: Run tests in watch mode

**Frontend**:
- `npm run dev`: Start Vite development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm test`: Run Vitest tests
- `npm run test:watch`: Run tests in watch mode

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## Additional Documentation

- `QUICK_START_GUIDE.md` - Quick setup and testing guide
- `SETUP_GOOGLE_AI.md` - Legacy Google AI setup (now using Groq)
- `INTEGRATION_TEST_REPORT.md` - Integration test results
- `backend/services/scraper/ARCHITECTURE.md` - Scraper architecture details
- `backend/services/scraper/README.md` - Scraper usage guide
- `.kiro/specs/` - Feature specifications and implementation plans

## License

This project is licensed under the ISC License.

# Job Match Analyzer - Frontend

React-based frontend application for the Job Match Analyzer system.

## Features

- Job URL input with validation
- PDF resume upload with drag & drop
- Real-time analysis with loading states
- Interactive match score visualization
- Skill comparison with color-coded badges
- AI-powered improvement suggestions
- Responsive design for all devices

## Components

- **JobInput**: URL input with validation
- **ResumeUpload**: PDF file upload with react-dropzone
- **MatchScore**: Circular progress indicator for match percentage
- **SkillList**: Categorized skill badges (matching, missing, job, resume)
- **Results**: Complete analysis results display
- **App**: Main application orchestrating all components

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your backend URL if different from default

4. Start development server:
```bash
npm run dev
```

The application will be available at http://localhost:5173

## Build

```bash
npm run build
```

## Environment Variables

- `VITE_API_URL`: Backend API base URL (default: http://localhost:9000)

## API Integration

The frontend communicates with the backend via:
- POST `/api/analyze` - Main analysis endpoint accepting job URL and resume file

## Browser Support

- Modern browsers with ES6+ support
- Mobile responsive design
- Tested on Chrome, Firefox, Safari, Edge
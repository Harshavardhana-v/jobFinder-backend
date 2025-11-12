# JobHUD Backend

A simple Node.js/Express backend for the JobHUD application.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Server

#### Development Mode (with auto-reload):
```bash
npm run dev
```

#### Production Mode:
```bash
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Health Check
- `GET /api/health` - Check if the server is running

### Profile
- `GET /api/profile/:userId` - Get user profile
- `POST /api/profile/:userId` - Create or update full profile
- `PATCH /api/profile/:userId` - Partially update profile

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=3001
NODE_ENV=development
```

## Development

### Linting
```bash
npm run lint
```

### Testing
```bash
npm test
```

## Deployment

For production deployment, consider using:
- PM2 for process management
- Nginx as a reverse proxy
- Environment variables for configuration
- A proper database (MongoDB, PostgreSQL, etc.) instead of in-memory storage

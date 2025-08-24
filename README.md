# Love Project Deployment Guide

## Environment Setup

### Development
1. Clone the repository
2. Install dependencies
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```
3. Set up local MongoDB
4. Create `.env.development` files
   - Frontend: `VITE_API_URL=http://localhost:5000/api`
   - Backend: `MONGODB_URI=mongodb://localhost:27017/love_dev`

### Production Deployment on Railway

#### Frontend
- Build Command: `npm run build`
- Start Command: `npm run preview`
- Port: 8080
- Environment Variables:
  - `VITE_API_URL`: Backend API URL
  - `VITE_APP_ENV`: production

#### Backend
- Build Command: `npm run build`
- Start Command: `npm run start:prod`
- Port: 5000
- Environment Variables:
  - `MONGODB_URI`: MongoDB Atlas Connection String
  - `NODE_ENV`: production

## Deployment Checklist
- [ ] Set up MongoDB Atlas
- [ ] Configure Railway environments
- [ ] Set environment variables
- [ ] Test deployment

## Troubleshooting
- Check Railway logs
- Verify environment variables
- Ensure MongoDB connection is correct

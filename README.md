# Love Dating Application - Railway Deployment

## Deployment Configuration

This project is configured for deployment on Railway using Nixpacks.

### Deployment Steps

1. Ensure you have the following environment variables set in Railway:
   - `MONGODB_URI`: Connection string for MongoDB
   - `JWT_SECRET`: Secret key for JWT authentication
   - `RAILWAY_STATIC_URL`: URL of the deployed application
   - `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
   - `CLOUDINARY_API_KEY`: Cloudinary API key
   - `CLOUDINARY_API_SECRET`: Cloudinary API secret

2. The deployment uses Nixpacks to build and start the application:
   - Builds frontend with `pnpm`
   - Installs backend dependencies
   - Starts the backend server

### Deployment Configuration Files

- `nixpacks.toml`: Defines build and start commands
- `Procfile`: Specifies the web process to run
- `backend/.env.production`: Production environment variables

### Troubleshooting

- Ensure all required environment variables are set
- Check Railway logs for any deployment or runtime errors
- Verify MongoDB connection and authentication

## Local Development

```bash
# Install dependencies
pnpm install:all

# Run frontend
pnpm start:frontend

# Run backend
pnpm start:backend
```

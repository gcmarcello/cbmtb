# Base image
FROM node:18-alpine AS build

## BUILD BACKEND

# Create app directory
WORKDIR /app/backend

# Copy the rest of the app
COPY ./backend .

# FRONTEND

WORKDIR /app/client

COPY ./client .

# Final image
FROM node:18-alpine

WORKDIR /app

# Copy the app files from the build stage
COPY --from=build /app/backend /app/backend
COPY --from=build /app/client/ /app/client/
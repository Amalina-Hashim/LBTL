# NEAR - Nature Experience & Activity Recommendation

## Overview

NEAR is a location-based nature exploration application that enables users to discover Singapore's natural wonders through interactive maps, community engagement, and gamified experiences. The application combines modern web technologies with Firebase integration to create an immersive platform for outdoor activities and nature appreciation.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom NEAR branding
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Map Integration**: Leaflet for interactive map functionality

### Backend Architecture
- **Server Framework**: Express.js with TypeScript
- **API Framework**: Hono for type-safe API routes
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Validation**: Zod for schema validation
- **Build Tool**: Vite for frontend bundling, esbuild for backend

### Authentication & Storage
- **Authentication**: Firebase Auth (anonymous authentication)
- **File Storage**: Firebase Storage for image uploads
- **Database**: Firestore for real-time data synchronization

## Key Components

### Database Schema
The application uses a structured schema with the following main entities:
- **Pins**: Location-based points of interest (trails, vendors, facilities)
- **Users**: User profiles with completion tracking
- **Posts**: Community-generated content with photos and captions
- **Ratings**: User reviews and ratings for locations
- **Analytics**: Usage tracking and metrics

### Core Features
1. **Interactive Map**: Location-based pin discovery with different categories
2. **Community Wall**: Social sharing of experiences and photos
3. **Admin Dashboard**: Content management and analytics
4. **QR Code Integration**: Location verification system
5. **Progress Tracking**: Gamified completion system

### UI Components
- Modern component library built on Radix UI primitives
- Responsive design with mobile-first approach
- Custom NEAR branding with green color scheme
- Toast notifications for user feedback
- Modal dialogs for detailed interactions

## Data Flow

1. **User Authentication**: Anonymous Firebase authentication on app initialization
2. **Location Discovery**: Users browse interactive map to find pins
3. **Pin Interaction**: QR code scanning for location verification
4. **Content Creation**: Photo uploads and reviews through Firebase Storage
5. **Community Engagement**: Real-time updates through Firestore
6. **Progress Tracking**: Completion status synchronized across devices

## External Dependencies

### Core Dependencies
- **Database**: Neon Database (PostgreSQL)
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage
- **Maps**: Leaflet with OneMap tiles (Singapore)

### Development Tools
- **TypeScript**: Type safety across the entire stack
- **Drizzle Kit**: Database migrations and schema management
- **Vite**: Development server and build tooling
- **ESBuild**: Fast backend compilation

## Deployment Strategy

### Build Process
1. Frontend built with Vite to `dist/public`
2. Backend compiled with ESBuild to `dist/index.js`
3. Database schema managed through Drizzle migrations
4. Environment variables for database and Firebase configuration

### Environment Configuration
- `DATABASE_URL`: PostgreSQL connection string
- Firebase configuration variables for authentication and storage
- Development/production environment detection

### Hosting Requirements
- Node.js runtime for Express server
- Static file serving for React frontend
- PostgreSQL database connection
- Firebase project configuration

## Changelog

Changelog:
- July 04, 2025. Initial setup
- July 04, 2025. Updated homepage images to feature Singapore's Jurong Lake Gardens and Singapore Botanic Gardens (NParks) instead of generic/foreign locations for better local relevance
- July 04, 2025. Fixed navigation structure and map integration, added proper error handling for missing Firebase configuration

## User Preferences

Preferred communication style: Simple, everyday language.
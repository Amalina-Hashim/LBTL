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
- July 04, 2025. Updated map system to automatically use OneMap API when available, with OpenStreetMap fallback for demo mode
- July 04, 2025. Implemented check-in data persistence system with edit/resubmit capabilities and completion state tracking
- July 04, 2025. Enhanced social sharing to create community posts when users share achievements
- July 04, 2025. Renamed all trail points to "Science Park Trail Challenge" format for better branding
- July 04, 2025. Added authentic Lights by the Lake event trail locations with projection mapping and special installations based on real NParks event data
- July 04, 2025. Updated facility pins with accurate Jurong Lake Gardens locations including North/South Carparks, Clusia Cove toilet, Forest Ramble toilet, Japanese Garden toilet, Entrance Pavilion, and Water Lily Pavilion. Made facility icons smaller (24x24px) for better map visibility
- July 04, 2025. Enhanced routing system to allow dual-mode functionality: users can plan walking routes AND explore pins normally after route creation. Added visual indicators, status guidance, and "New Route" button for seamless mode switching
- July 04, 2025. Added comprehensive lantern festival multimedia content including authentic Creative Commons videos, audio, and images from Pexels and other legitimate sources. Enhanced all Science Park Trail challenges with lantern festival themes, traditional Chinese New Year content, dragon dances, floating lanterns, and cultural educational materials
- July 04, 2025. Implemented complete community posting system with anonymous authentication - users can now share trail completions and vendor ratings to Community Wall without creating accounts. Trail completion celebration modal includes "Share to Community Wall" feature for achievement posts
- July 04, 2025. Added "Rate Event" functionality with dedicated button in header - users can now rate the overall Lights by the Lake event experience and have ratings automatically posted to Community Wall
- July 04, 2025. Optimized all modal sizes (EventRatingModal, TrailCompletionModal, PinDetailModal) to max-w-sm and max-h-[85vh] for better desktop viewing experience
- July 04, 2025. Fixed completion counter tracking system and ensured completed trail pins turn yellow on map with proper state synchronization between pins array and completedPins set
- July 04, 2025. Implemented proper community wall posting with validation for different post types: rating posts (no image, with star display) and achievement posts (with image, no stars). Added server-side validation for POST /api/posts endpoint
- July 04, 2025. Fixed community wall posting validation error where null imageUrl values were rejected by Zod schema. Updated frontend to only include imageUrl field when photos are present, ensuring proper schema validation for both photo and text-only posts
- July 04, 2025. Created comprehensive Completed Challenges page (/completed) with photo display and real-time timestamps. Made completion counter clickable to navigate to dedicated page showing all completed trail challenges as cards with completion photos, timestamps, and challenge details. Enhanced completion flow to save photo references and timestamps to localStorage for persistence
- July 04, 2025. Updated event dates from "Dec 15 - Jan 15, 2024" to "27 Sep - 12 Oct 2025" throughout the application
- July 04, 2025. Implemented dynamic participant numbers and ratings system based on actual app usage: participant count tracks trail challenge clicks, average rating calculates from event ratings submitted within the app. Added analytics tracking routes with localStorage fallback for persistent statistics across sessions
- July 04, 2025. Enhanced AdminDashboardPage with dynamic analytics tracking actual user activities: Total Visits (from trail visitors + completions), Photos Taken (from completion photos + community posts), Reviews Left (from event ratings + vendor reviews), Participants (trail challenge clicks). Dashboard auto-refreshes every 30 seconds to show real-time statistics

## User Preferences

Preferred communication style: Simple, everyday language.
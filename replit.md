# Learn It - Online Learning Platform

## Overview

Learn It is a comprehensive online learning platform built with a modern full-stack architecture. The application provides course management, live virtual classes, discussion forums, payment processing, and user progress tracking. It's designed as a scalable e-learning solution with a focus on interactive learning experiences.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a monorepo structure with clear separation between client and server code:

- **Frontend**: React-based SPA with Vite build system
- **Backend**: Express.js REST API server
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth integration with OpenID Connect
- **Payments**: Stripe integration for course purchases
- **Styling**: Tailwind CSS with shadcn/ui component library

## Key Components

### Frontend Architecture
- **React**: Main UI framework with TypeScript support
- **Vite**: Development server and build tool with HMR
- **TanStack Query**: Data fetching and state management
- **Wouter**: Lightweight client-side routing
- **shadcn/ui**: Pre-built component library with Radix UI primitives
- **Tailwind CSS**: Utility-first styling with custom design system

### Backend Architecture
- **Express.js**: Web server framework with middleware support
- **Drizzle ORM**: Type-safe database queries with PostgreSQL
- **Passport.js**: Authentication middleware with OpenID Connect
- **Session Management**: PostgreSQL-backed session storage
- **Error Handling**: Centralized error middleware

### Database Schema
- **Users**: Profile management with role-based access (learner, instructor, admin)
- **Courses**: Course metadata, pricing, and categorization
- **Lessons**: Individual course content with progress tracking
- **Enrollments**: User-course relationships with completion status
- **Live Classes**: Virtual classroom scheduling and management
- **Discussions**: Forum system with categories and replies
- **Payments**: Stripe integration for transactions

### Authentication System
- **Replit Auth**: Primary authentication provider using OpenID Connect
- **Session-based**: Server-side session management with PostgreSQL storage
- **Role Management**: User roles for access control (learner/instructor/admin)

## Data Flow

1. **User Authentication**: Replit Auth handles login/logout with session persistence
2. **Course Discovery**: Users browse courses with filtering and search capabilities
3. **Enrollment Process**: Stripe payment integration for course purchases
4. **Learning Experience**: Progress tracking through lessons with completion states
5. **Live Classes**: Real-time virtual classroom integration
6. **Community Features**: Discussion forums with threaded conversations

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection pooling
- **@stripe/stripe-js & @stripe/react-stripe-js**: Payment processing
- **@radix-ui/***: Accessible UI components
- **@tanstack/react-query**: Server state management
- **drizzle-orm**: Database ORM and migrations

### Development Tools
- **Vite**: Build tool with React plugin
- **TypeScript**: Type safety across the stack
- **Tailwind CSS**: Utility-first styling
- **ESBuild**: Server-side bundling for production

### Authentication
- **openid-client**: OpenID Connect integration
- **passport**: Authentication middleware
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store

## Deployment Strategy

### Development Environment
- **Vite Dev Server**: Hot module replacement for frontend development
- **Express Server**: Backend API with automatic restarts
- **Database**: PostgreSQL connection with environment-based configuration

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Database**: Drizzle migrations manage schema changes
- **Environment**: Production configuration via environment variables

### Key Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Session encryption key
- `STRIPE_SECRET_KEY`: Stripe API key for payments
- `REPL_ID`: Replit environment identifier
- `ISSUER_URL`: OpenID Connect issuer URL

The application is designed to run seamlessly in both development and production environments with minimal configuration changes.
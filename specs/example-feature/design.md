# User Authentication - Design

_NOTE: This is an example and does NOT reflect an actual design in this repository._

## Overview

This document outlines the technical design for the user authentication system, including architecture, data models, API interfaces, and implementation details.

## System Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client App    │    │   API Gateway   │    │  Auth Service   │
│  (Web/Mobile)   │◄──►│                 │◄──►│                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │  Load Balancer  │    │   User Database │
                       │                 │    │   (PostgreSQL)  │
                       └─────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │  Rate Limiter   │    │  Email Service  │
                       │    (Redis)      │    │                 │
                       └─────────────────┘    └─────────────────┘
```

### Component Responsibilities

#### Authentication Service
- Handle user registration and login
- Password hashing and verification
- JWT token generation and validation
- Session management
- Rate limiting enforcement

#### User Database
- Store user account information
- Maintain authentication logs
- Handle password reset tokens
- Store email verification status

#### Email Service
- Send verification emails
- Send password reset emails
- Handle email delivery status

## Data Models

### User Entity

```typescript
interface User {
  id: string;                    // UUID primary key
  email: string;                 // Unique, indexed
  passwordHash: string;          // bcrypt hash
  displayName: string;           // User's display name
  isEmailVerified: boolean;      // Email verification status
  role: UserRole;                // User role (enum)
  createdAt: Date;               // Account creation timestamp
  updatedAt: Date;               // Last update timestamp
  lastLoginAt: Date | null;      // Last successful login
  isActive: boolean;             // Account status
  failedLoginAttempts: number;   // Failed login counter
  lockedUntil: Date | null;      // Account lock expiration
}

enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator'
}
```

### Authentication Log

```typescript
interface AuthenticationLog {
  id: string;                    // UUID primary key
  userId: string | null;         // User ID (null for failed attempts)
  email: string;                 // Email used in attempt
  eventType: AuthEventType;      // Type of authentication event
  success: boolean;              // Whether attempt was successful
  ipAddress: string;             // Client IP address
  userAgent: string;             // Client user agent
  timestamp: Date;               // Event timestamp
  metadata: Record<string, any>; // Additional event data
}

enum AuthEventType {
  LOGIN = 'login',
  LOGOUT = 'logout',
  REGISTER = 'register',
  PASSWORD_RESET_REQUEST = 'password_reset_request',
  PASSWORD_RESET_COMPLETE = 'password_reset_complete',
  EMAIL_VERIFICATION = 'email_verification'
}
```

### Password Reset Token

```typescript
interface PasswordResetToken {
  id: string;                    // UUID primary key
  userId: string;                // Foreign key to User
  token: string;                 // Secure random token
  expiresAt: Date;               // Token expiration
  isUsed: boolean;               // Whether token has been used
  createdAt: Date;               // Token creation timestamp
}
```

### Email Verification Token

```typescript
interface EmailVerificationToken {
  id: string;                    // UUID primary key
  userId: string;                // Foreign key to User
  token: string;                 // Secure random token
  expiresAt: Date;               // Token expiration (24 hours)
  createdAt: Date;               // Token creation timestamp
}
```

## Database Schema

### PostgreSQL Tables

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  is_email_verified BOOLEAN DEFAULT FALSE,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE NULL,
  is_active BOOLEAN DEFAULT TRUE,
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE NULL
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_last_login_at ON users(last_login_at);

-- Authentication logs table
CREATE TABLE authentication_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  email VARCHAR(255) NOT NULL,
  event_type VARCHAR(30) NOT NULL,
  success BOOLEAN NOT NULL,
  ip_address INET NOT NULL,
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Indexes
CREATE INDEX idx_auth_logs_user_id ON authentication_logs(user_id);
CREATE INDEX idx_auth_logs_timestamp ON authentication_logs(timestamp);
CREATE INDEX idx_auth_logs_event_type ON authentication_logs(event_type);

-- Password reset tokens table
CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);

-- Email verification tokens table
CREATE TABLE email_verification_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_email_verification_tokens_user_id ON email_verification_tokens(user_id);
CREATE INDEX idx_email_verification_tokens_token ON email_verification_tokens(token);
```

## API Interfaces

### Authentication Endpoints

#### POST /api/auth/register

**Request:**
```typescript
interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
}
```

**Response:**
```typescript
interface RegisterResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      email: string;
      displayName: string;
      isEmailVerified: boolean;
    };
    message: string;
  };
}
```

#### POST /api/auth/login

**Request:**
```typescript
interface LoginRequest {
  email: string;
  password: string;
}
```

**Response:**
```typescript
interface LoginResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      email: string;
      displayName: string;
      role: string;
    };
    token: string;
    refreshToken: string;
    expiresAt: string;
  };
}
```

#### POST /api/auth/logout

**Headers:** `Authorization: Bearer <token>`

**Response:**
```typescript
interface LogoutResponse {
  success: boolean;
  data: {
    message: string;
  };
}
```

#### POST /api/auth/refresh

**Request:**
```typescript
interface RefreshRequest {
  refreshToken: string;
}
```

**Response:**
```typescript
interface RefreshResponse {
  success: boolean;
  data: {
    token: string;
    expiresAt: string;
  };
}
```

#### POST /api/auth/password-reset/request

**Request:**
```typescript
interface PasswordResetRequest {
  email: string;
}
```

**Response:**
```typescript
interface PasswordResetRequestResponse {
  success: boolean;
  data: {
    message: string;
  };
}
```

#### POST /api/auth/password-reset/complete

**Request:**
```typescript
interface PasswordResetCompleteRequest {
  token: string;
  newPassword: string;
}
```

**Response:**
```typescript
interface PasswordResetCompleteResponse {
  success: boolean;
  data: {
    message: string;
  };
}
```

#### GET /api/auth/verify-email/:token

**Response:**
```typescript
interface EmailVerificationResponse {
  success: boolean;
  data: {
    message: string;
  };
}
```

## Security Design

### Password Security

- **Hashing Algorithm**: bcrypt with cost factor 12
- **Salt**: Automatic per-password salt generation
- **Storage**: Never store plaintext passwords
- **Transmission**: Passwords only transmitted over HTTPS

### Token Security

- **JWT Structure**: Header + Payload + Signature
- **Signing Algorithm**: HS256 (HMAC with SHA-256)
- **Secret Key**: 256-bit randomly generated secret
- **Expiration**: Access tokens expire in 1 hour, refresh tokens in 7 days

**JWT Payload:**
```typescript
interface JWTPayload {
  sub: string;        // User ID
  email: string;      // User email
  role: string;       // User role
  iat: number;        // Issued at timestamp
  exp: number;        // Expiration timestamp
  jti: string;        // JWT ID for revocation
}
```

### Rate Limiting

- **Login attempts**: 5 attempts per minute per IP
- **Password reset**: 3 requests per hour per email
- **Registration**: 10 registrations per hour per IP
- **Email verification**: 5 requests per hour per user

### Account Security

- **Account lockout**: 3 failed attempts → 15 minute lockout
- **Progressive delays**: Increasing delays for repeated failures
- **IP tracking**: Monitor and log all authentication attempts
- **Suspicious activity**: Alert on unusual login patterns

## Performance Considerations

### Database Optimization

- **Connection pooling**: Maintain 10-50 concurrent connections
- **Query optimization**: Use prepared statements and proper indexes
- **Read replicas**: Consider read replicas for authentication logs
- **Caching**: Cache user session data in Redis

### Caching Strategy

```typescript
// User session cache (Redis)
interface CachedUserSession {
  userId: string;
  email: string;
  role: string;
  lastActivity: Date;
  ttl: number; // Time to live in seconds
}

// Rate limiting cache (Redis)
interface RateLimitingEntry {
  identifier: string; // IP or user ID
  attempts: number;
  windowStart: Date;
  ttl: number;
}
```

### Monitoring and Metrics

- **Authentication success/failure rates**
- **Average response times for auth endpoints**
- **Number of active sessions**
- **Rate limiting trigger frequency**
- **Database connection pool utilization**

## Error Handling

### Error Types

```typescript
enum AuthErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  RATE_LIMITED = 'RATE_LIMITED',
  USER_EXISTS = 'USER_EXISTS',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  WEAK_PASSWORD = 'WEAK_PASSWORD',
  INVALID_EMAIL = 'INVALID_EMAIL'
}
```

### Error Response Format

```typescript
interface AuthErrorResponse {
  success: false;
  error: {
    code: AuthErrorCode;
    message: string;
    details?: any;
  };
  meta: {
    timestamp: string;
    requestId: string;
  };
}
```

## Technology Stack

### Backend Technologies

- **Framework**: Node.js with Express.js
- **Database**: PostgreSQL 14+
- **Cache**: Redis 6+
- **Password Hashing**: bcrypt
- **JWT**: jsonwebtoken library
- **Validation**: Joi or Yup
- **Email**: Nodemailer with SMTP

### Development Tools

- **ORM**: Prisma or TypeORM
- **Testing**: Jest with Supertest
- **Linting**: ESLint with TypeScript
- **Type Checking**: TypeScript 4.8+
- **Documentation**: Swagger/OpenAPI

## Migration Strategy

### Database Migrations

1. Create new authentication tables
2. Migrate existing user data (if any)
3. Update application configuration
4. Deploy authentication service
5. Update client applications
6. Monitor and validate functionality

### Rollback Plan

- Maintain previous authentication system during transition
- Feature flags for gradual rollout
- Database backups before migration
- Quick rollback procedures documented

---

**Design Review Status:**
- Architecture Review: [ ]
- Security Review: [ ]
- Database Review: [ ]
- Performance Review: [ ]

**Document Version**: 1.0  
**Last Updated**: August 2, 2025  
**Next Review**: August 9, 2025

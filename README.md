# Full-Stack Delivery Application

A complete full-stack application with authentication, delivery preferences, and order management.

## Tech Stack

- **Frontend**: React 18, React Router, Axios, Vite
- **Backend**: Node.js, Express, PostgreSQL, JWT
- **Database**: PostgreSQL 15
- **Containerization**: Docker & Docker Compose

## Features

- ✅ User authentication with JWT
- ✅ Login with email/password validation
- ✅ Delivery preference selection (In-Store, Delivery, Curbside)
- ✅ Conditional form fields based on delivery type
- ✅ Future datetime validation
- ✅ Order summary with edit capability
- ✅ Persistent sessions with localStorage
- ✅ Full auth guards on protected routes
- ✅ PostgreSQL database with migrations
- ✅ Docker containerization
- ✅ Comprehensive error handling
- ✅ Backend and frontend tests

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Git

### Installation & Running

1. **Clone the repository**

```bash
git clone
cd delivery-app
```

2. **Start the application with Docker Compose**

```bash
docker-compose up --build
```

3. **Access the application**

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

4. **Login credentials**

- Email: `test@example.com`
- Password: `password123`

### Running Tests

**Backend tests:**

```bash
cd backend
npm install
cd ..
docker-compose up
```

**Frontend tests:**

```bash
cd frontend
npm install
npm test
docker build -t my-frontend .
docker run -p 5173:80 my-frontend
## Architecture & Design Choices

### Backend Architecture

- **Express.js**: Lightweight and flexible web framework
- **PostgreSQL**: Reliable relational database for data persistence
- **JWT Authentication**: Stateless authentication with token-based security
- **Joi Validation**: Schema-based validation for all API inputs
- **Modular Structure**: Separated routes, middleware, and database config

### Frontend Architecture

- **React with Hooks**: Modern functional components with state management
- **Context API**: Global authentication state management
- **React Router**: Client-side routing with protected routes
- **Axios**: HTTP client with interceptors for token management
- **localStorage**: Persist auth and form data across sessions

### Database Design

- **Users Table**: Stores user credentials with bcrypt-hashed passwords
- **Orders Table**: Stores delivery preferences with foreign key to users
- **Migrations**: SQL-based schema initialization with seed data

### Security Measures

- Password hashing with bcrypt (10 rounds)
- JWT tokens with 24-hour expiration
- Auth middleware protecting all order endpoints
- Input validation on all requests
- SQL injection prevention with parameterized queries

### Validation Rules

- Email: Must be valid format
- Password: Minimum 6 characters
- Delivery Type: Must be IN_STORE, DELIVERY, or CURBSIDE
- Delivery Address: Required only for DELIVERY type
- Pickup Location: Required for IN_STORE and CURBSIDE
- Delivery Time: Must be future datetime
- Auth Token: Required for all protected routes

## API Endpoints

### Authentication

- `POST /auth/login` - Login with email and password
- `POST /auth/singup` - sign up with email and password
- `GET /auth/me` - Get current user (protected)

### Orders

- `POST /orders` - Create new order (protected)
- `GET /orders/:id` - Get order by ID (protected)
- `PUT /orders/:id` - Update order (protected)

## Project Structure

```

├── backend/
│ ├── src/
│ │ ├── config/ # Database configuration
│ │ ├── middleware/ # Auth middleware
│ │ ├── routes/ # API routes
│ │ └── server.js # Express app setup
│ ├── migrations/ # SQL migrations
│ ├── tests/ # Backend tests
│ └── Dockerfile
├── frontend/
│ ├── src/
│ │ ├── components/ # React components
│ │ ├── context/ # Auth context
│ │ ├── utils/ # API utilities
│ │ └── App.jsx
│ ├── Dockerfile
│ └── nginx.conf
└── docker-compose.yml

````

## Future Improvements

1. **AI Enhancements**

   - AI-powered form auto-fill based on user history
   - Intelligent delivery time suggestions
   - Natural language processing for special instructions
   - AI-generated delivery route optimization

2. **Testing**

   - Increase test coverage to >80%
   - Add E2E tests with Cypress/Playwright
   - Integration tests for database operations
   - Performance testing with load tests

3. **Features**

   - Order history view
   - Real-time order tracking
   - Push notifications for order updates
   - Multiple delivery addresses per user
   - Recurring orders
   - Payment integration

4. **Performance**

   - Redis caching for frequently accessed data
   - Database query optimization with indexes
   - Frontend code splitting and lazy loading
   - CDN for static assets
   - Image optimization

5. **Security**

   - Refresh token rotation
   - Rate limiting on API endpoints
   - HTTPS enforcement
   - CORS configuration for production
   - Security headers (Helmet.js)
   - Two-factor authentication

6. **DevOps**

   - CI/CD pipeline (GitHub Actions)
   - Kubernetes deployment
   - Monitoring and logging (Prometheus, Grafana)
   - Automated backups
   - Blue-green deployment strategy

7. **UX Improvements**
   - Mobile-responsive design enhancement
   - Dark mode support
   - Loading skeletons
   - Toast notifications
   - Form auto-save drafts
   - Accessibility improvements (WCAG 2.1)

## Environment Variables

### Backend (.env)

```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/delivery_db
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=5000
NODE_ENV=production
````

### Frontend

```env
VITE_API_URL=http://localhost:5000
```

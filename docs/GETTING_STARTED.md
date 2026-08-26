# Getting Started Guide

## 1. Project Goal

Build a **fully functional, production-ready Learning Management System (LMS)**.

This is **NOT a demo website**.

The application must not depend on fake/demo accounts, mock functionality, hard-coded dashboard data, fake enrollments, placeholder transactions, or non-functional buttons.

Every feature shown in the interface must be connected to real application logic, database operations, authentication, authorization, or a clearly implemented production-ready integration.

---

## 2. Recommended Stack & Prerequisites

- **Framework**: Next.js (App Router, TypeScript)
- **Styling**: Tailwind CSS, shadcn/ui
- **Database / ORM**: PostgreSQL / Supabase / Prisma
- **Authentication**: Role-based authentication (Admin, Instructor, Student)
- **Media & Storage**: Cloudinary / Mux / Storage buckets
- **Email / Webhooks**: Resend / Svix
- **Deployment**: Vercel

---

## 3. Development Process

Build the application in phases.

### Phase 1 — Project Setup
- Initialize project
- Configure TypeScript
- Configure styling
- Configure database & ORM
- Configure environment variables
- Establish folder architecture

### Phase 2 — Database
- Design schema
- Create tables
- Create relationships
- Add indexes
- Add RLS policies
- Add seed/development data only where necessary

### Phase 3 — Authentication
- Registration
- Login
- Logout
- Password reset
- Session handling
- Profiles
- Roles

### Phase 4 — Role-Based Panels
Build separately:
- Admin Panel (`/admin`)
- Instructor Panel (`/instructor`)
- Student Panel (`/student`)

*Do not merge them.*

### Phase 5 — Public Course System
- Course listing
- Search
- Filters
- Course details
- Public curriculum outline

### Phase 6 — Enrollment & Access Control
- Enrollment
- Authorization
- Protected lessons
- Protected resources
- Student course access

### Phase 7 — Learning System
- Video lessons
- Lesson completion
- Progress
- Quizzes
- Assignments

### Phase 8 — Certificates
- Completion validation
- Certificate generation
- Certificate records

### Phase 9 — Admin & Instructor Management
- Course management
- User management
- Analytics
- Content management

### Phase 10 — Payment
- Implement payment integration if required by the PRD.

### Phase 11 — Security Testing
- Test unauthorized access, direct URLs, API/server actions, RLS, and role boundaries.

### Phase 12 — Production Deployment
- Production environment variables
- Production database configuration
- Vercel deployment
- Domain configuration
- Error monitoring
- Final testing

---

## 4. Testing Checklist

Before declaring the project complete, test all of the following:

### Visitor
- [ ] Can browse website
- [ ] Can browse courses
- [ ] Can view course details
- [ ] Can view course outline
- [ ] Cannot watch protected lesson
- [ ] Cannot access protected lesson text
- [ ] Cannot take quiz
- [ ] Cannot submit assignment
- [ ] Cannot download protected files

### Student
- [ ] Can register/login
- [ ] Goes to Student Panel
- [ ] Can browse courses
- [ ] Can enroll
- [ ] Can access enrolled course
- [ ] Cannot access un-enrolled course content
- [ ] Can complete lessons
- [ ] Can take authorized quizzes
- [ ] Can submit assignments
- [ ] Progress is stored
- [ ] Can receive certificate after completion
- [ ] Cannot access Admin Panel
- [ ] Cannot access Instructor Panel

### Instructor
- [ ] Goes to Instructor Panel
- [ ] Can create course
- [ ] Can edit own course
- [ ] Can manage curriculum
- [ ] Can manage lessons
- [ ] Can manage quizzes
- [ ] Can manage assignments
- [ ] Can view own students
- [ ] Can view progress
- [ ] Cannot access Admin Panel
- [ ] Cannot modify another instructor's course

### Admin
- [ ] Goes to Admin Panel
- [ ] Can manage users
- [ ] Can manage roles
- [ ] Can manage instructors
- [ ] Can manage courses
- [ ] Can manage enrollments
- [ ] Can manage platform settings
- [ ] Can view analytics

### Security
- [ ] Direct URL access is protected
- [ ] Server-side role checks work
- [ ] Enrollment checks work
- [ ] RLS policies work
- [ ] Protected files are actually protected
- [ ] Secrets are not exposed
- [ ] Unauthorized API/server actions are rejected

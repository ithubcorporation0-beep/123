# EduFlow LMS — Production-Ready Learning Management System

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.4-teal)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8)](https://tailwindcss.com/)

EduFlow is a modern, full-stack Learning Management System (LMS) built with Next.js 16 App Router, TypeScript, Tailwind CSS v4, Prisma ORM, Supabase PostgreSQL, Clerk Authentication, Cloudinary image hosting, and Mux video streaming.

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/ithubcorporation0-beep/123.git

# Navigate into the project
cd 123

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Run Prisma schema migration & generate client
npx prisma db push
npx prisma generate

# Start the development server
npm run dev
```

---

## 1. Project Goal

Build a **fully functional, production-ready Learning Management System (LMS)**.

This is **NOT a demo website**.

The application must not depend on fake/demo accounts, mock functionality, hard-coded dashboard data, fake enrollments, placeholder transactions, or non-functional buttons.

Every feature shown in the interface must be connected to real application logic, database operations, authentication, authorization, or a clearly implemented production-ready integration.

### Recommended stack

- Next.js
- TypeScript
- Tailwind CSS
- Supabase / PostgreSQL
- Supabase Authentication
- Supabase Storage where required
- Vercel deployment
- Server-side authorization
- Database Row Level Security (RLS)

Use the existing project stack if one is already established, but preserve all requirements in this specification.

---

# 2. Core Architecture

The LMS must have three completely separate user experiences:

1. **Admin Panel**
2. **Instructor/Teacher Panel**
3. **Student Panel**

Do NOT create one shared dashboard containing features for all three roles.

Each role must have:

- Separate dashboard
- Separate navigation
- Separate routes
- Separate permissions
- Separate protected pages
- Role-specific actions
- Role-specific data visibility

A user must only be able to access the panel allowed by their role.

---

# 3. User Roles

The system must support at minimum:

```text
admin
instructor
student
```

The user's role must be stored in the database and checked securely on the server.

Do not trust a role supplied by the client/browser.

---

# 4. Authentication

Implement real authentication.

Required functionality:

- Sign up
- Sign in
- Sign out
- Forgot password
- Reset password
- Session persistence
- Protected routes
- Role-based redirects
- User profile
- Secure password handling
- Email verification if enabled by the authentication provider

After login:

```text
admin      → /admin
instructor → /instructor
student    → /student
```

Never redirect every user to a common `/dashboard`.

---

# 5. Admin Panel

Route:

```text
/admin
```

Only users with the `admin` role can access this panel.

### Admin navigation

- Dashboard
- Users
- Students
- Instructors
- Courses
- Categories
- Curriculum
- Lessons
- Quizzes
- Assignments
- Enrollments
- Payments / Orders
- Certificates
- Reviews
- Notifications
- Reports / Analytics
- Website Content
- Settings
- Admin Profile

### Admin capabilities

Admin can:

- Create users
- Edit users
- Disable users
- Assign roles
- Manage students
- Manage instructors
- Create courses
- Edit courses
- Publish/unpublish courses
- Delete/archive courses
- Manage categories
- Manage modules
- Manage lessons
- Manage quizzes
- Manage assignments
- Manage enrollments
- Manage certificates
- View analytics
- Manage website settings

Admin functionality must not appear in Student or Instructor panels.

---

# 6. Instructor / Teacher Panel

Route:

```text
/instructor
```

Only users with the `instructor` role can access it.

### Instructor navigation

- Dashboard
- My Courses
- Create Course
- Course Curriculum
- Modules
- Lessons
- Videos
- Quizzes
- Assignments
- Students
- Student Progress
- Course Analytics
- Reviews
- Notifications
- Profile
- Settings

### Instructor capabilities

An instructor can:

- Create courses
- Edit their courses
- Create modules
- Create lessons
- Upload/manage course videos
- Create quizzes
- Create assignments
- View enrolled students
- View student progress
- View course analytics
- Manage their own course content

An instructor must NOT:

- Access Admin Panel
- Manage system settings
- Change another instructor's courses
- Change user roles
- Manage platform-wide users unless explicitly authorized by Admin

All ownership checks must be enforced server-side and through database policies.

---

# 7. Student Panel

Route:

```text
/student
```

Only users with the `student` role can access it.

### Student navigation

- Dashboard
- My Courses
- Continue Learning
- Progress
- Quizzes
- Assignments
- Certificates
- Wishlist
- Notifications
- Profile
- Settings

### Student capabilities

Students can:

- Browse courses
- View course details
- Enroll in courses
- Access enrolled courses
- Watch authorized lessons
- Complete lessons
- Take quizzes
- Submit assignments
- Track progress
- Receive certificates after completion
- Manage their profile

Students must NOT:

- Access Admin Panel
- Access Instructor Panel
- Create courses
- Edit courses
- Change course content
- Change roles
- View another student's private data

---

# 8. Public Website

The public website must remain accessible without login.

Recommended public pages:

```text
/
 /about
 /courses
 /courses/[course-slug]
 /instructors
 /pricing
 /contact
 /faq
 /login
 /register
 /forgot-password
```

Visitors should be able to browse the LMS before creating an account.

---

# 9. Course Details vs Full Course Access

This is a critical requirement.

A visitor who is **not logged in** may view the public course details page, but must NOT receive complete course access.

Example:

```text
/courses/web-development
```

The public course page may show:

- Course title
- Course thumbnail
- Instructor
- Course description
- Learning objectives
- What students will learn
- Duration
- Difficulty level
- Number of modules
- Number of lessons
- Course price
- Reviews
- Course curriculum outline
- Module names
- Lesson titles
- Enrollment button

However, it must NOT expose protected course content.

---

# 10. Protected Course Content

Logged-out visitors must NOT be able to:

- Watch protected course videos
- Read full protected lesson content
- Take quizzes
- Submit assignments
- Download protected files
- Access private resources
- View answers
- Track course progress

For a protected lesson, show something like:

```text
🔒 This lesson is available after enrollment.

Login to continue or enroll in this course.

[Login] [Enroll Now]
```

Do not simply hide the lesson content with frontend CSS.

The content itself must be protected.

---

# 11. Course Enrollment

A logged-in student must not automatically have access to every course.

Access must be based on enrollment.

Example:

```text
Student
   ↓
Course Details
   ↓
Enroll
   ↓
Payment / Enrollment Confirmation
   ↓
Active Enrollment
   ↓
Full Course Access
```

Only an active enrollment for the specific course should unlock the protected content.

---

# 12. Authorization Rules

Implement authorization at multiple levels:

### Frontend

Use the correct UI and navigation for each role.

### Middleware / Route Protection

Protect role-specific routes.

### Server-side authorization

Every protected server action/API must verify:

- User is authenticated
- User role is correct
- User owns the resource where applicable
- User has an active enrollment where required

### Database

Use PostgreSQL/Supabase Row Level Security (RLS).

Never rely only on frontend checks.

---

# 13. Direct URL Protection

A user must not bypass authorization by manually entering a URL.

For example:

```text
/courses/web-development/lesson/1
```

If the visitor is not authorized, the server must deny access.

Similarly:

```text
/admin
/instructor
/student
```

must each enforce the correct role.

Frontend route hiding is NOT sufficient.

---

# 14. Course Curriculum

Courses should support a structure similar to:

```text
Course
 ├── Module 1
 │    ├── Lesson 1
 │    ├── Lesson 2
 │    └── Quiz
 │
 ├── Module 2
 │    ├── Lesson 3
 │    ├── Lesson 4
 │    └── Assignment
 │
 └── Module 3
      ├── Lesson 5
      └── Final Quiz
```

Each lesson should support appropriate content types such as:

- Video
- Text
- PDF/resource
- Quiz
- Assignment

The instructor should be able to manage the curriculum from the Instructor Panel.

---

# 15. Progress Tracking

For enrolled students, track:

- Course progress
- Completed lessons
- Current lesson
- Quiz scores
- Assignment status
- Completion percentage
- Course completion date

Do not use hard-coded progress values.

Store progress in the database.

---

# 16. Quiz System

Implement a real quiz system.

Support:

- Quiz creation
- Questions
- Multiple-choice answers
- Correct answer
- Points
- Passing score
- Attempt tracking
- Score calculation
- Quiz results
- Student quiz history

Instructor can create/manage quizzes for their courses.

Students can only take quizzes for courses they are authorized to access.

---

# 17. Assignment System

If assignments are included:

- Instructor creates assignment
- Student sees assignment
- Student submits assignment
- Submission is stored
- Instructor can review submission
- Instructor can provide score/feedback
- Student can view result

Protect assignment data using authorization rules.

---

# 18. Certificate System

When a student successfully completes a course:

- Generate/store certificate record
- Associate certificate with student
- Associate certificate with course
- Store completion date
- Provide certificate viewing/download functionality

Certificates must be based on real completion data.

Do not create fake certificates.

---

# 19. Database

Use a real relational database.

Recommended:

```text
Supabase PostgreSQL
```

Design normalized tables for areas such as:

```text
profiles
roles
courses
course_categories
course_modules
lessons
lesson_resources
enrollments
lesson_progress
quizzes
quiz_questions
quiz_options
quiz_attempts
assignments
assignment_submissions
certificates
reviews
notifications
payments
orders
```

Adapt the schema to the existing PRD and application requirements.

Use foreign keys, indexes, timestamps, status fields, and appropriate constraints.

---

# 20. Security

Security is mandatory.

Implement:

- Authentication
- Authorization
- Server-side role checks
- Enrollment checks
- Ownership checks
- RLS policies
- Input validation
- Secure file access
- Protected API/server actions
- Environment variables for secrets
- No service-role keys exposed to the browser
- No passwords stored manually
- No sensitive information in client-side code

---

# 21. No Demo Data

Do not use:

```text
demo@example.com
admin@test.com
student@test.com
teacher@test.com
```

unless these are explicitly created as real development seed accounts and clearly separated from production.

Do not pretend fake data is real.

Dashboard statistics must come from the database.

---

# 22. No Fake Functionality

Every button must work.

Do not create:

```text
<button>Coming Soon</button>
```

for required functionality.

Do not create fake:

- Enrollments
- Payments
- Quiz scores
- Certificates
- Progress
- Course statistics
- User counts
- Notifications

Forms must validate and save real data.

---

# 23. Payment Architecture

If paid courses are required by the PRD:

Implement a production-ready payment architecture.

Requirements:

- Checkout
- Order creation
- Payment status
- Secure webhook
- Enrollment activation after confirmed payment
- Failed payment handling
- Payment history

Payment credentials must be stored in environment variables.

Never hard-code secret keys.

If a payment provider is not yet configured, build the integration boundary cleanly and document exactly which environment variables and webhook settings are required.

---

# 24. UI / UX

The application should feel like a professional commercial LMS.

Requirements:

- Modern design
- Responsive
- Mobile friendly
- Tablet friendly
- Desktop optimized
- Consistent design system
- Accessible forms
- Good typography
- Clear navigation
- Loading states
- Empty states
- Error states
- Success states
- Confirmation dialogs
- Toast notifications where appropriate

Each role should visually feel like its own workspace.

---

# 25. Dashboard Requirements

### Admin Dashboard

Show real database statistics such as:

- Total users
- Total students
- Total instructors
- Total courses
- Total enrollments
- Revenue if applicable
- Recent enrollments
- Recent users
- Course performance

### Instructor Dashboard

Show only instructor-related statistics:

- My courses
- Total students
- Total enrollments
- Course completion
- Quiz performance
- Recent activity

### Student Dashboard

Show only student-related information:

- Enrolled courses
- Course progress
- Continue learning
- Recent activity
- Quiz results
- Certificates

Never mix role-specific statistics.

---

# 26. Routing Structure

Use a clear structure similar to:

```text
/app
  /(public)
    /courses
    /courses/[slug]

  /admin
    /dashboard
    /users
    /courses
    /settings

  /instructor
    /dashboard
    /courses
    /courses/create
    /courses/[id]
    /students
    /analytics

  /student
    /dashboard
    /courses
    /courses/[id]
    /learn/[courseId]/[lessonId]
    /certificates

  /login
  /register
```

The exact structure can be adapted to the framework, but the separation must remain.

---

# 27. Role-Based Redirect Logic

After authentication:

```text
IF role = admin
    → /admin

IF role = instructor
    → /instructor

IF role = student
    → /student
```

Never send all users to:

```text
/dashboard
```

If a user attempts to open another role's panel:

```text
/admin       as student
/instructor  as student
/student     as admin
```

deny access and redirect to their own authorized panel or an appropriate unauthorized page.

---

# 28. Logged-Out Course Flow

Expected behavior:

```text
Visitor
  ↓
Browse Courses
  ↓
Course Details
  ↓
View Course Outline
  ↓
Click Lesson
  ↓
Login / Enrollment Required
```

The visitor should be able to understand what the course offers without receiving the actual paid/protected content.

---

# 29. Logged-In Student Flow

Expected behavior:

```text
Login
  ↓
Student Panel
  ↓
Browse Course
  ↓
Course Details
  ↓
Enroll
  ↓
Active Enrollment
  ↓
Start Course
  ↓
Lesson
  ↓
Progress Tracking
  ↓
Quiz / Assignment
  ↓
Course Completion
  ↓
Certificate
```

---

# 30. Instructor Flow

Expected behavior:

```text
Login
  ↓
Instructor Panel
  ↓
Create Course
  ↓
Add Modules
  ↓
Add Lessons
  ↓
Add Videos/Resources
  ↓
Add Quiz/Assignment
  ↓
Publish Course
  ↓
Students Enroll
  ↓
Monitor Student Progress
```

---

# 31. Admin Flow

Expected behavior:

```text
Login
  ↓
Admin Panel
  ↓
Manage Users
  ↓
Manage Instructors
  ↓
Manage Courses
  ↓
Manage Enrollments
  ↓
Manage Platform
  ↓
View Analytics
```

---

# 32. Development Process

Build the application in phases.

## Phase 1 — Project Setup

- Initialize project
- Configure TypeScript
- Configure styling
- Configure Supabase
- Configure environment variables
- Establish folder architecture

## Phase 2 — Database

- Design schema
- Create tables
- Create relationships
- Add indexes
- Add RLS policies
- Add seed/development data only where necessary

## Phase 3 — Authentication

- Registration
- Login
- Logout
- Password reset
- Session handling
- Profiles
- Roles

## Phase 4 — Role-Based Panels

Build separately:

```text
Admin Panel
Instructor Panel
Student Panel
```

Do not merge them.

## Phase 5 — Public Course System

- Course listing
- Search
- Filters
- Course details
- Public curriculum outline

## Phase 6 — Enrollment & Access Control

- Enrollment
- Authorization
- Protected lessons
- Protected resources
- Student course access

## Phase 7 — Learning System

- Video lessons
- Lesson completion
- Progress
- Quizzes
- Assignments

## Phase 8 — Certificates

- Completion validation
- Certificate generation
- Certificate records

## Phase 9 — Admin & Instructor Management

- Course management
- User management
- Analytics
- Content management

## Phase 10 — Payment

Implement payment integration if required by the PRD.

## Phase 11 — Security Testing

Test unauthorized access, direct URLs, API/server actions, RLS, and role boundaries.

## Phase 12 — Production Deployment

- Production environment variables
- Supabase production configuration
- Vercel deployment
- Domain configuration
- Error monitoring
- Final testing

---

# 33. Testing Checklist

Before declaring the project complete, test all of the following.

## Visitor

- [ ] Can browse website
- [ ] Can browse courses
- [ ] Can view course details
- [ ] Can view course outline
- [ ] Cannot watch protected lesson
- [ ] Cannot access protected lesson text
- [ ] Cannot take quiz
- [ ] Cannot submit assignment
- [ ] Cannot download protected files

## Student

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

## Instructor

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

## Admin

- [ ] Goes to Admin Panel
- [ ] Can manage users
- [ ] Can manage roles
- [ ] Can manage instructors
- [ ] Can manage courses
- [ ] Can manage enrollments
- [ ] Can manage platform settings
- [ ] Can view analytics

## Security

- [ ] Direct URL access is protected
- [ ] Server-side role checks work
- [ ] Enrollment checks work
- [ ] RLS policies work
- [ ] Protected files are actually protected
- [ ] Secrets are not exposed
- [ ] Unauthorized API/server actions are rejected

---

# 34. Final Non-Negotiable Rules

These rules must always be followed:

1. **This is a real LMS, not a demo.**
2. **Admin, Instructor, and Student must have separate panels.**
3. **Never create one common dashboard for all roles.**
4. **Role permissions must be enforced server-side.**
5. **A logged-out visitor can see course details and outline, but not full course content.**
6. **A student must have an active enrollment before accessing protected course content.**
7. **Do not rely on frontend hiding for security.**
8. **Use database/RLS authorization.**
9. **Do not use fake dashboard statistics.**
10. **Do not use fake/demo accounts as the application's normal authentication flow.**
11. **Every required button and form must actually work.**
12. **Every protected URL must perform an authorization check.**
13. **Students cannot access Instructor/Admin features.**
14. **Instructors cannot access Admin features.**
15. **Only Admin can perform platform-wide administrative actions.**
16. **The application must be responsive and production-ready.**
17. **Do not mark the project complete until the complete user flows have been tested.**

---

# 35. Definition of Done

The LMS is considered complete only when:

```text
Public Website
      ↓
Authentication
      ↓
Role Detection
      ↓
 ┌───────────────┬──────────────────┬───────────────┐
 │     ADMIN     │    INSTRUCTOR    │    STUDENT    │
 │    /admin     │   /instructor    │   /student    │
 └───────────────┴──────────────────┴───────────────┘
                         ↓
                  Course Discovery
                         ↓
                   Course Details
                         ↓
                  Course Curriculum
                         ↓
                 Enrollment Required
                         ↓
                  Protected Learning
                         ↓
              Progress / Quiz / Assignment
                         ↓
                    Completion
                         ↓
                    Certificate
```

The final product must behave as a real LMS with real authentication, real database records, real authorization, real course access control, and separate role-based panels.

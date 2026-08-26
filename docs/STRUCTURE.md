# Application Architecture & Routing Structure

## 1. Core Architecture

The LMS must have three completely separate user experiences:

1. **Admin Panel**
2. **Instructor/Teacher Panel**
3. **Student Panel**

**Do NOT create one shared dashboard containing features for all three roles.**

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

## 2. Panels & Navigations

### Admin Panel (`/admin`)
Only users with the `admin` role can access this panel.

**Admin Navigation:**
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

### Instructor Panel (`/instructor`)
Only users with the `instructor` role can access it.

**Instructor Navigation:**
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

### Student Panel (`/student`)
Only users with the `student` role can access it.

**Student Navigation:**
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

---

## 3. Public Website & Course Details

The public website must remain accessible without login:
- `/`
- `/about`
- `/courses`
- `/courses/[course-slug]`
- `/instructors`
- `/pricing`
- `/contact`
- `/faq`
- `/login`
- `/register`
- `/forgot-password`

### Course Details vs Full Course Access
A visitor who is not logged in may view the public course details page, but must NOT receive complete course access.

**Public Course Page Shows:**
- Course title
- Course thumbnail
- Instructor
- Course description
- Learning objectives / What students will learn
- Duration, difficulty level
- Number of modules & lessons
- Course price & reviews
- Course curriculum outline (module names & lesson titles)
- Enrollment button

### Protected Course Content
Logged-out visitors must NOT be able to:
- Watch protected course videos
- Read full protected lesson content
- Take quizzes
- Submit assignments
- Download protected files
- Access private resources
- View answers
- Track course progress

---

## 4. Routing Structure

```text
/app
  /(public)
    /
    /courses
    /courses/[slug]
    /about
    /pricing
    /contact
    /login
    /register

  /admin
    /dashboard
    /users
    /students
    /instructors
    /courses
    /categories
    /enrollments
    /payments
    /certificates
    /analytics
    /settings

  /instructor
    /dashboard
    /courses
    /courses/create
    /courses/[id]
    /courses/[id]/curriculum
    /students
    /analytics
    /reviews
    /settings

  /student
    /dashboard
    /courses
    /courses/[id]
    /learn/[courseId]/[lessonId]
    /quizzes
    /assignments
    /certificates
    /wishlist
    /settings
```

---

## 5. User Flows

### Logged-Out Course Flow
```text
Visitor -> Browse Courses -> Course Details -> View Course Outline -> Click Lesson -> Login / Enrollment Required
```

### Logged-In Student Flow
```text
Login -> Student Panel -> Browse Course -> Course Details -> Enroll -> Active Enrollment -> Start Course -> Lesson -> Progress Tracking -> Quiz / Assignment -> Course Completion -> Certificate
```

### Instructor Flow
```text
Login -> Instructor Panel -> Create Course -> Add Modules -> Add Lessons -> Add Videos/Resources -> Add Quiz/Assignment -> Publish Course -> Students Enroll -> Monitor Student Progress
```

### Admin Flow
```text
Login -> Admin Panel -> Manage Users -> Manage Instructors -> Manage Courses -> Manage Enrollments -> Manage Platform -> View Analytics
```

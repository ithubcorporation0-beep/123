# Contributing & Development Standards

## 1. Final Non-Negotiable Rules

These rules must always be followed in every pull request and feature implementation:

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

## 2. No Demo Data & No Fake Functionality

### No Demo Data
Do not use:
- `demo@example.com`
- `admin@test.com`
- `student@test.com`
- `teacher@test.com`

unless these are explicitly created as real development seed accounts and clearly separated from production. Do not pretend fake data is real. Dashboard statistics must come from the database.

### No Fake Functionality
Every button must work. Do not create:
```tsx
<button>Coming Soon</button>
```
for required functionality. Do not create fake enrollments, payments, quiz scores, certificates, progress, course statistics, user counts, or notifications. Forms must validate and save real data.

---

## 3. Definition of Done

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

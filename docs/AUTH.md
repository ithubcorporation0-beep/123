# Authentication & Authorization Architecture

## 1. Real Authentication

The LMS implements real authentication with the following capabilities:
- Sign up
- Sign in
- Sign out
- Forgot password & Reset password
- Session persistence
- Protected routes
- Role-based redirects
- User profile management
- Secure password handling
- Email verification where enabled

---

## 2. User Roles

The system strictly supports at minimum:
- `admin`
- `instructor`
- `student`

### Security Rules:
- The user's role must be stored in the database and verified securely on the server.
- **Do not trust a role supplied by the client/browser.**
- Server-side role checks and database policies must validate every sensitive action.

---

## 3. Role-Based Redirect Logic

After authentication:

```text
IF role = admin
    -> redirect to /admin

IF role = instructor
    -> redirect to /instructor

IF role = student
    -> redirect to /student
```

**Never send all users to a generic `/dashboard`.**

### Panel Protection & Unauthorized Access
If a user attempts to open another role's panel (e.g., student accessing `/admin` or `/instructor`), the server must deny access and redirect to their authorized panel or an appropriate unauthorized page.

---

## 4. Multi-Level Authorization Rules

Authorization must be implemented at all levels:

1. **Frontend / Navigation**: Render only the navigation and controls permitted for the active role.
2. **Middleware / Route Protection**: Protect role-specific routes and redirect unauthorized sessions.
3. **Server-Side Authorization**: Every protected Server Action or Route Handler must verify:
   - User is authenticated
   - User role is correct
   - User owns the resource (e.g. instructor managing their own course)
   - User has an active enrollment (e.g. student accessing protected lessons)
4. **Database / RLS**: Row Level Security (RLS) policies enforce security directly at the data layer.

---

## 5. Direct URL Protection

A user must not bypass authorization by typing a direct URL:
- Example: `/courses/web-development/lesson/1`
- If the visitor is not logged in or lacks an active enrollment, the server must deny access to the lesson content.
- Frontend CSS hiding is **never** used as a security mechanism.

# Troubleshooting & Common Issues

## 1. Authentication & Role Redirection

### Problem: User redirected to incorrect panel or infinite redirect loop
- **Check**: Verify the user's role in the database profile table.
- **Check**: Ensure middleware properly handles public vs protected route prefixes and avoids redirecting authenticated users repeatedly.

---

## 2. Direct URL & Protected Lesson Access

### Problem: Non-enrolled users able to view lesson content
- **Fix**: Verify server action / data fetcher checks `Enrollment` model for `profileId` + `courseId` before returning lesson video or text.
- **Rule**: Never hide protected content using CSS `display: none` or client-only flags.

---

## 3. Database & Prisma Connection Issues

### Problem: `PrismaClientInitializationError: Can't reach database server`
- **Check**: Confirm `DATABASE_URL` is accurate and reachable from your IP/environment.
- **Check**: If using PgBouncer or connection pools on Supabase/Neon, ensure `?sslmode=require&pgbouncer=true` is set.
- **Check**: Run `npx prisma generate` to ensure client types are in sync with your schema.

---

## 4. Webhook Signature Verification Failures

### Problem: Svix / Clerk webhook returning 400 Bad Request
- **Check**: Ensure the raw body is passed to Svix `Webhook.verify()` without JSON mutation.
- **Check**: Verify `CLERK_WEBHOOK_SECRET` matches the endpoint configured in the Clerk dashboard.

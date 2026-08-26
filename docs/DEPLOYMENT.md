# Production Deployment Guide

## 1. Pre-Deployment Checklist

Before deploying to production (e.g. Vercel), ensure:

- [ ] All environment variables are set in the deployment dashboard.
- [ ] Database migrations are executed (`prisma migrate deploy`).
- [ ] Production database connection pooling is configured (`DATABASE_URL` with pgbouncer/pooling, `DIRECT_URL` for direct migrations).
- [ ] Webhook secrets (Clerk, Mux, Stripe/Payment) are configured in provider portals to point to the production domain.
- [ ] No service-role or secret keys are exposed to client-side code (`NEXT_PUBLIC_` prefix only for public keys).

---

## 2. Vercel Deployment

1. **Link Repository**: Import the repository into Vercel.
2. **Build Settings**:
   - Framework Preset: Next.js
   - Build Command: `prisma generate && next build`
   - Output Directory: `.next`
3. **Environment Variables**: Add all variables defined in [ENVIRONMENT.md](file:///d:/1/docs/ENVIRONMENT.md).
4. **Deploy**: Trigger production deployment.
5. **Post-Deployment Verification**:
   - Test sign up and role redirection (`/admin`, `/instructor`, `/student`).
   - Test public course listing and outline.
   - Verify protected lesson security.

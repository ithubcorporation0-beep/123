# Environment Variables & Configuration

## 1. Security & Credentials Overview

Security is mandatory.

- Environment variables for secrets
- No service-role keys exposed to the browser
- No passwords stored manually
- No sensitive information in client-side code
- Payment credentials must be stored in environment variables. Never hard-code secret keys.
- If a payment provider is not yet configured, build the integration boundary cleanly and document exactly which environment variables and webhook settings are required.

---

## 2. Required Environment Variables

Create a `.env.local` file at the root of your project:

```env
# ==========================================
# Next.js Application
# ==========================================
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# ==========================================
# Database / ORM
# ==========================================
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
DIRECT_URL="postgresql://user:password@host:port/database"

# ==========================================
# Authentication (Clerk / Supabase Auth)
# ==========================================
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/login"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/register"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"

# Clerk Webhook Signing Secret (Svix)
CLERK_WEBHOOK_SECRET="whsec_..."

# ==========================================
# Video & Media Streaming (Mux)
# ==========================================
MUX_TOKEN_ID="mux_token_id_..."
MUX_TOKEN_SECRET="mux_token_secret_..."
MUX_WEBHOOK_SECRET="mux_webhook_secret_..."

# ==========================================
# Asset Storage & Uploads (Cloudinary)
# ==========================================
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# ==========================================
# Email Service (Resend)
# ==========================================
RESEND_API_KEY="re_..."
EMAIL_FROM="noreply@yourdomain.com"

# ==========================================
# Payments (Stripe / Payment Gateway)
# ==========================================
STRIPE_API_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

---

## 3. Webhook Endpoints Configuration

Configure the following endpoints in your respective provider dashboards:

- **Clerk Webhooks**: `https://your-domain.com/api/webhooks/clerk`
- **Mux Webhooks**: `https://your-domain.com/api/webhooks/mux`
- **Payment Webhooks**: `https://your-domain.com/api/webhooks/payment`

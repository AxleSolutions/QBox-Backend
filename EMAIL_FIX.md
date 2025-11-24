# Email Service Fix for Production

## Problem
Gmail SMTP is blocked or restricted on Render's free tier, causing password reset emails to fail.

## Solution: Use Resend (Free & Reliable)

### Step 1: Sign up for Resend
1. Go to https://resend.com
2. Sign up with your email (free forever - 3,000 emails/month)
3. Verify your email address

### Step 2: Get API Key
1. Go to API Keys section
2. Click "Create API Key"
3. Name it: "QBox Production"
4. Copy the API key (starts with `re_`)

### Step 3: Update Backend Code

Install Resend package:
```bash
cd QBox-Backend
npm install resend
```

### Step 4: Update Environment Variables on Render

Go to your Render dashboard → QBox Backend → Environment:

**Remove these:**
- `EMAIL_SERVICE`
- `EMAIL_USER`
- `EMAIL_PASSWORD`

**Add this:**
- `RESEND_API_KEY` = your_resend_api_key_here
- `FROM_EMAIL` = onboarding@resend.dev (or your verified domain)

### Step 5: Restart Service
Render will auto-deploy after you save environment variables.

---

## Alternative Solution 2: Use SendGrid (Also Free)

SendGrid offers 100 emails/day for free:

1. Sign up at https://sendgrid.com
2. Get API key
3. Add to Render:
   - `SENDGRID_API_KEY` = your_key
4. Install: `npm install @sendgrid/mail`

---

## Alternative Solution 3: Disable Password Reset Temporarily

If you don't need password reset feature right now, you can temporarily disable it and allow users to contact you directly for password resets.

---

## Testing After Fix

Test the password reset flow:
1. Open app
2. Go to Login → Forgot Password
3. Enter email
4. Check if you receive the verification code
5. Complete password reset

If emails still don't work, check Render logs:
```bash
# View logs in Render dashboard
Dashboard → QBox Backend → Logs tab
```

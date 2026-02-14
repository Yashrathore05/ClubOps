# Google Login – Setup Guide

ClubOps uses Google OAuth so users can sign in or sign up with their Google account. Follow these steps to enable it.

---

## 1. Open Google Cloud Console

Go to: **https://console.cloud.google.com/**

Sign in with your Google account.

---

## 2. Create or select a project

- In the top bar, click the **project dropdown**.
- Click **New Project** (or choose an existing one).
- Name it e.g. `ClubOps` → **Create**.

---

## 3. Configure the OAuth consent screen

- In the left menu: **APIs & Services** → **OAuth consent screen**.
- Choose **External** (so any Google user can sign in) → **Create**.
- Fill in:
  - **App name:** `ClubOps`
  - **User support email:** your email
  - **Developer contact:** your email
- Click **Save and Continue**.
- **Scopes:** click **Add or Remove Scopes**. Add:
  - `openid`
  - `email`
  - `profile`
- **Save and Continue**.
- **Test users:** you can leave empty if the app is in “Testing”; add your email if you want to test before publishing.
- **Save and Continue** until done.

---

## 4. Create OAuth credentials

- In the left menu: **APIs & Services** → **Credentials**.
- Click **+ Create Credentials** → **OAuth client ID**.
- **Application type:** **Web application**.
- **Name:** e.g. `ClubOps Web`.
- **Authorized JavaScript origins** (optional for server-side flow; you can add for consistency):
  - `http://localhost:3000` (frontend in dev)
  - Your production frontend URL when you deploy (e.g. `https://yourapp.com`)
- **Authorized redirect URIs** – **this is required:**
  - For **local development**, add exactly:
    ```text
    http://localhost:3001/auth/google/callback
    ```
  - For **production**, add your backend callback URL, e.g.:
    ```text
    https://api.yourapp.com/auth/google/callback
    ```
  (Replace `https://api.yourapp.com` with your real backend URL.)
- Click **Create**.

You’ll see a popup with:
- **Client ID** (looks like `xxxxx.apps.googleusercontent.com`)
- **Client secret** (shorter string, often starts with `GOCSPX-`)

Copy both. If you closed the popup, you can get the **Client secret** again like this:

### Where to get the Client secret (if you didn’t copy it)

1. Go to **https://console.cloud.google.com/apis/credentials**
2. Under **OAuth 2.0 Client IDs**, click the name of your client (e.g. “ClubOps Web”).
3. On the client details page you’ll see:
   - **Client ID** (you already have this)
   - **Client secret** – if it shows dots (••••••••), click **SHOW** or the copy icon to reveal/copy it.
4. If there’s no secret or it was never shown, click **RESET SECRET** to generate a new one, then copy it.

**Yes, the Client secret is required.** The backend uses it (together with the Client ID) to securely exchange the login code from Google for your user’s profile. Don’t share it or commit it to git.

---

## 5. Add credentials to the backend

In your **backend** folder, create or edit `.env` (use `.env.example` as a template).

Add or set:

```env
# Google OAuth (from step 4)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# Backend URL – must match where your backend runs (used for redirect_uri)
# Local dev:
BACKEND_URL=http://localhost:3001

# Production example:
# BACKEND_URL=https://api.yourapp.com
```

- **Local dev:** backend usually runs on `http://localhost:3001`, so `BACKEND_URL=http://localhost:3001`.
- **Production:** set `BACKEND_URL` to your real backend base URL (no trailing slash). The redirect URI will be `{BACKEND_URL}/auth/google/callback` and must match exactly what you added in the Google Console.

---

## 6. Restart the backend

Restart your backend server so it loads the new env vars:

```bash
cd backend
npm run dev
```

---

## 7. Test

1. Open the app (e.g. `http://localhost:3000`).
2. Go to **Sign in** or **Get started**.
3. Click **Continue with Google**.
4. You should be redirected to Google, then back to the app and signed in (or to onboarding if it’s a new user).

---

## Troubleshooting

| Issue | What to check |
|-------|----------------|
| “Google login is not configured” | `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in backend `.env`, and backend restarted. |
| “redirect_uri_mismatch” from Google | The **Authorized redirect URI** in Google Console must be exactly `{BACKEND_URL}/auth/google/callback` (e.g. `http://localhost:3001/auth/google/callback` for dev). No typo, no extra slash, same protocol (http vs https). |
| Blank or JSON after clicking Google | Backend might not be running, or `BACKEND_URL` is wrong. Check backend logs. |
| Works in dev, fails in production | Add the production callback URL in Google Console (e.g. `https://api.yourapp.com/auth/google/callback`) and set `BACKEND_URL` in production env to that base URL. |

---

## What to send if you need help

If something still doesn’t work, you can share (with secrets removed):

1. Whether you’re on **local dev** or **production**.
2. Your **BACKEND_URL** (e.g. `http://localhost:3001`).
3. The **exact** “Authorized redirect URIs” you added in Google Console (hide the rest of the client).
4. The **exact** error message or screenshot (browser or backend log).

Do **not** share your `GOOGLE_CLIENT_SECRET` or any real passwords.

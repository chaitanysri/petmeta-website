# PetMeta setup

## Run locally

1. Install Node.js 22 and run `npm ci` in `petmeta-web-main`.
2. Copy `.env.example` to `.env.local`. Fill in the Firebase web app settings for your project.
3. Run `npm run dev` and open `http://127.0.0.1:3000`.
4. Run `npm run typecheck` for TypeScript, or `npm run build` followed by `npm start` for a production preview.

## Environment

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Web SDK API key. This identifies the project and is public. |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth helper host, without a protocol. Use the project Firebase Hosting domain or configure a same-origin helper for redirect flows. |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID. |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase web app ID. |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase web app sender ID. New in this update. |
| `NEXT_PUBLIC_FIREBASE_EMULATORS` | Use `true` for local Auth on port 9099 and Firestore on port 8089. Keep `false` in production. |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Existing optional browser Maps key. Restrict it to the site's referrers and enabled APIs. |
| `NEXT_PUBLIC_GOOGLE_MAP_ID` | Existing optional Maps style ID. |
| `GOOGLE_MAPS_API_KEY` | Existing server-side Places key. Restrict its allowed APIs. |
| `GROQ_API_KEY` | Existing server-side key for the pet assistant API. |
| `BUSINESS_API_URL` | Optional existing server-side business API origin. |
| `NEXT_PUBLIC_BUSINESS_API_URL` | Optional existing browser-facing business endpoint URL. Keep credentials out of it. |

Firebase Web SDK identifiers are public. Keep Google OAuth client secrets, Firebase Admin credentials, and server API keys in the console or server environment. Keep `.env.local` out of archives and version control.

## Firebase Authentication

- In **Authentication → Sign-in method**, enable **Email/Password** and **Google**. Choose a project support email for Google. Keep one account per email enabled. If an OAuth client is managed separately, enter its configuration in the Firebase console.
- In **Authentication → Settings → Authorized domains**, add the deployed site hostname and the exact local hostname you use for testing. Use an HTTPS origin for production.
- The app requests a popup first. If the browser blocks it, the app uses redirect sign-in. On browsers that block third-party storage, configure the same-origin Firebase Auth helper described in the official redirect guide. For a custom helper host, authorize `https://YOUR_AUTH_DOMAIN/__/auth/handler` in the Google OAuth client and set `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` to that host. [Google sign-in setup](https://firebase.google.com/docs/auth/web/google-signin) · [Redirect setup](https://firebase.google.com/docs/auth/web/redirect-best-practices)
- If Firebase reports a Google credential collision, use **Sign In** with the existing email and password in the same browser tab. The app confirms the email matches before linking a pending Google credential. If Firebase provides no usable pending credential, retry Google after authenticating with the original provider.
- Firebase uses local browser persistence for consumer sessions. Logout clears the Firebase session in the current browser and returns directly to `/login`.

## Password-reset email

In **Authentication → Templates → Password reset**, edit the action URL to `https://YOUR_SITE_HOST/reset-password` if you want PetMeta to host the reset UI. Firebase appends the action code. Make sure the site hostname is authorized. Keep Firebase email enumeration protection enabled. PetMeta verifies and consumes the code using Firebase Auth, and Firebase enforces expiry and single use. Keep the password-reset template separate from any other action modes your project uses. [Firebase email action handlers](https://firebase.google.com/docs/auth/custom-email-handler/)

## Firestore

Create a Firestore database in the project. Deploy the existing `firestore.rules` file to that project. Confirm the project and rules in the Firebase console before deploying. The rules already restrict each consumer profile and its existing pet and booking subcollections to the owner:

```firestore
rules_version = '2';
service cloud.firestore {
 match /databases/{database}/documents {
  match /users/{userId} {
   allow read, write: if request.auth != null && request.auth.uid == userId;
   match /{document=**} { allow read, write: if request.auth != null && request.auth.uid == userId; }
  }
 }
}
```

## Cookies, assets, and production

- No analytics or marketing vendor is configured. Add an approved loader URL to its category in `lib/cookie-consent.ts` and update the cookie policy when connecting a vendor. Document new public tracking IDs in `.env.example` and these notes. No analytics IDs are required now.
- Rebuild the original illustrations with `node scripts/build-shop-menu.cjs` and `node scripts/build-pet-zone.cjs` after installing project dependencies. Artwork credits are in `docs/IMAGE-CREDITS.md`.
- If the cropped logo bytes change, update the logo version in `lib/auth-logo.ts` and the matching query value in `next.config.mjs`. Only that versioned URL receives the immutable cache header.
- The production shortcut and context-menu controls deter casual inspection only. Client assets remain accessible, so keep sensitive logic and secrets server-side. Next.js minifies production assets, omits public browser source maps, and strips console calls. Additional obfuscation was omitted.

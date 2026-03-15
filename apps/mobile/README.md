# FlacronCV Mobile App

React Native Expo mobile application for the FlacronCV SaaS platform.

## Tech Stack

- **React Native** + **Expo** (Managed Workflow)
- **Expo Router** — file-based routing
- **TypeScript**
- **NativeWind** — Tailwind CSS for React Native
- **Zustand** — state management
- **TanStack Query v5** — data fetching & caching
- **React Hook Form + Zod** — forms & validation
- **Firebase Auth** — authentication (client SDK)
- **Expo SecureStore** — secure token storage
- **Stripe React Native SDK** — payments
- **Expo Print + Sharing** — PDF export & sharing
- **Expo Image Picker** — profile photo upload
- **React Native Reanimated** — animations

## Setup

### 1. Install Dependencies

```bash
cd apps/mobile
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

```env
EXPO_PUBLIC_API_URL=http://localhost:4000/api/v1
EXPO_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-key
```

### 3. Add Font Assets

Install Expo Google Fonts:

```bash
npx expo install @expo-google-fonts/inter
```

### 4. Start Development

```bash
npx expo start
```

Scan the QR code with **Expo Go** app on your device.

## Project Structure

```
apps/mobile/
├── app/                        # Expo Router screens
│   ├── _layout.tsx            # Root layout (providers)
│   ├── index.tsx              # Entry redirect
│   ├── (auth)/                # Auth screens
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── forgot-password.tsx
│   └── (dashboard)/           # Protected screens (tab navigation)
│       ├── index.tsx          # Dashboard home
│       ├── cvs/               # CV management
│       │   ├── index.tsx      # CV list
│       │   ├── new.tsx        # Template picker + create
│       │   └── [id]/index.tsx # CV editor wizard
│       ├── cover-letters/     # Cover letter management
│       ├── templates/         # Template gallery
│       ├── settings/          # Profile, billing, etc.
│       └── support/           # Support tickets
├── src/
│   ├── types/                 # TypeScript types (mirrors shared-types)
│   ├── store/                 # Zustand stores
│   │   ├── auth-store.ts      # Firebase auth + user
│   │   ├── cv-store.ts        # CV editor state + undo/redo
│   │   └── cover-letter-store.ts
│   ├── lib/
│   │   ├── api.ts             # Axios + auth interceptors
│   │   ├── firebase.ts        # Firebase client init
│   │   ├── secure-store.ts    # Expo SecureStore wrapper
│   │   └── utils.ts           # Plan gating helpers
│   ├── hooks/                 # React Query hooks
│   │   ├── useCVs.ts
│   │   ├── useCoverLetters.ts
│   │   ├── useTemplates.ts
│   │   ├── useAI.ts
│   │   ├── useExport.ts
│   │   ├── usePayment.ts
│   │   ├── useSupport.ts
│   │   └── useUser.ts
│   ├── components/            # Reusable components
│   │   ├── ui/                # Base UI components
│   │   ├── cv-builder/        # CV wizard steps
│   │   ├── dashboard/         # Dashboard cards
│   │   ├── templates/         # Template cards
│   │   └── subscription/      # Plan cards, upgrade modal
│   └── providers/             # Context providers
└── global.css                 # NativeWind global styles
```

## Features Implemented

### Authentication
- ✅ Email + password login/register
- ✅ Forgot password (reset email)
- ✅ JWT token stored in Expo SecureStore
- ✅ Auto token refresh via Firebase
- ✅ Global auth guard (protected routes)
- ✅ Role-based access

### Dashboard
- ✅ Welcome section with user name
- ✅ Stats cards (CVs, Cover Letters, Downloads, AI Credits)
- ✅ Quick action buttons
- ✅ Recent documents list
- ✅ Upgrade banner for Free users
- ✅ Pull-to-refresh

### CV Builder
- ✅ Template selection gallery
- ✅ 9-step wizard:
  1. Personal Information
  2. Professional Summary (with AI generation)
  3. Work Experience (add/edit/delete)
  4. Education (add/edit/delete)
  5. Skills (with proficiency levels)
  6. Projects
  7. Certifications
  8. Languages
  9. References
- ✅ React Hook Form + Zod validation per step
- ✅ Progress indicator
- ✅ Auto-save on step change
- ✅ Undo/Redo (50 history entries)
- ✅ CV export (PDF/DOCX via backend API)

### AI Generation
- ✅ Professional summary generation
- ✅ Cover letter generation
- ✅ AI credit tracking
- ✅ Plan-based credit limits
- ✅ Loading states + error handling

### Cover Letter Builder
- ✅ Job details form
- ✅ Tone selection (Professional/Friendly/Enthusiastic/Formal)
- ✅ AI generation
- ✅ Manual text editing
- ✅ PDF export

### Templates
- ✅ Template gallery with thumbnails
- ✅ Filter by Free/Pro
- ✅ Lock overlay for premium templates
- ✅ Color scheme preview dots
- ✅ Tier badge display

### Subscriptions & Billing
- ✅ Plan comparison cards (Free/Pro/Enterprise)
- ✅ Monthly/Yearly toggle (with savings badge)
- ✅ Stripe checkout (opens in browser)
- ✅ Billing portal access
- ✅ Current plan status display
- ✅ Usage bars (AI Credits, Exports)
- ✅ Plan-based feature gating throughout

### Support
- ✅ Support ticket list
- ✅ Create new ticket (category + priority)
- ✅ Ticket detail with messaging
- ✅ Real-time message polling

### Settings & Profile
- ✅ Profile editing (name, headline, bio, social links)
- ✅ Profile photo upload via Expo ImagePicker
- ✅ Sign out

## Feature Gating Logic

All plan limits are enforced client-side with server-side verification:

| Feature | Free | Pro | Enterprise |
|---------|------|-----|------------|
| CVs | 5 | 10 | Unlimited |
| Cover Letters | 1 | 20 | Unlimited |
| AI Credits/mo | 5 | 100 | 500 |
| PDF Exports/mo | 2 | Unlimited | Unlimited |
| Templates | Free only | All | All |
| Watermark | Yes | No | No |

## Notes

### Expo Go Compatibility
- All packages selected are Expo Go compatible
- No bare workflow or native module compilation required
- Stripe payments open in browser (not native sheet — full native sheet requires dev build)

### PDF Export
- PDF export calls the backend API (Puppeteer-based)
- File downloaded to cache via `expo-file-system`
- Shared via native share sheet using `expo-sharing`

### Fonts
- Add `@expo-google-fonts/inter` dependency for full Inter font support
- The `app.json` uses expo-font loader

### Backend Requirements
- API must be running at `EXPO_PUBLIC_API_URL`
- Firebase project must have Authentication enabled
- Same Firebase project as web app (shared auth tokens)

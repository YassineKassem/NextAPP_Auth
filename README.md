# MyPortfolio

This is a Next.js web application that includes user authentication via Google OAuth, profile management, dark mode, and more.

## Features
- User authentication with Google using NextAuth.
- Users can edit their profile (name, surname, birthdate, address, phone, email).
- Dark mode and light mode switch.
- Integration with Supabase to store user profile data, including profile images.
- Tailwind CSS for styling.
- Automatic redirection to the login page if not authenticated.
- Google profile picture storage in Supabase and retrieval on profile view.

## Tech Stack
- **Next.js**: React framework for building web applications.
- **NextAuth.js**: For Google OAuth and session management.
- **Supabase**: Postgres database and authentication provider.
- **Tailwind CSS**: Utility-first CSS framework.
- **Axios**: For making HTTP requests.
- **Vercel**: Deployment platform for Next.js apps.

## Project Structure
```bash
├── pages                  # Pages directory for Next.js routing
│   ├── api                # API routes
│   ├── profile            
│   │   └── edit.js        # Edit Profile page
│   ├── _app.js            # Main app entry file
│   ├── index.js           # Home/landing page
│   ├── login.js           # Login page
|   |__ profile.js         # Profile page     
|
├── styles                 # Global styles directory
│   └── globals.css        # Global CSS
├── utils                  # Utility functions and clients
│   └── supabaseClient.js  # Supabase client initialization
├── .env.local             # Environment variables file (local)
├── next.config.mjs        # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── package.json           # NPM dependencies and scripts
├── README.md              # Project documentation

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


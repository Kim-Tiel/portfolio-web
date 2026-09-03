# Kim Anderson G. Tiel — Portfolio (JavaScript edition)

My personal developer portfolio: a full-stack site built to show how I actually build software — clean UI, tested code, and a real API behind it (not static/mocked content).

This is the **pure JavaScript** build of the site — same design, same features, same backend, just without TypeScript. See [portfolio-web](https://github.com/<your-username>/portfolio-web) for the TypeScript version.

**Live site:** _add your deployed URL here_
**Backend API repo:** [portfolio-backend](https://github.com/<your-username>/portfolio-backend) — Ruby on Rails

---

## Highlights

- **Real, self-served data.** Profile, skills, projects, and experience all come from a Rails API I built and deployed myself — nothing on this page is hardcoded placeholder content.
- **A live API demo panel.** The "Try the backend" section on the site lets a visitor fire real `GET`/`POST` requests against the API and watch the JSON response come back, in the browser, with no backend knowledge required to appreciate it.
- **Fully tested.** 65+ component and hook tests (Vitest + React Testing Library + MSW) covering forms, filters, pagination, theming, and API states.
- **Accessible and responsive.** Keyboard-operable nav and forms, `prefers-reduced-motion` respected, mobile-first layout, light/dark theming.

## Sections

| Section | What it shows |
|---|---|
| **Home** | Animated role-cycling intro, availability status, resume download |
| **About** | Bio, stats (years of experience, availability, location), education |
| **Skills** | Category-filterable skill grid with proficiency indicators |
| **Projects** | Filterable, paginated project grid (case cards with live-site/repo links) |
| **Experience** | Career history styled as a `git log` — real commit-style hashes, diff-style highlights, and a tech-stack breakdown per role |
| **Live Demo** | An interactive request panel that calls the real API (`profile`, `skills.top`, `projects.featured`, `hire.me`) and renders the actual JSON response |
| **Contact** | Validated contact form wired to the backend's contact-message endpoint |

## Tech Stack

**Core**
- [React 19](https://react.dev/) (JavaScript, no TypeScript)
- [Vite](https://vite.dev/) — dev server & build tooling
- [Tailwind CSS v4](https://tailwindcss.com/) — utility-first styling, theme via CSS custom properties

**Data & forms**
- [TanStack Query](https://tanstack.com/query) — server-state fetching/caching
- [React Router](https://reactrouter.com/) — client-side routing
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) — form state and schema validation

**UI & motion**
- [Framer Motion](https://motion.dev/) — entrance/transition animations
- [Lucide React](https://lucide.dev/) — icon set

**Testing**
- [Vitest](https://vitest.dev/) — test runner
- [React Testing Library](https://testing-library.com/react) — component testing
- [Mock Service Worker (MSW)](https://mswjs.io/) — API mocking in tests

**Tooling**
- [ESLint](https://eslint.org/) (`eslint-plugin-react-hooks`) — linting
- [Prettier](https://prettier.io/) — code formatting
- [PostCSS](https://postcss.org/) / [Autoprefixer](https://github.com/postcss/autoprefixer)

## Backend

The API this site talks to is a separate Ruby on Rails project:

- Ruby on Rails 6, PostgreSQL, Puma
- JWT-based authentication for the admin panel
- Rate limiting (`rack-attack`) and CORS handling
- File uploads via AWS S3 (Active Storage)
- Tested with RSpec, FactoryBot, and Shoulda Matchers
- Static analysis via Brakeman (security) and Rubocop (style)

---

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm
- The [portfolio-backend](https://github.com/<your-username>/portfolio-backend) API running locally (or a deployed instance) — see that repo's README for setup

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd portfolio-web-js

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.development .env.local   # then edit values as needed
```

### Environment variables

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend API (e.g. `http://localhost:3000` in development) |
| `VITE_CONTACT_EMAIL` | Email address shown in the Contact section and used for `mailto:` links |

### Running locally

```bash
npm run dev
```

The app runs at `http://localhost:5174` by default (kept distinct from the TypeScript version's 5173 so both can run side by side). Make sure the backend API is running and reachable at the URL set in `VITE_API_BASE_URL`, or the site will show its loading/error state instead of real content.

### Running tests

```bash
npm run test
```

### Linting

```bash
npm run lint
```

### Production build

```bash
npm run build   # outputs to dist/
npm run preview # preview the production build locally
```

---

## Project Structure

```
src/
├── api/          # API client + TanStack Query hooks (one per resource)
├── hooks/        # Shared UI hooks (cursor spotlight, reduced-motion, etc.)
├── layout/       # Nav, Footer, and other page chrome
├── pages/        # Route-level components
├── sections/     # Home-page sections (Intro, About, Skills, Projects, Experience, LiveDemo, Contact)
├── theme/        # Theme context/provider + toggle
└── test/         # Test setup, shared mocks, and test helpers
```

## Contact

- **Email:** tielkim4@gmail.com
- **Portfolio:** _add your deployed URL here_

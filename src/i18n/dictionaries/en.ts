const en = {
  common: {
    brand: "Nova Starter",
    subtitle: "Senior-grade Next.js boilerplate",
    switchTheme: "Switch Theme",
    switchLanguage: "Change Language",
  },
  hero: {
    badge: "Production Ready",
    title: "Build multilingual products at startup speed",
    description:
      "A clean architecture with App Router, strongly typed dictionaries, dark and light themes, and state management out of the box.",
    primaryCta: "Start Building",
    secondaryCta: "Read Docs",
  },
  theme: {
    dark: "Dark",
    light: "Light",
    system: "System",
  },
  home: {
    navHome: "Home",
    navUsers: "Users",
    navSamplePost: "Sample post",
    navSampleUser: "Sample user",
    navDocs: "Next.js docs",
    heroKicker: "Reference UI · try everything below",
    featuresTitle: "Reference features",
    featuresSubtitle:
      "These blocks use the same patterns as production: hooks → React Query → http. Data comes from your configured API (JSONPlaceholder by default).",
    postsTitle: "Posts",
    postsDescription:
      "List + detail: `features/posts` with `usePosts`, `usePost`, and `PostsList` / `PostDetail`.",
    usersTitle: "Users",
    usersDescription:
      "Same architecture as posts: `features/users` with list and detail routes.",
    livePreview: "Live preview",
    openUsersIndex: "Users index",
    openPostById: "Open post #1",
    openPostById2: "Post #2",
    openUserById: "Open user #1",
    stackTitle: "Included in this starter",
    stackAtAGlance:
      "Scan these cards once, then scroll down for live Posts, Users, and Toast demos (same stack end to end).",
    stackCards: {
      appRouter: {
        title: "App Router",
        desc: "Layouts, nested routes, and Server / Client Components.",
      },
      i18n: {
        title: "Typed i18n",
        desc: "Locale-prefixed URLs and dictionaries inferred from TypeScript.",
      },
      themes: {
        title: "next-themes",
        desc: "Light, dark, and system modes, plus an nprogress-style route progress indicator.",
      },
      reactQuery: {
        title: "TanStack Query",
        desc: "Caching, retries, cancellation, and devtools-friendly defaults.",
      },
      axios: {
        title: "Axios layer",
        desc: "Typed `http` helpers, interceptors, and normalized API errors.",
      },
      errors: {
        title: "Errors & toasts",
        desc: "Global surfacing of final failures via Sonner and shared `appToast`.",
      },
      features: {
        title: "Feature folders",
        desc: "Every module uses `api` · `hooks` · `ui` · `types` for predictable DX.",
      },
      clientState: {
        title: "Client state",
        desc: "Example Zustand store plus typed `AppContext` (locale + dictionary) for client UI.",
      },
      quality: {
        title: "DX tooling",
        desc: "ESLint, Prettier, Husky, lint-staged, Commitlint, and Commitizen scripts.",
      },
    },
    toastBlockTitle: "Toasts",
    toastBlockDescription:
      "Sonner + shared `appToast` API (success, error, info, warning).",
    footerTagline: "Production-shaped Next.js starter",
    footerNote: "Clone, set `NEXT_PUBLIC_API_BASE_URL`, and ship.",
    footerDocs: "External docs",
    trySamples: "Jump to live samples",
  },
  auth: {
    navLogin: "Log in",
    navProfile: "Profile",
    navLogout: "Log out",
    sessionLoading: "Session…",
    loggingOut: "Signing out…",
    loginTitle: "Sign in",
    loginSubtitle: "Sample auth wired to tokenStore + the same Axios client as your API.",
    demoHint: "Demo account: demo@example.com / demo123 (served by `/api/auth/login`).",
    emailLabel: "Email",
    passwordLabel: "Password",
    submitLabel: "Continue",
    submittingLabel: "Signing in…",
    redirecting: "Redirecting…",
    profileTitle: "Your profile",
    profileIntro: "This route is protected on the client. Tokens persist in localStorage via the existing token store.",
    profileEmail: "Signed in as",
  },
};

export default en;

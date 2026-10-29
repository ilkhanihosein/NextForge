import Link from "next/link";
import "@/styles/globals.css";

/** Requests that never reach a locale (rare: the proxy localizes almost everything). */
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="grid min-h-dvh place-items-center bg-background p-6 text-center text-foreground">
        <div>
          <p className="text-sm tracking-[0.3em] text-brand uppercase">404</p>
          <h1 className="mt-3 text-3xl">Page not found</h1>
          <Link href="/" className="mt-6 inline-block underline">
            Go home
          </Link>
        </div>
      </body>
    </html>
  );
}

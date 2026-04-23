import Link from "next/link";

/**
 * Locale-scoped 404 for the App Router. Pages still owned by `pages/`
 * continue to use `pages/404.tsx`; the two routers never collide on a
 * single request.
 */
export default function LocaleNotFound() {
  return (
    <div className="mx-auto max-w-lg px-md py-xl">
      <h1 className="mb-md text-2xl font-semibold">404</h1>
      <p className="mb-lg text-textPrimary">
        Sidan finns inte. (App Router — sidor som fortfarande ligger i{" "}
        <code className="rounded bg-bgSecondary px-1">pages/</code> hanteras
        där.)
      </p>
      <Link href="/" className="text-lg underline">
        Till startsidan
      </Link>
    </div>
  );
}

import Link from "next/link";

export default function NotFound() {
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

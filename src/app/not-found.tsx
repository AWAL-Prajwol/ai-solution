export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto p-8 text-center">
      <h1 className="text-3xl font-bold mb-2">Page not found</h1>
      <p className="text-black/70 dark:text-white/70 mb-6">
        The page you are looking for doesn't exist.
      </p>
      <a className="underline" href="/">
        Go back home
      </a>
    </div>
  );
}

import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white px-4">
      <div className="text-center max-w-xl">
        <h1 className="text-5xl font-bold mb-4 text-red-500">404</h1>
        <p className="text-2xl font-semibold mb-2">Page Not Found</p>
        <p className="text-lg text-slate-400 mb-6">
          Sorry, the page you are looking for doesn’t exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}

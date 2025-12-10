import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>404 – Page not found</h2>
        <p className="auth-subtitle">
          The page you’re looking for doesn’t exist.
        </p>
        <Link to="/" className="btn btn-primary">
          Go home
        </Link>
      </div>
    </div>
  );
}

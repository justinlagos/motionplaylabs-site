import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page">
      <div className="wrap page-top">
        <h1 className="page-title">
          Not found
        </h1>
        <p className="quiet">This page does not exist or has moved.</p>
        <div className="button-row" style={{ marginTop: 28 }}>
          <Link className="button" href="/">
            Go to the homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

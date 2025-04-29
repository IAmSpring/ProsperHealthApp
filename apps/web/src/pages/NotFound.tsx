import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="card text-center">
      <div className="py-8">
        <h1 className="text-6xl font-bold text-indigo-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <button className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">
            Go Home
          </button>
        </Link>
      </div>
    </div>
  );
}

export default NotFound; 
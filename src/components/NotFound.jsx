import React from 'react'

const NotFound = () => {
  return (
   
    <div className="h-screen lg:w-screen flex flex-col items-center justify-center text-center p-5">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-lg mb-6">The page you are looking for does not exist.</p>
      <a
        href="/"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
      >
        Go Home
      </a>
    </div>
  );
};

export default NotFound
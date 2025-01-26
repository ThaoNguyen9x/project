import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 bg-black">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-red-700">
            404
          </h1>
          <p className="mb-4 text-3xl tracking-tight font-bold text-red-700 md:text-4xl">
            Something's missing.
          </p>
          <p className="mb-4 text-lg font-light text-white">
            Sorry, we can't find that page. You'll find lots to explore on the
            home page.
          </p>
          <Link
            to="/"
            className="inline-flex text-white bg-red-700 hover:opacity-80 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center my-4"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFound;

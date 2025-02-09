import React from "react";

function Hero() {
  return (
    <section className="bg-gray-50 max-h-screen">
      <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:items-center">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-extrabold sm:text-5xl text-primary">
            Welcome to Course Pilot
          </h1>
          <h1 className="text-2xl font-extrabold sm:text-2xl mt-5"><strong className="font-bold text-black sm:block">
              Personalized Learning Paths, Powered by AI.
            </strong></h1>

          <p className="mt-5 sm:text-xl/relaxed">
            Course Pilot is an AI powered learning platform that helps you
            discover the best courses and learning paths for your career
            development.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              className="block w-full rounded bg-primary px-12 py-3 text-sm font-medium text-white shadow hover:bg-primary/90 focus:outline-none focus:ring active:bg-primary/90 sm:w-auto"
              href="/dashboard"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
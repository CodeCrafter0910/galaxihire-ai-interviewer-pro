import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-3xl w-full glass p-10 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <h1 className="text-4xl font-extrabold mb-4">GalaxiHire — AI Interviewer</h1>
          <p className="text-gray-300 mb-6">
            Practice interviews, get scoring and feedback powered by your local services.
            Secure, private, and beautiful.
          </p>

          <div className="flex gap-4">
            <Link href="/login" className="btn-primary inline-block px-6">
              Get Started
            </Link>
            <a href="#learn" className="app-link self-center ml-2">Learn more</a>
          </div>
        </div>

        <div className="w-full md:w-96 glass-soft p-6">
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-300">
            <li>- Login to start interview</li>
            <li>- Local development only</li>
            <li>- Use docker compose to run all services</li>
          </ul>
        </div>
      </div>
    </main>
  );
}

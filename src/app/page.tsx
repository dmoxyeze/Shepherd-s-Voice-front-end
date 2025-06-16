/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";
import { FiLock, FiCheckCircle } from "react-icons/fi";

type Module = {
  id: string;
  name: string;
  description?: string;
  available: boolean;
  comingSoonDate?: string;
};

const modules: Module[] = [
  {
    id: "summarizer",
    name: "Sermon Summarizer",
    description: "Generate concise summaries of pastor's teachings",
    available: true,
  },
  {
    id: "social-media",
    name: "Social Media Generator",
    description: "Create social media posts from pastor's teachings",
    available: true,
  },
  {
    id: "translator",
    name: "Sermon Translator",
    description: "Translate messages to multiple languages",
    available: true,
  },
  {
    id: "study-guide",
    name: "Study Guide Generator",
    description: "Automatically create Bible study guides",
    available: true,
  },
  {
    id: "counseling-module",
    name: "Counseling Module",
    description: "AI Counseling based on pastor's teachings",
    available: false,
    comingSoonDate: "unknown",
  },
  {
    id: "theology-module",
    name: "Theology Checker",
    description: "Track theological consistency across pastor's teachings",
    available: false,
    comingSoonDate: "unknown",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-2">
            Shepherd's Voice
          </h1>
          <p className="text-lg text-gray-600">
            The sermon doesn't have to end at church. Explore our AI-powered
            modules designed to extend the reach and impact of our Pastor.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <Link
              key={module.id}
              href={
                module.available
                  ? `/sermons?module=${module.id}`
                  : "/not-available"
              }
              className={`group relative block p-6 rounded-xl transition-all duration-200 ${
                module.available
                  ? "bg-white hover:shadow-lg hover:-translate-y-1 border border-gray-200"
                  : "bg-gray-100 border border-gray-200 cursor-not-allowed"
              }`}
              aria-disabled={!module.available}
              tabIndex={module.available ? undefined : -1}
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-primary">
                    {module.name}
                  </h2>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      module.available
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {module.available ? (
                      <FiCheckCircle className="mr-1" />
                    ) : (
                      <FiLock className="mr-1" />
                    )}
                    {module.available ? "Available" : "Coming Soon"}
                  </span>
                </div>

                <p className="text-gray-400 mb-4 flex-grow">
                  {module.description}
                </p>

                {!module.available && module.comingSoonDate && (
                  <p className="text-sm text-gray-500 mt-auto">
                    Estimated: {module.comingSoonDate}
                  </p>
                )}
              </div>

              {!module.available && (
                <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                  <span className="bg-accent3 text-white px-4 py-2 rounded-md text-sm font-medium">
                    Coming Soon
                  </span>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

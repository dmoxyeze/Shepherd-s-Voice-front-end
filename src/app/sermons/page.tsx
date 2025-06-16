"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FiCalendar, FiUser } from "react-icons/fi";

const sermonsData: Sermon[] = [
  {
    id: 1,
    title: "The Power of Faith",
    date: "2023-11-12",
    themes: ["faith", "trust", "perseverance"],
    speaker: "Apostle O.T. Jacobs",
  },
  {
    id: 2,
    title: "Love Your Neighbor",
    date: "2023-11-05",
    themes: ["love", "compassion", "community"],
    speaker: "Apostle O.T. Jacobs",
  },
  {
    id: 3,
    title: "Finding Peace in Chaos",
    date: "2023-10-29",
    themes: ["peace", "anxiety", "trust"],
    speaker: "Apostle O.T. Jacobs",
  },
  {
    id: 4,
    title: "The Armor of God",
    date: "2023-10-22",
    themes: ["spiritual warfare", "protection", "truth"],
    speaker: "Apostle O.T. Jacobs",
  },
  {
    id: 5,
    title: "The Good Shepherd",
    date: "2023-10-15",
    themes: ["guidance", "protection", "salvation"],
    speaker: "Apostle O.T. Jacobs",
  },
];
interface Sermon {
  id: number;
  title: string;
  date: string;
  themes: string[];
  speaker: string;
}

export default function SermonList() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [filteredSermons, setFilteredSermons] = useState<Sermon[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const moduleName = searchParams.get("module");
  const router = useRouter();

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setSermons(sermonsData);
      setFilteredSermons(sermonsData);
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredSermons(sermons);
    } else {
      const filtered = sermons.filter(
        (sermon) =>
          sermon.themes.some((theme) =>
            theme.toLowerCase().includes(search.toLowerCase())
          ) || sermon.title.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredSermons(filtered);
    }
  }, [search, sermons]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary dark:text-secondary mb-2">
          Sermon Library
        </h1>
        <p className="text-gray-600 ">
          Browse and select sermons to use with the{" "}
          {moduleName?.replace("-", " ")} tool
        </p>
      </div>

      <div className="mb-8 relative max-w-md">
        {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400" />
        </div> */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 sm:text-sm"
          placeholder="Search by theme or title..."
        />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg p-6 h-32"
            ></div>
          ))}
        </div>
      ) : filteredSermons.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">
            No sermons found matching your search criteria
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSermons.map((sermon) => (
            <div
              key={sermon.id}
              onClick={() => router.push(`/${moduleName}/${sermon.id}`)}
              className="bg-whiteWarm rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden cursor-pointer border border-gray-200"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                  {sermon.title}
                </h2>

                <div className="flex items-center text-sm text-gray-400  mb-2">
                  <FiUser className="mr-1.5" />
                  <span>{sermon.speaker}</span>
                </div>

                <div className="flex space-x-4 text-sm mb-4">
                  <div className="flex items-center text-gray-400 ">
                    <FiCalendar className="mr-1.5" />
                    <span>{formatDate(sermon.date)}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {sermon.themes.map((theme) => (
                    <span
                      key={theme}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent2 text-white"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

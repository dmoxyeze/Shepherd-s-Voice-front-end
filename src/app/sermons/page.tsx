"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  FiCalendar,
  FiUser,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { TSermon } from "@/types";
import { getAllSermons } from "@/services";
import { useDebounce } from "@/hooks";

export default function SermonList() {
  const [sermons, setSermons] = useState<TSermon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });
  const searchParams = useSearchParams();
  const moduleName = searchParams.get("module");
  const router = useRouter();

  const fetchSermons = async (page: number, search = "") => {
    setIsLoading(true);
    setError(null);

    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        search: search,
      }).toString();

      const response = await getAllSermons(query);

      if (!response.data) {
        throw new Error("Invalid response format");
      }

      setSermons(response.data.data || []);
      setPagination({
        page: response.data.pagination?.page || 1,
        limit: response.data.pagination?.limit || pagination.limit,
        total: response.data.pagination?.total || 0,
        totalPages: response.data.pagination?.totalPages || 1,
      });
    } catch (err) {
      setError("Failed to load sermons. Please try again later.");
      console.error("Fetch sermons error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle initial load and debounced search
  useEffect(() => {
    fetchSermons(1, debouncedSearch);
  }, [debouncedSearch]);

  // Handle page changes
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchSermons(newPage, debouncedSearch);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e: unknown) {
      console.error(`Invalid date format: ${dateString}`, e);
      return "Invalid date";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary dark:text-secondary mb-2">
          Sermon Library
        </h1>
        <p className="text-gray-600">
          Browse and select sermons to use with the{" "}
          {moduleName?.replace("-", " ")} tool
        </p>
      </div>

      <div className="mb-8 relative max-w-md">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="block w-full pl-4 pr-3 py-2 border border-gray-300 rounded-md leading-5 sm:text-sm"
          placeholder="Search by theme or title..."
        />
      </div>

      {error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg p-6 h-32"
            ></div>
          ))}
        </div>
      ) : sermons.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">
            {debouncedSearch
              ? "No sermons found matching your search criteria"
              : "No sermons available"}
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sermons.map((sermon) => (
              <div
                key={sermon.id}
                onClick={() => router.push(`/${moduleName}/${sermon.id}`)}
                className="bg-whiteWarm rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden cursor-pointer border border-gray-200"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {sermon.topic || "Untitled Sermon"}
                  </h2>

                  <div className="flex items-center text-sm text-gray-400 mb-2">
                    <FiUser className="mr-1.5" />
                    <span>{sermon.preacher || "Unknown Preacher"}</span>
                  </div>

                  <div className="flex space-x-4 text-sm mb-4">
                    <div className="flex items-center text-gray-400">
                      <FiCalendar className="mr-1.5" />
                      <span>{formatDate(sermon.date_preached)}</span>
                    </div>
                  </div>

                  {Array.isArray(sermon.themes) && sermon.themes.length > 0 && (
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
                  )}
                </div>
              </div>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className={`px-3 py-2 rounded-l-md border ${
                    pagination.page === 1
                      ? "bg-gray-100 text-gray-400 border-gray-300"
                      : "bg-white text-gray-500 hover:bg-gray-50 border-gray-300"
                  }`}
                >
                  <FiChevronLeft className="h-5 w-5" />
                </button>

                {Array.from(
                  { length: Math.min(5, pagination.totalPages) },
                  (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        disabled={pagination.page === pageNum}
                        className={`px-4 py-2 border ${
                          pagination.page === pageNum
                            ? "bg-primary text-white border-primary"
                            : "bg-white text-gray-500 hover:bg-gray-50 border-gray-300"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                )}

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className={`px-3 py-2 rounded-r-md border ${
                    pagination.page === pagination.totalPages
                      ? "bg-gray-100 text-gray-400 border-gray-300"
                      : "bg-white text-gray-500 hover:bg-gray-50 border-gray-300"
                  }`}
                >
                  <FiChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
}

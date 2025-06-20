"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft, FiLoader, FiCalendar, FiUser } from "react-icons/fi";
import { TSermon } from "@/types";
import { getSermonById } from "@/services";

export default function Summarizer() {
  const { id } = useParams();
  const router = useRouter();
  const [sermon, setSermon] = useState<TSermon | null>(null);
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSermon = async () => {
      try {
        setIsLoading(true);
        setError("");

        if (!id) {
          throw new Error("Sermon ID is required");
        }

        const { data } = await getSermonById(id as string);
        setSermon(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load sermon");
        console.error("Fetch sermon error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSermon();
  }, [id]);

  async function handleSummarize() {
    try {
      setIsSummarizing(true);
      setError("");

      // Replace with actual summarization API call
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API delay

      // const mockSummary = `
      //   <h3 class="font-bold text-lg mb-2">Key Points:</h3>
      //   <ul class="list-disc pl-5 space-y-2">
      //     <li>Faith provides assurance and conviction beyond what we can see</li>
      //     <li>Genuine faith transforms our lives and perspective</li>
      //     <li>Through faith we understand God's creation</li>
      //     <li>Faith gives strength to overcome life's challenges</li>
      //   </ul>
      //   <h3 class="font-bold text-lg mt-4 mb-2">Main Theme:</h3>
      //   <p>True biblical faith changes how we live and provides strength during difficulties.</p>
      // `;

      setSummary(sermon?.full_text || "");
    } catch (err) {
      setError("Failed to generate summary");
      console.error("Summarization error:", err);
    } finally {
      setIsSummarizing(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FiLoader className="animate-spin text-4xl text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!sermon) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Header */}
        <header className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-primary hover:text-primary-light mb-4 transition"
          >
            <FiArrowLeft className="mr-2" />
            Back to Sermons
          </button>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {sermon.topic}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
              {sermon.preacher && (
                <span className="flex items-center">
                  <FiUser className="mr-1.5" /> {sermon.preacher}
                </span>
              )}
              {sermon.date_preached && (
                <span className="flex items-center">
                  <FiCalendar className="mr-1.5" />
                  {new Date(sermon.date_preached).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          {/* Summary Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Summary</h2>
              <button
                onClick={handleSummarize}
                disabled={isSummarizing}
                className={`flex items-center px-4 py-2 rounded-lg transition
                  ${
                    isSummarizing
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-primary hover:bg-primary-light text-white"
                  }
                `}
              >
                {isSummarizing ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  "Generate Summary"
                )}
              </button>
            </div>

            {summary ? (
              <div
                className="prose max-w-none bg-gray-50 p-4 rounded-lg"
                dangerouslySetInnerHTML={{ __html: summary }}
              />
            ) : (
              <div className="bg-gray-50 p-8 text-center rounded-lg">
                <p className="text-gray-500">
                  {isSummarizing
                    ? "Analyzing sermon content..."
                    : "Summary will appear here"}
                </p>
              </div>
            )}

            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

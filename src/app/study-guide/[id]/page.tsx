"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiLoader,
  FiDownload,
  FiFileText,
  FiBook,
  FiCalendar,
  FiUser,
} from "react-icons/fi";
// import PDFDocument from "pdfkit";
// import { saveAs } from "file-saver";

export default function StudyGuide() {
  const { id } = useParams();
  const router = useRouter();
  const [sermon, setSermon] = useState<{
    title: string;
    text: string;
    scripture?: string;
    date?: string;
    speaker?: string;
  } | null>(null);
  const [guide, setGuide] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSermon = async () => {
      try {
        setIsLoading(true);
        const data = {
          title: "The Power of Faith",
          text: "Faith is the assurance of things hoped for, the conviction of things not seen. Through faith we understand that the universe was created by the word of God. True faith transforms our lives and gives us strength to overcome challenges.",
          date: "2023-11-12",
          speaker: "Pastor John Smith",
        };
        setSermon(data);
      } catch (err) {
        setError("Failed to load sermon");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSermon();
  }, [id]);

  async function handleGenerate() {
    try {
      setIsGenerating(true);
      setError("");

      // Simulate AI generation delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate a more structured study guide
      const generatedGuide = `
        STUDY GUIDE: ${sermon?.title}
        
        Date: ${sermon?.date}
        Speaker: ${sermon?.speaker}
        
        === Main Points ===
        1. Faith provides assurance and conviction
        2. Faith helps us understand creation
        3. Faith transforms our lives
        4. Faith gives strength for challenges
        
        === Discussion Questions ===
        1. What does faith mean to you personally?
        2. How has faith helped you overcome challenges?
        3. What biblical examples of faith inspire you?
        
        === Application ===
        - Identify one area where you need more faith this week
        - Share this lesson with someone who needs encouragement
      `;

      setGuide(generatedGuide);
    } catch (err) {
      setError("Failed to generate guide");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  }

  async function generatePDF() {
    if (!guide) return;

    try {
      setIsGenerating(true);
      const response = await fetch("/api/generate-study-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guide, title: sermon?.title }),
      });
      if (!response.ok) {
        setError(response.statusText);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${sermon?.title}-study-guide-${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to generate PDF");
      console.error(err);
    } finally {
      setIsGenerating(false);
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
              {sermon.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {sermon.speaker && (
                <span className="flex items-center">
                  <FiUser className="mr-1.5" /> {sermon.speaker}
                </span>
              )}
              {sermon.date && (
                <span className="flex items-center">
                  <FiCalendar className="mr-1.5" />
                  {new Date(sermon.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}
              {sermon.scripture && (
                <span className="flex items-center">
                  <FiBook className="mr-1.5" /> {sermon.scripture}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="grid grid-cols-1 gap-8">
          {/* Controls */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <button
              onClick={async () => {
                await handleGenerate();
                // await generatePDF();
              }}
              disabled={isGenerating}
              className={`flex items-center justify-center px-6 py-3 rounded-lg transition
                ${
                  isGenerating
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-primary hover:bg-primary-light text-white"
                }
              `}
            >
              {isGenerating ? (
                <>
                  <FiLoader className="animate-spin mr-2" />
                  Generating Guide...
                </>
              ) : (
                <>
                  <FiFileText className="mr-2" />
                  Generate Study Guide (PDF)
                </>
              )}
            </button>
          </div>

          {/* Guide Preview */}
          {guide && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FiFileText className="mr-2 text-primary" />
                Study Guide Preview
              </h2>
              <div className="prose max-w-none bg-gray-50 p-4 rounded-lg whitespace-pre-line">
                {guide}
              </div>
              <button
                onClick={generatePDF}
                disabled={isGenerating}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/90 text-white rounded-lg transition"
              >
                <FiDownload /> Download PDF
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

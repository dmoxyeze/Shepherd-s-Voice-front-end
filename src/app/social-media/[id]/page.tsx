/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiLoader,
  FiDownload,
  FiCopy,
  FiCheck,
} from "react-icons/fi";
import Image from "next/image";
// import { FaCheck, FaMoon, FaSun } from "react-icons/fa";

export default function SocialMedia() {
  const { id } = useParams();
  const router = useRouter();
  const postRef = useRef<HTMLDivElement>(null);
  const [sermon, setSermon] = useState<{
    title: string;
    text: string;
    scripture?: string;
    date?: string;
    speaker?: string;
  } | null>(null);
  const [quote, setQuote] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [error, setError] = useState("");
  //   const [postStyle, setPostStyle] = useState<"quote" | "verse" | "reflection">(
  //     "quote"
  //   );
  const [colorScheme, setColorScheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const fetchSermon = async () => {
      try {
        setIsLoading(true);
        // Replace with actual API call
        const mockSermon = {
          title: "The Power of Faith",
          text: "Faith is the assurance of things hoped for, the conviction of things not seen. Through faith we understand that the universe was created by the word of God. True faith transforms our lives and gives us strength to overcome challenges.",
          scripture: "Hebrews 11:1, 3",
          date: "2023-11-12",
          speaker: "Pastor John Smith",
        };
        setSermon(mockSermon);
      } catch (err) {
        console.error("Failed to fetch sermon:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSermon();
  }, [id]);

  async function handleGenerate() {
    try {
      setIsGenerating(true);
      setCopied(false);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate different content based on post style
      let generatedContent = "";
      generatedContent = `"${sermon?.text.slice(0, 150)}..."\n\n- ${
        sermon?.speaker
      }`;

      setQuote(generatedContent);
      setImageUrl(`/pjakes.jpeg`);
    } catch (err) {
      console.error("Generation failed:", err);
    } finally {
      setIsGenerating(false);
    }
  }

  async function downloadPost() {
    if (!quote) return;
    try {
      setIsDownloading(true);
      setError("");
      const quoteParts = quote.split("\n\n");
      const htmlContent = `
        <p class="quote">${quoteParts[0]}</p>
        ${quoteParts[1] ? `<p class="attribution">${quoteParts[1]}</p>` : ""}
      `;
      const response = await fetch("/api/generate-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ htmlContent, width: 800, height: 400 }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `faith-post-${new Date().toISOString().slice(0, 10)}.png`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to download post.");
      console.error("Download error:", err);
    } finally {
      setIsDownloading(false);
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(quote);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FiLoader className="animate-spin text-4xl text-primary" />
      </div>
    );
  }

  if (!sermon) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Sermon not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Header */}
        <header className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-primary hover:text-primary-light mb-6 transition"
          >
            <FiArrowLeft className="mr-2" />
            Back to Sermons
          </button>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {sermon.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {sermon.speaker && <span>By {sermon.speaker}</span>}
            </div>
          </div>
        </header>

        {/* Controls */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            Color Scheme
            <div>
              <h2 className="font-medium text-gray-700 mb-3">Color Theme</h2>
              <div className="flex gap-3">
                {["light", "dark"].map((scheme) => (
                  <button
                    key={scheme}
                    onClick={() => setColorScheme(scheme as "light" | "dark")}
                    className={`
      px-4 py-2 rounded-full text-sm flex items-center gap-2 capitalize transition-all
      border ${
        colorScheme === scheme
          ? "border-primary bg-primary text-white shadow-md"
          : "border-gray-200 hover:border-gray-300 bg-white text-gray-700"
      }
      
    `}
                    aria-label={`Set ${scheme} theme`}
                    aria-pressed={colorScheme === scheme}
                  >
                    {colorScheme === scheme ? (
                      <FaCheck size={14} className="flex-shrink-0" />
                    ) : (
                      <div className="w-[14px] h-[14px] flex-shrink-0" />
                    )}
                    <span>{scheme}</span>
                    {scheme === "dark" && (
                      <span className="ml-1 opacity-70">
                        <FaMoon size={12} />
                      </span>
                    )}
                    {scheme === "light" && (
                      <span className="ml-1 opacity-70">
                        <FaSun size={12} />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div> */}

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`mt-6 flex items-center justify-center px-6 py-3 rounded-lg transition
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
                Generating...
              </>
            ) : (
              "Generate social media post"
            )}
          </button>
        </div>

        {/* Generated Content */}
        {quote && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Post Preview */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Post Preview
              </h2>

              <div
                ref={postRef}
                className={`relative rounded-xl overflow-hidden shadow-lg aspect-[1/1] flex items-center justify-center p-8 text-center
                  bg-white text-gray-900
                `}
                style={{
                  backgroundImage: "url(/background.jpg)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-primary/60"></div>
                {/* Mock Logo */}
                <Image
                  src="/logo-trans-crop.png"
                  alt="Church Logo"
                  className="absolute top-4 left-4 w-12 h-12 sm:w-12 sm:h-12 object-contain z-3"
                  width={32}
                  height={32}
                />
                <Image
                  src="/pjakes.jpeg"
                  width={100}
                  height={100}
                  alt="Pastor"
                  className="absolute bottom-4 right-4 w-24 h-24 sm:w-26 sm:h-26 rounded-full object-cover z-3"
                />
                <div
                  className={`absolute inset-0 ${
                    imageUrl ? "bg-black/50" : "bg-primary/10"
                  }`}
                ></div>
                <div
                  className={`relative z-10 max-w-md ${
                    imageUrl
                      ? "text-white"
                      : colorScheme === "dark"
                      ? "text-white"
                      : "text-gray-900"
                  }`}
                >
                  <p className="text-2xl font-medium mb-6 leading-relaxed">
                    {quote.split("\n\n")[0]}
                  </p>
                  {quote.split("\n\n")[1] && (
                    <p className="text-lg opacity-90">
                      {quote.split("\n\n")[1]}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={downloadPost}
                  className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/90 text-white rounded-lg transition"
                >
                  {isDownloading ? (
                    <FiLoader className="animate-spin" />
                  ) : (
                    <>
                      <FiDownload />
                      Download
                    </>
                  )}
                </button>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                >
                  {copied ? <FiCheck className="text-green-500" /> : <FiCopy />}
                  {copied ? "Copied!" : "Copy Text"}
                </button>
              </div>
            </div>

            {/* Post Text */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Post Content
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-line">
                {quote}
              </div>
              <div className="mt-4">
                <h3 className="font-medium text-gray-700 mb-2">
                  Suggested Hashtags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "#Faith",
                    "#Bible",
                    "#Christian",
                    `#${sermon.speaker?.replace(" ", "")}`,
                    "#Inspiration",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

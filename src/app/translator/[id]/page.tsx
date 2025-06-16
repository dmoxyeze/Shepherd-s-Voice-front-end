"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiLoader, FiArrowLeft, FiCopy } from "react-icons/fi";

export default function Translator() {
  const { id } = useParams();
  const router = useRouter();
  const [sermon, setSermon] = useState({
    title: "",
    text: "",
    speaker: "",
    date: "",
  });
  const [language, setLanguage] = useState("Spanish");
  const [translation, setTranslation] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);

  const languages = [
    { value: "Igbo", label: "Igbo" },
    { value: "Hausa", label: "Hausa" },
    { value: "Yoruba", label: "Yoruba" },
    { value: "Spanish", label: "Español" },
    { value: "French", label: "Français" },
    { value: "German", label: "Deutsch" },
    { value: "Chinese", label: "中文" },
    { value: "Arabic", label: "العربية" },
  ];

  useEffect(() => {
    async function fetchSermon() {
      try {
        setIsLoading(true);
        const data = {
          title: "The Power of Faith",
          text: "Faith is the assurance of things hoped for, the conviction of things not seen. Through faith we understand that the universe was created by the word of God. True faith transforms our lives and gives us strength to overcome challenges.",
          speaker: "Pastor John Smith",
          date: "2023-11-12",
          scripture: "Hebrews 11:1-3",
        };
        setSermon(data);
      } catch (error) {
        console.error("Error fetching sermon:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSermon();
  }, [id]);

  async function handleTranslate() {
    try {
      setIsTranslating(true);
      setTranslation("");

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock translation - replace with actual API call
      const mockTranslations: Record<string, string> = {
        Spanish:
          "La fe es la certeza de lo que se espera, la convicción de lo que no se ve. Por la fe entendemos que el universo fue creado por la palabra de Dios... La fe verdadera transforma nuestras vidas y nos da fuerza para superar los desafíos...",
        French:
          "La foi est une ferme assurance des choses qu'on espère, une démonstration de celles qu'on ne voit pas. Par la foi, nous comprenons que l'univers a été formé par la parole de Dieu... La vraie foi transforme nos vies et nous donne la force de surmonter les défis...",
        German:
          "Glaube ist die feste Zuversicht auf das, was man hofft, die Überzeugung von dem, was man nicht sieht. Durch den Glauben verstehen wir, dass das Universum durch Gottes Wort geschaffen wurde... Wahrer Glaube verwandelt unser Leben und gibt uns die Kraft, Herausforderungen zu überwinden...",
        Chinese:
          "信就是所望之事的实底，是未见之事的确据。我们因着信，就知道诸世界是藉神的话造成的... 真正的信心会改变我们的生活，并给我们力量去克服挑战...",
        Arabic:
          "الإيمان هو الثقة بما يُرجى والإيقان بأمور لا تُرى. بالإيمان نفهم أن الكون خُلق بكلمة الله... الإيمان الحقيقي يغير حياتنا ويعطينا القوة للتغلب على التحديات...",
      };

      setTranslation(mockTranslations[language] || "Translation not available");
    } catch (error) {
      console.error("Translation failed:", error);
    } finally {
      setIsTranslating(false);
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(translation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FiLoader className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition"
        >
          <FiArrowLeft className="mr-2" />
          Back to Sermons
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {sermon.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
              {sermon.speaker && <span>By {sermon.speaker}</span>}
            </div>
            <p className="text-gray-700 whitespace-pre-line">{sermon.text}</p>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Language
                </label>
                <div className="relative">
                  {/* <FiGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /> */}
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    disabled={isTranslating}
                  >
                    {languages.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label} ({lang.value})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleTranslate}
                  disabled={isTranslating}
                  className={`px-6 py-2 rounded-md text-white transition flex items-center justify-center
                    ${
                      isTranslating
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                  {isTranslating ? (
                    <>
                      <FiLoader className="animate-spin mr-2" />
                      Translating...
                    </>
                  ) : (
                    "Translate"
                  )}
                </button>
              </div>
            </div>

            {translation && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Translation ({language})
                  </h2>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <FiCopy size={16} />
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <p className="text-gray-700 whitespace-pre-line">
                    {translation}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

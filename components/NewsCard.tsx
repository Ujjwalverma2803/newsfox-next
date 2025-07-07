"use client";

import { useState, useEffect } from "react";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

type Props = {
  article: {
    title: string;
    description: string;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    author: string;
    source: { name: string };
  };
};

export default function NewsCard({ article }: Props) {
  const { title, description, url, urlToImage, publishedAt, author, source } =
    article;

  const [imgError, setImgError] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [animate, setAnimate] = useState(false); // for animation trigger

  const handleFavorite = async () => {
    if (loading || isFavorited) return;
    setLoading(true);
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          url,
          imageUrl: urlToImage,
          source: source?.name,
        }),
      });
      if (res.ok) {
        setIsFavorited(true);
        setAnimate(true);
        setTimeout(() => setAnimate(false), 600); // reset animation after 600ms
      } else {
        throw new Error("Failed to favorite");
      }
    } catch (error) {
      alert("Could not save favorite. Please login.");
    }
    setLoading(false);
  };

  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition duration-300 overflow-hidden relative border border-gray-200">
      {/* Source badge */}
      <span className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-semibold px-2 py-1 rounded shadow-sm z-10">
        {source?.name}
      </span>

      {/* Favorite Button - top-right over image */}

      {/* Conditional Image or Placeholder */}
      {urlToImage && !imgError ? (
        <img
          src={urlToImage}
          alt={title}
          onError={() => setImgError(true)}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400 italic font-semibold text-sm select-none">
          Image Not Available
        </div>
      )}

      {/* Content */}
      <div className="p-4 space-y-2 relative">
        <h2 className="text-lg font-bold text-gray-800 leading-snug line-clamp-2">
          {title}
        </h2>
        <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
        <p className="text-xs text-gray-400">
          By{" "}
          <span className="font-medium text-gray-500">
            {author || "Unknown"}
          </span>{" "}
          •{" "}
          {new Date(publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>

        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-2 text-sm font-medium bg-red-500 text-white px-4 py-1.5 rounded hover:bg-red-600 transition"
        >
          Read More →
        </a>
      </div>

      {/* Custom animation keyframe style in Tailwind config (or inline via style tag) */}
      <style jsx global>{`
        @keyframes pulse-scale {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.7;
          }
        }
        .animate-pulse-scale {
          animation: pulse-scale 0.6s ease-in-out forwards;
        }
      `}</style>
      <button
        onClick={handleFavorite}
        disabled={loading || isFavorited}
        aria-label={isFavorited ? "Favorited" : "Add to favorites"}
        title={isFavorited ? "Added to favorites" : "Add to favorites"}
        className={`
          absolute bottom-2 right-2 z-20 p-1 rounded-full bg-white bg-opacity-90 hover:bg-opacity-100
          transition disabled:opacity-50
          ${animate ? "animate-pulse-scale" : ""}
        `}
      >
        {loading ? (
          <svg
            className="animate-spin h-6 w-6 text-red-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            ></path>
          </svg>
        ) : isFavorited ? (
          <HeartSolid className="h-6 w-6 text-red-500" />
        ) : (
          <HeartOutline className="h-6 w-6 text-red-500" />
        )}
      </button>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

type Favorite = {
  id: string;
  title: string;
  url: string;
  imageUrl: string | null;
  source: string;
  addedAt: string;
};

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const res = await fetch("/api/favorites");
        if (!res.ok) throw new Error("Failed to fetch favorites");
        const data = await res.json();
        setFavorites(data.favorites);
      } catch (e) {
        const message = e instanceof Error ? e.message : "Something went wrong";
        setError(message);
      }
       finally {
        setLoading(false);
      }
    }
    fetchFavorites();
  }, []);

  if (loading) return <p>Loading favorites...</p>;
  if (error) return <p>Error: {error}</p>;

  if (favorites.length === 0)
    return <p>You have no favorite news articles yet.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Favorite News</h1>
      <ul className="space-y-4">
        {favorites.map((fav) => (
          <li key={fav.id} className="border rounded p-4 shadow-sm flex">
            {fav.imageUrl ? (
              <img
                src={fav.imageUrl}
                alt={fav.title}
                className="w-24 h-24 object-cover rounded mr-4"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded mr-4 text-gray-500 text-xs">
                No Image
              </div>
            )}
            <div>
              <a
                href={fav.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold text-red-600 hover:underline"
              >
                {fav.title}
              </a>
              <p className="text-sm text-gray-500">{fav.source}</p>
              <p className="text-xs text-gray-400">
                Added on {new Date(fav.addedAt).toLocaleDateString()}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

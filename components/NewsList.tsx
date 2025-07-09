"use client";

import { useEffect, useState } from "react";
import NewsCard from "./NewsCard";
import Spinner from "./Spinner";

type Article = {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  author: string;
  source: { name: string };
};

type Props = {
  category: string;
};

export default function NewsList({ category }: Props) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true); // initial loading
  const [loadingMore, setLoadingMore] = useState(false); // loading on "Load More"
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const pageSize = 12;

  const fetchNews = async (isLoadMore = false) => {
    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);

    setError(null);

    try {
      const apiKey = process.env.NEXT_PUBLIC_NEWS_APIKEY;
      const url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data && Array.isArray(data.articles)) {
        if (page === 1) {
          setArticles(data.articles);
        } else {
          setArticles((prev) => [...prev, ...data.articles]);
        }
        setTotalResults(data.totalResults || 0);
      } else {
        setArticles([]);
        setTotalResults(0);
        setError("No articles found.");
      }
    } catch (err) {
      console.error("Error fetching news:", err);
      setError("Failed to fetch news.");
      setArticles([]);
      setTotalResults(0);
    } finally {
      if (isLoadMore) setLoadingMore(false);
      else setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchNews(false); // initial load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  useEffect(() => {
    if (page > 1) fetchNews(true); // load more
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const loadMore = () => {
    if (articles.length < totalResults) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <>
      {loading && <Spinner />}

      {error && (
        <p className="text-center text-red-500 my-8 font-semibold">{error}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array.isArray(articles) &&
          articles.map((article) => (
            <NewsCard key={article.url} article={article} />
          ))}
      </div>

      {!loading && !error && articles.length < totalResults && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
          >
            {loadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </>
  );
}

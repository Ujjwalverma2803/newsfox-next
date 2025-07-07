import NewsList from "@/components/NewsList";

export default function HomePage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Top General Headlines</h1>
      <NewsList category="general" />
    </div>
  );
}

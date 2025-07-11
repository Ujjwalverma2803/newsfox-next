// app/[category]/page.tsx
import NewsList from "@/components/NewsList";

type Props = {
  params: Promise<{ category: string }>;
};

export default async function CategoryPage({ params }: Props) {
  const resolvedParams = await params;
  const { category } = resolvedParams;

  const allowedCategories = [
    "world",
    "nation",
    "business",
    "technology",
    "entertainment",
    "sports",
    "science",
    "health",
  ];

  if (!allowedCategories.includes(category)) {
    return <div>Category not found</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6 capitalize">
        Top {category} Headlines
      </h1>
      <NewsList category={category} />
    </div>
  );
}

export default async function ResultsSubcategoryPage({
  params,
}: {
  params: Promise<{
    locale: string;
    year: string;
    category: string;
    subcategory: string;
  }>;
}) {
  const { year, category, subcategory } = await params;

  return (
    <div style={{ background: "white", padding: "2rem" }}>{subcategory}</div>
  );
}

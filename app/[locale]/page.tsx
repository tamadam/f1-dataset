import { routing } from "@/i18n/routing";

export const revalidate = 3600;
export const dynamic = "force-static";

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) => ({ locale }));
}
const RootPage = () => {
  return <div>RootPage</div>;
};

export default RootPage;

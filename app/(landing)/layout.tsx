import HeaderSimple from "@/app/components/Header/HeaderSimple";

export default function LandingPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <HeaderSimple />
      <main>{children}</main>
    </>
  );
}

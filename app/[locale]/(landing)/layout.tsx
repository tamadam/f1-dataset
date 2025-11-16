import HeaderSimple from "@/app/components/Header/HeaderSimple/HeaderSimple";

export default function LandingPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <HeaderSimple />
      <div>{children}</div>
    </>
  );
}

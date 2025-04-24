import HeaderFull from "@/app/components/Header/HeaderFull/HeaderFull";

/*TODO: generateMetadata*/

export default function LandingPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <HeaderFull />
      <main>{children}</main>
    </>
  );
}

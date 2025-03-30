import HeaderSimple from "@/app/components/Header/HeaderSimple/HeaderSimple";
import HeaderFull from "../components/Header/HeaderFull/HeaderFull";

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

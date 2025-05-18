import HeaderFull from "@/app/components/Header/HeaderFull/HeaderFull";

export default async function MainPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <HeaderFull />
      <div>{children}</div>
    </>
  );
}

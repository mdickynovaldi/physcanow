import { Footer } from "@/components/shared/footer";
import Header from "@/components/shared/header";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex-1 wrapper">
      <Header />
      {children}
      <Footer />
    </main>
  );
}

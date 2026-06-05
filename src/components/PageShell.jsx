import TopBar from "@/components/TopBar.jsx";
import Header from "@/components/Header.jsx";
import Footer from "@/components/Footer.jsx";

export default function PageShell({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

import "../styles/globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Federated Smart Grid Simulator",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Navbar />
          <main className="mt-10">{children}</main>
        </div>
      </body>
    </html>
  );
}

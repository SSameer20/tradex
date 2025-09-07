import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import RequireAuth from "./_auth";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full max-h-svh px-2 sm:px-5 py-5 flex flex-col items-center bg-background transition-colors overflow-hidden">
      <Navigation />
      <RequireAuth>
        <div className="flex w-full h-full">
          <Sidebar />
          {children}
        </div>
      </RequireAuth>
    </div>
  );
}

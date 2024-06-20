import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiCurl } from "react-icons/si";
import { UserNav } from "@/components/custom_ui/DropDownUser";
import { NavMenu } from "@/components/custom_ui/NavBar";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "URL Shortner",
  description: "Created By @sudipnext",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <AuthProvider>
        <body className={inter.className}>
          <div className="flex-col md:flex mb-20">
            <div className="border-b">
              <div className="flex h-16 items-center px-4">
                <a href="/" className="flex items-center">
                  <SiCurl /> <span>Shorty</span>
                </a>
                <div className="mx-6" />
                <NavMenu />
                <div className="ml-auto flex items-center space-x-4">
                  <UserNav />
                </div>
              </div>
            </div>
            {children}
          </div>
        </body>
      </AuthProvider>
    </html>
  );
}

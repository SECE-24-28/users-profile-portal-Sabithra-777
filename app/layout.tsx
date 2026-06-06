import type { Metadata } from "next";
import "./globals.css";
import { ApolloWrapper } from "@/lib/apollo-client";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Student Profile Portal",
  description: "Manage student profiles",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ApolloWrapper>
            {children}
            <Toaster position="top-right" />
          </ApolloWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}

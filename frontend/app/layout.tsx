import type { Metadata } from "next";
import { Roboto, Open_Sans } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "./Web3Provider";
import { Toaster } from "@/components/ui/toaster";
import { CustomLensProvider } from "./CustomLensProvider";
import { ApolloProvider } from "@apollo/client";
import client from "./apolloclient";
import CustomApolloProvider from "./apolloProvider";

// Configure Roboto font
const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "700"], // Specify font weights
  style: ["normal", "italic"], // Include italic styles if needed
});

// Configure Open Sans font (or another sans-serif font)
const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"], // Load weights for flexibility
});

export const metadata: Metadata = {
  title: "Savr",
  description: "Decentralized Rosca",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${openSans.variable} antialiased`} // Apply both fonts globally
      >
        <CustomLensProvider>
          <CustomApolloProvider>{children}</CustomApolloProvider>
        </CustomLensProvider>
        <Toaster />
      </body>
    </html>
  );
}

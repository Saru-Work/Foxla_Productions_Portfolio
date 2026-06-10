import type { Metadata } from "next";
import {
  Inter,
  League_Gothic,
  Archivo_Black,
  Fjalla_One,
  Bebas_Neue,
} from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fjallaOne = Fjalla_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-fjalla",
});

const leagueGothic = League_Gothic({
  subsets: ["latin"],
  variable: "--font-bebas", // Kept variable name so you don't have to change your css vars
});

const bebas = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-bebas",
  weight: "400",
});

const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-archivo-black",
});

export const metadata: Metadata = {
  title: "Foxla Productions",
  description: "Creative Agency",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${leagueGothic.variable} ${archivoBlack.variable} ${fjallaOne.variable}`}
      suppressHydrationWarning
    >
      <body
        className={`${bebas.className} tracking-[1px] antialiased bg-background text-text`}
        suppressHydrationWarning
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

import { Bricolage_Grotesque, Inter } from "next/font/google";

/** Swap fonts per client here. Variables are mapped in globals.css. */
export const displayFont = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display-face",
  weight: ["600", "700", "800"],
  display: "swap",
});

export const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body-face",
  display: "swap",
});

import type { Metadata } from "next";
import { CheckoutFlow } from "@/components/order/CheckoutFlow";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return <CheckoutFlow />;
}

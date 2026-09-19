import type { Metadata } from "next";
import { CartFlow } from "@/components/order/CartFlow";

export const metadata: Metadata = { title: "Your Cart" };

export default function CartPage() {
  return <CartFlow />;
}

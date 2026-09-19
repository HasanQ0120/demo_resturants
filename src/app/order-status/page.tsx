import type { Metadata } from "next";
import { OrderStatusTracker } from "@/components/order/OrderStatusTracker";

export const metadata: Metadata = { title: "Track your order" };

export default function OrderStatusPage() {
  return <OrderStatusTracker />;
}

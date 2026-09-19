import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMenuItem } from "@/data/menu";
import { CustomizeFlow } from "@/components/order/CustomizeFlow";

export const metadata: Metadata = { title: "Customize your order" };

export default async function CustomizeOrderPage({ params }: { params: Promise<{ itemId: string }> }) {
  const { itemId } = await params;
  const item = getMenuItem(itemId);
  if (!item) notFound();
  return <CustomizeFlow item={item} />;
}

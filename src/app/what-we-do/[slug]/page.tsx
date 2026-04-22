import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { services, getServiceBySlug } from "@/content/services";
import { ServiceDetailTemplate } from "@/components/sections/ServiceDetailTemplate";

type RouteParams = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: "Service not found" };
  return {
    title: service.shortTitle,
    description: service.shortDescription,
  };
}

export default async function ServiceDetailPage({ params }: RouteParams) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();
  return <ServiceDetailTemplate service={service} />;
}

import type { Metadata } from "next";
import StoreLocation from "@/components/home/StoreLocation";
import ContactForm from "@/components/product/ContactForm";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata: Metadata = { title: "Contact Us" };

export default function ContactPage() {
  return (
    <div className="section-ivory min-h-screen">
      <div className="py-20 px-4 md:px-8">
        <div className="mx-auto max-w-3xl">
          <SectionHeading eyebrow="Get in Touch" title="Contact Us" tone="ivory" />
          <ContactForm />
        </div>
      </div>
      <StoreLocation />
    </div>
  );
}

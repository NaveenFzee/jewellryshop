import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <div className="section-ivory min-h-screen py-20 px-4 md:px-8">
      <div className="mx-auto max-w-3xl prose-headings:font-display">
        <h1 className="font-display text-4xl text-ink mb-6">Privacy Policy</h1>
        <p className="text-ink/60 text-sm mb-8">
          This is placeholder policy text — replace with your shop&apos;s actual, legally reviewed privacy
          policy before launch. Do not publish this page as-is.
        </p>
        <div className="space-y-6 text-ink/75 leading-relaxed">
          <p>
            {siteConfig.name} collects the information you provide through our enquiry and custom-order forms
            (name, phone number, WhatsApp number, and your requirements) solely to respond to your enquiry and
            provide our services.
          </p>
          <p>
            We do not sell or share your personal information with third parties for marketing purposes. Data
            is stored securely and retained only as long as necessary to serve you.
          </p>
          <p>
            For any questions about how your data is handled, contact us at {siteConfig.email}.
          </p>
        </div>
      </div>
    </div>
  );
}

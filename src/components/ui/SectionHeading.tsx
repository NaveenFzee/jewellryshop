interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "ink" | "ivory";
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  tone = "ink",
}: SectionHeadingProps) {
  const isCenter = align === "center";
  return (
    <div className={`mb-12 ${isCenter ? "text-center mx-auto max-w-2xl" : "text-left"}`}>
      <div className={`flex items-center gap-3 mb-4 ${isCenter ? "justify-center" : ""}`}>
        <span className="gold-divider" />
        <span className="label-stamp">{eyebrow}</span>
        <span className="gold-divider" />
      </div>
      <h2
        className={`text-3xl md:text-4xl lg:text-5xl font-medium text-balance ${
          tone === "ink" ? "text-ivory" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-4 font-body text-sm md:text-base ${tone === "ink" ? "text-ivory/70" : "text-ink/70"}`}>
          {description}
        </p>
      )}
    </div>
  );
}

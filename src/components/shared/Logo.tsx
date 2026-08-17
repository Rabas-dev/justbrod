import Image from "next/image";

const sources = {
  orange: "/brod-orange.svg",
  cream: "/brod-light.svg",
  charcoal: "/brod-charcoal.svg",
};

export function Logo({
  variant = "orange",
  height = 24,
  className,
}: {
  variant?: keyof typeof sources;
  height?: number;
  className?: string;
}) {
  const width = Math.round(height * (1950 / 881));
  return (
    <Image
      src={sources[variant]}
      alt="bröd"
      width={width}
      height={height}
      priority
      className={className}
    />
  );
}

import Image from "next/image";

interface IconProps {
  name: string;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
}

export function Icon({ name, alt, className, width = 24, height = 24 }: IconProps) {
  return (
    <Image
      src={`/icon-${name}.svg`}
      alt={alt || name}
      width={width}
      height={height}
      className={className}
    />
  );
}

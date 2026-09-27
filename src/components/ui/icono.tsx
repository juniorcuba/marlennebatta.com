import Image from "next/image";

type Props = {
  nombre: string;
  ancho: number;
  alto: number;
  className?: string;
  /** Vacío si el icono es decorativo (lo normal: siempre va junto a un texto). */
  alt?: string;
};

/** SVG de /public/icons servido tal cual (Next no optimiza SVG). */
export function Icono({ nombre, ancho, alto, className, alt = "" }: Props) {
  return (
    <Image
      src={`/icons/${nombre}.svg`}
      width={ancho}
      height={alto}
      alt={alt}
      unoptimized
      className={className}
    />
  );
}

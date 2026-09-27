import { getImageProps } from "next/image";

type Fuente = { src: string; width: number; height: number; sizes: string };

type Props = {
  alt: string;
  /** Recorte del artboard móvil (por debajo de xl). */
  movil: Fuente;
  /** Recorte del artboard de escritorio (xl, 1280 px en adelante). */
  escritorio: Fuente;
  className?: string;
  quality?: number;
  prioritaria?: boolean;
};

/*
 * Una imagen con un recorte distinto para móvil y escritorio (art direction).
 * Con <picture> el navegador solo descarga la que corresponde; con dos <Image>
 * ocultos por CSS, la prioritaria se bajaría dos veces.
 */
export function ImagenAdaptable({ alt, movil, escritorio, className, quality = 75, prioritaria = false }: Props) {
  const comunes = { alt, quality, ...(prioritaria ? { loading: "eager" as const, fetchPriority: "high" as const } : {}) };
  const {
    props: { srcSet: srcSetEscritorio, sizes: sizesEscritorio },
  } = getImageProps({ ...comunes, ...escritorio });
  const {
    props: { srcSet: srcSetMovil, ...resto },
  } = getImageProps({ ...comunes, ...movil });

  return (
    // display: contents → el <img> se comporta como hijo directo del contenedor
    // (flex, grid o absoluto), igual que un <Image> normal.
    <picture className="contents">
      <source media="(min-width: 1280px)" srcSet={srcSetEscritorio} sizes={sizesEscritorio} />
      {/* eslint-disable-next-line jsx-a11y/alt-text -- el alt llega en las props de getImageProps */}
      <img {...resto} srcSet={srcSetMovil} className={className} />
    </picture>
  );
}

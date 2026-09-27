import type { ReactNode } from "react";

type Props = {
  id?: string;
  /** Tramo inicial en azul; el resto va en negro, como en todo el diseño. */
  resaltado: string;
  children?: ReactNode;
  className?: string;
  /** line-height; por defecto 35.6/40 como casi todos los h2 del diseño. */
  interlineado?: string;
  /** font-size; por defecto 24 px en el móvil de 402 y 40 en el lienzo de 1920. */
  tamano?: string;
};

export function TituloSeccion({ id, resaltado, children, className = "", interlineado = "leading-[0.89]", tamano = "text-[clamp(1.5rem,1.235rem+1.054vw,2.5rem)]" }: Props) {
  return (
    <h2
      id={id}
      className={`font-display ${tamano} text-black ${interlineado} ${className}`}
    >
      <span className="text-azul">{resaltado}</span>
      {children ? <> {children}</> : null}
    </h2>
  );
}

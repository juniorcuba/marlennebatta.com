import type { ReactNode } from "react";

type Props = {
  id?: string;
  /** Tramo inicial en azul; el resto va en negro, como en todo el diseño. */
  resaltado: string;
  children?: ReactNode;
  className?: string;
  /** line-height; por defecto 35.6/40 como casi todos los h2 del diseño. */
  interlineado?: string;
};

export function TituloSeccion({ id, resaltado, children, className = "", interlineado = "leading-[0.89]" }: Props) {
  return (
    <h2
      id={id}
      className={`font-display text-[clamp(1.875rem,1.2rem+1.4vw,2.5rem)] text-black ${interlineado} ${className}`}
    >
      <span className="text-azul">{resaltado}</span>
      {children ? <> {children}</> : null}
    </h2>
  );
}

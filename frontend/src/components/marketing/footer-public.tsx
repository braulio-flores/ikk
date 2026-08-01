import Link from "next/link";
import { IkkLogo } from "@/components/logo";
import { CONTACT_EMAIL } from "@/lib/site";

export function FooterPublic() {
  return (
    <footer className="mt-20 border-t border-[var(--ikk-line-soft)]">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <IkkLogo size={22} />
            <p className="mt-3 text-sm leading-relaxed text-[var(--ikk-fg-muted)]">
              Software a medida para empresas que necesitan herramientas que no
              existen en el mercado.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm sm:gap-16">
            <div>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ikk-fg-dim)]">
                Navegación
              </p>
              <ul className="space-y-2 text-[var(--ikk-fg-muted)]">
                <li>
                  <a href="/#servicios" className="hover:text-[var(--ikk-fg)]">
                    Servicios
                  </a>
                </li>
                <li>
                  <a href="/#productos" className="hover:text-[var(--ikk-fg)]">
                    Productos
                  </a>
                </li>
                <li>
                  <a href="/#proceso" className="hover:text-[var(--ikk-fg)]">
                    Proceso
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ikk-fg-dim)]">
                Contacto
              </p>
              <ul className="space-y-2 text-[var(--ikk-fg-muted)]">
                <li>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="break-all hover:text-[var(--ikk-fg)]"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-[var(--ikk-fg)]">
                    Cuéntanos tu proyecto
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-[var(--ikk-line-soft)] pt-6 text-[var(--ikk-fg-dim)] sm:flex-row sm:items-center sm:justify-between">
          <span className="font-mono text-xs uppercase tracking-widest">
            © {new Date().getFullYear()} IKK Solutions
          </span>
          <span className="text-xs">Hecho en México.</span>
        </div>
      </div>
    </footer>
  );
}

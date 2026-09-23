/* eslint-disable @next/next/no-img-element */
export function Navbar() {
  return (
    <nav className="border-b border-border bg-surface/60 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
        <a href="/" className="font-semibold tracking-tight">
          DevFolio
        </a>
        <a href="https://megadevs.site" target="_blank" rel="noreferrer">
          <img
            src="/mega.jpg"
            alt="Mega Devs"
            className="h-12 w-auto object-contain transition hover:opacity-80"
          />
        </a>
      </div>
    </nav>
  );
}

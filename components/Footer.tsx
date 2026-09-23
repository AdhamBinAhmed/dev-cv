/* eslint-disable @next/next/no-img-element */
export function Footer() {
  return (
    <footer className="mt-20 border-t border-border">
      <div className="mx-auto flex max-w-5xl items-center justify-center gap-3 px-5 py-8 text-center text-sm text-muted">
        <span>Developed by</span>
        <a href="https://megadevs.site" target="_blank" rel="noreferrer">
          <img
            src="/mega.jpg"
            alt="Mega Devs"
            className="h-14 w-auto object-contain transition hover:opacity-80"
          />
        </a>
      </div>
    </footer>
  );
}

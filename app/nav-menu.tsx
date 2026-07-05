import Link from "next/link";

export function NavMenu() {
  return (
    <aside className="w-64 shrink-0 border-r border-black/[.08] dark:border-white/[.145]">
      <nav className="p-4">
        <Link href="/docs" className="text-sm hover:underline">
          Docs
        </Link>
      </nav>
    </aside>
  );
}

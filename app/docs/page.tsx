import Link from "next/link";
import { listDocs } from "@/app/lib/docs-store";

export default function DocsPage() {
  const docs = listDocs();

  return (
    <div className="flex flex-col gap-6 p-8 max-w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Docs</h1>
        <Link
          href="/docs/new"
          className="rounded bg-foreground px-4 py-2 text-sm text-background"
        >
          New Doc
        </Link>
      </div>

      {docs.length === 0 ? (
        <p className="text-sm text-black/60 dark:text-white/60">
          No docs yet.
        </p>
      ) : (
        <ul className="divide-y divide-black/[.08] dark:divide-white/[.145]">
          {docs.map((doc) => (
            <li key={doc.id} className="py-3">
              <Link
                href={`/docs/${doc.id}`}
                className="block truncate font-medium hover:underline"
              >
                {doc.title}
              </Link>
              <p className="text-sm text-black/60 dark:text-white/60">
                by {doc.author}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

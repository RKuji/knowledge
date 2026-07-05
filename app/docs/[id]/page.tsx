import Link from "next/link";
import { notFound } from "next/navigation";
import { getDoc } from "@/app/lib/docs-store";
import { deleteDocAction } from "@/app/lib/actions";

export default async function DocPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const doc = getDoc(id);

  if (!doc) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 p-8 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{doc.title}</h1>
        <div className="flex gap-2">
          <Link
            href={`/docs/${doc.id}/edit`}
            className="rounded border border-black/[.08] dark:border-white/[.145] px-3 py-1.5 text-sm"
          >
            Edit
          </Link>
          <form action={deleteDocAction}>
            <input type="hidden" name="id" value={doc.id} />
            <button
              type="submit"
              className="rounded border border-black/[.08] dark:border-white/[.145] px-3 py-1.5 text-sm"
            >
              Delete
            </button>
          </form>
        </div>
      </div>
      <p className="text-sm text-black/60 dark:text-white/60">
        by {doc.author}
      </p>
      <p className="whitespace-pre-wrap">{doc.content}</p>
      <Link href="/docs" className="text-sm hover:underline">
        ← Back to Docs
      </Link>
    </div>
  );
}

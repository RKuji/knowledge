import Link from "next/link";
import { notFound } from "next/navigation";
import { getDoc } from "@/app/lib/docs-store";
import { updateDocAction } from "@/app/lib/actions";

export default async function EditDocPage({
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
      <h1 className="text-xl font-semibold">Edit Doc</h1>
      <form action={updateDocAction} className="flex flex-col gap-4">
        <input type="hidden" name="id" value={doc.id} />
        <label className="flex flex-col gap-1 text-sm">
          Title
          <input
            type="text"
            name="title"
            defaultValue={doc.title}
            required
            className="rounded border border-black/[.08] dark:border-white/[.145] px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Content
          <textarea
            name="content"
            defaultValue={doc.content}
            required
            rows={8}
            className="rounded border border-black/[.08] dark:border-white/[.145] px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Author
          <input
            type="text"
            name="author"
            defaultValue={doc.author}
            required
            className="rounded border border-black/[.08] dark:border-white/[.145] px-3 py-2"
          />
        </label>
        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded bg-foreground px-4 py-2 text-sm text-background"
          >
            Save
          </button>
          <Link
            href={`/docs/${doc.id}`}
            className="rounded border border-black/[.08] dark:border-white/[.145] px-4 py-2 text-sm"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

import Link from "next/link";
import { createDocAction } from "@/app/lib/actions";
import { DocContentField } from "@/app/docs/doc-content-field";

export default function NewDocPage() {
  return (
    <div className="flex flex-col gap-6 p-8 max-w-full">
      <h1 className="text-xl font-semibold">New Doc</h1>
      <form action={createDocAction} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Title
          <input
            type="text"
            name="title"
            required
            className="rounded border border-black/[.08] dark:border-white/[.145] px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Content
          <DocContentField name="content" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Author
          <input
            type="text"
            name="author"
            required
            className="rounded border border-black/[.08] dark:border-white/[.145] px-3 py-2"
          />
        </label>
        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded bg-foreground px-4 py-2 text-sm text-background"
          >
            Create
          </button>
          <Link
            href="/docs"
            className="rounded border border-black/[.08] dark:border-white/[.145] px-4 py-2 text-sm"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export type Doc = {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
};

type DocInput = {
  title: string;
  content: string;
  author: string;
};

const docs: Doc[] = [];

export function listDocs(): Doc[] {
  return [...docs].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getDoc(id: string): Doc | undefined {
  return docs.find((doc) => doc.id === id);
}

export function createDoc(data: DocInput): Doc {
  const now = new Date().toISOString();
  const doc: Doc = {
    id: crypto.randomUUID(),
    ...data,
    createdAt: now,
    updatedAt: now,
  };
  docs.push(doc);
  return doc;
}

export function updateDoc(id: string, data: DocInput): Doc | undefined {
  const doc = docs.find((d) => d.id === id);
  if (!doc) return undefined;
  doc.title = data.title;
  doc.content = data.content;
  doc.author = data.author;
  doc.updatedAt = new Date().toISOString();
  return doc;
}

export function deleteDoc(id: string): void {
  const index = docs.findIndex((d) => d.id === id);
  if (index !== -1) docs.splice(index, 1);
}

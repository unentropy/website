// Global author configuration - compatible with starlight-blog plugin
export interface Author {
  name: string;
  title?: string;
  picture?: string;
  url?: string;
}

export const authors: Record<string, Author> = {
  mat: {
    name: "Mateusz Tymek",
    title: "CTO & Co-founder at Cleeng",
    url: "https://github.com/mtymek",
  },
};

// Helper to resolve author from string ID or inline object
export function resolveAuthor(
  author: string | Author | undefined
): Author | undefined {
  if (!author) return undefined;
  if (typeof author === "string") {
    return authors[author];
  }
  return author;
}

// Helper to resolve multiple authors
export function resolveAuthors(
  authorsInput: string | Author | (string | Author)[] | undefined
): Author[] {
  if (!authorsInput) return [];
  const authorArray = Array.isArray(authorsInput) ? authorsInput : [authorsInput];
  return authorArray
    .map((a) => resolveAuthor(a))
    .filter((a): a is Author => a !== undefined);
}

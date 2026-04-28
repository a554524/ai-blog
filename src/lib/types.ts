export type PostFrontmatter = {
  title: string;
  slug: string;
  date: string;
  updated?: string;
  category?: string;
  tags?: readonly string[];
  summary?: string;
  cover?: string;
  draft?: boolean;
  featured?: boolean;
};

export type Post = PostFrontmatter & {
  content: string;
  readingMinutes: number;
  wordCount: number;
};

export type ToolFrontmatter = {
  slug: string;
  name: string;
  logo?: string;
  url: string;
  category: string;
  tags?: readonly string[];
  freeTier: string;
  pricing?: string;
  rating?: number;
  featured?: boolean;
  reviewPost?: string;
  updatedAt: string;
};

export type Tool = ToolFrontmatter & {
  description: string;
};

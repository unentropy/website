import { defineCollection } from "astro:content";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Blog author schema - compatible with starlight-blog plugin
const blogAuthorSchema = z.object({
  name: z.string().min(1),
  title: z.string().optional(),
  picture: z.string().optional(),
  url: z.string().url().optional(),
});

// Blog collection schema - 100% compatible with starlight-blog plugin
const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      // Required fields
      title: z.string(),
      date: z.coerce.date(),

      // Optional fields - all matching starlight-blog
      authors: z
        .union([
          z.string(),
          blogAuthorSchema,
          z.array(z.union([z.string(), blogAuthorSchema])),
        ])
        .optional(),
      excerpt: z.string().optional(),
      tags: z.string().array().optional(),
      cover: z
        .union([
          z.object({
            alt: z.string(),
            image: z.union([image(), z.string()]),
          }),
          z.object({
            alt: z.string(),
            dark: z.union([image(), z.string()]),
            light: z.union([image(), z.string()]),
          }),
        ])
        .optional(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      lastUpdated: z.coerce.date().optional(),
      metrics: z
        .object({
          readingTime: z.number().optional(),
          words: z.number().optional(),
        })
        .optional(),
    }),
});

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
  blog,
};

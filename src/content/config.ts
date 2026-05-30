import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
  }),
});

const resourceItem = z.object({
  title: z.string(),
  description: z.string(),
  url: z.string(),
});

const tracks = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    source: z.string(),
    estimatedHours: z.number(),
    domains: z.array(z.object({ name: z.string(), percent: z.number() })).optional(),
  }),
});

const trackModules = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    order: z.number(),
    duration: z.string().optional(),
    domain: z.string().optional(),
    officialResources: z.array(resourceItem).optional(),
    complementaryResources: z.array(resourceItem).optional(),
    exercises: z.array(z.string()).optional(),
  }).passthrough(),
});

export const collections = {
  blog,
  tracks,
  'track-modules': trackModules,
  'blog-en': blog,
  'tracks-en': tracks,
  'track-modules-en': trackModules,
};

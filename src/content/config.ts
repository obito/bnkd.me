import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
  schema: ({ image }) => z.object({
    title: z.string(),
    imageSrc: image(), // Use the image() helper for validation and processing
    imageAlt: z.string(),
    slug: z.string().optional(), // Temporarily make slug optional for testing
    order: z.number(),
    description: z.string().optional(), // Add description field
    services: z.array(z.string()).optional(), // Add services field (array of strings)
    tools: z.array(z.string()).optional(),    // Add tools field (array of strings)
    sitePreviewUrl: z.string().url().optional(), // Add site preview URL field
    field: z.array(z.string()).optional(),
    year: z.string().optional(),
  }),
});

export const collections = {
  'projects': projectsCollection,
}; 
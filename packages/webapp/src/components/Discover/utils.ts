import { z } from 'zod';

export const dlnewsSchema = z.array(
  z.object({
    id: z.string(),
    link: z.string(),
    title: z.string(),
    description: z.string(),
    published: z.string(),
  })
);
export type Dlnews = z.infer<typeof dlnewsSchema>;

export const topProtocolsSchema = z.object({
  protocols: z.array(
    z.object({
      category: z.string(),
      name: z.string(),
      logo: z.string(),
      url: z.string(),
    })
  ),
});

export type TopProtocols = z.infer<typeof topProtocolsSchema>;

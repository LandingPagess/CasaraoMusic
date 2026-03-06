import { z, defineCollection } from 'astro:content';

const eventosCollection = defineCollection({
  type: 'content',
  schema: z.object({
    artista: z.string(),
    data: z.string(),
    diaSemana: z.string(),
    estilo: z.string(),
    descricao: z.string(),
    tag: z.string().optional().nullable(),
    destaque: z.boolean().default(false),
    thumbnail: z.string().optional().nullable(),
  }),
});

export const collections = {
  eventos: eventosCollection,
};

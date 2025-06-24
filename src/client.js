import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: import.meta.env.VITE_BECKSQUARE_PUBLIC_ID, // Use VITE_ 
  dataset: 'production',
  apiVersion: '2025-04-01',
  useCdn: true,
  token:import.meta.env.VITE_BECKSQUARE_API_KEY,
});

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);
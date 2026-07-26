import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "du9e045z",
  dataset: "production",
  apiVersion: "2026-05-15",
  useCdn: false,
});
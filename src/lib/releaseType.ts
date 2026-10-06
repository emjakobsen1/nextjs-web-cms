import type { ReleaseType } from "@/sanity/queries";

export const RELEASE_TYPE_LABELS: Record<ReleaseType, string> = {
  album: "Album",
  ep: "EP",
  single: "Single",
};

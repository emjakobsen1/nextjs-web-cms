import { client } from "@/sanity/client";
import type { SanityImageSource } from "@sanity/image-url";
import type { PortableTextBlock } from "next-sanity";

export type SanityImage = SanityImageSource & { asset?: { _ref: string } };

export type FeaturedRelease = {
  title: string;
  slug: { current: string };
  image?: SanityImage;
};

export type ReleaseType = "album" | "ep" | "single";

export type ReleaseSummary = {
  _id: string;
  title: string;
  slug: { current: string };
  image: SanityImage;
  length?: string;
  releaseDate?: string;
  releaseType?: ReleaseType;
  project?: { title: string; slug: { current: string } } | null;
};

export type ReleaseMediaItem = {
  mediaType: "image" | "video";
  image?: SanityImage;
  width?: number;
  height?: number;
  videoUrl?: string;
  alt?: string;
  isTitleImage?: boolean;
};

export type Sponsor = {
  name: string;
  image: SanityImage;
  link: string;
};

export type ReleaseDetail = ReleaseSummary & {
  description?: string;
  personnel?: string[];
  links?: SocialLink[];
  project?: { title: string; slug: { current: string } };
  media?: ReleaseMediaItem[];
  finalNote?: string;
  sponsors?: Sponsor[];
};

export type Project = {
  _id: string;
  title: string;
  slug: { current: string };
  coverImage?: SanityImage;
};

export type ProjectDetail = {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  coverImage?: SanityImage;
  releases: ReleaseSummary[];
  agenda: AgendaItem[];
  socialLinks?: SocialLink[];
};

export type NewsItem = {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  image?: SanityImage;
  imageWidth?: number;
  imageHeight?: number;
  mainText?: PortableTextBlock[];
};

export type AgendaItem = {
  _id: string;
  date: string;
  title: string;
  location: string;
  link?: string;
};

export type Biography = {
  image: SanityImage;
  pullQuote?: string;
  description: PortableTextBlock[];
};

export type Press = {
  quotes?: { quote: string; source?: string }[];
  pressKit?: { asset?: { url: string; originalFilename: string } };
};

export type SocialLink = { platform: string; url: string };

export type Contact = {
  email: string;
  socialLinks?: SocialLink[];
};

const FEATURED_RELEASE_QUERY = `*[_type == "release" && featured == true] | order(_updatedAt desc)[0]{
  title, slug, image
}`;

const PROJECTS_QUERY = `*[_type == "project"] | order(order asc){
  _id, title, slug, coverImage
}`;

const NEWS_QUERY = `*[_type == "newsPost"] | order(publishedAt desc)[0...6]{
  _id, title, slug, publishedAt, image, mainText,
  "imageWidth": image.asset->metadata.dimensions.width,
  "imageHeight": image.asset->metadata.dimensions.height
}`;

const AGENDA_QUERY = `*[_type == "event" && date >= now()] | order(date asc){
  _id, date, title, location, link
}`;

const BIOGRAPHY_QUERY = `*[_type == "biography"][0]{image, pullQuote, description}`;

const PRESS_QUERY = `*[_type == "press"][0]{quotes, pressKit{asset->{url, originalFilename}}}`;

const CONTACT_QUERY = `*[_type == "contact"][0]{email, socialLinks}`;

export const RELEASE_BY_SLUG_QUERY = `*[_type == "release" && slug.current == $slug][0]{
  _id, title, slug, image, length, releaseDate, releaseType, description, personnel, links, finalNote,
  media[]{
    mediaType, alt, isTitleImage, image, videoUrl,
    "width": image.asset->metadata.dimensions.width,
    "height": image.asset->metadata.dimensions.height
  },
  sponsors[]{name, image, link},
  "project": project->{title, slug}
}`;

const ALL_RELEASES_QUERY = `*[_type == "release"] | order(releaseDate desc){
  _id, title, slug, image, releaseDate, releaseType,
  "project": project->{title, slug}
}`;

export const PROJECT_BY_SLUG_QUERY = `*[_type == "project" && slug.current == $slug][0]{
  _id, title, slug, description, coverImage,
  "releases": *[_type == "release" && references(^._id)] | order(releaseDate desc){
    _id, title, slug, image, length, releaseDate
  },
  "agenda": *[_type == "event" && date >= now() && references(^._id)] | order(date asc){
    _id, date, title, location, link
  },
  socialLinks
}`;

export async function getHomeData() {
  const [featuredRelease, projects, news, agenda, biography, press, contact] = await Promise.all([
    client.fetch<FeaturedRelease | null>(FEATURED_RELEASE_QUERY),
    client.fetch<Project[]>(PROJECTS_QUERY),
    client.fetch<NewsItem[]>(NEWS_QUERY),
    client.fetch<AgendaItem[]>(AGENDA_QUERY),
    client.fetch<Biography | null>(BIOGRAPHY_QUERY),
    client.fetch<Press | null>(PRESS_QUERY),
    client.fetch<Contact | null>(CONTACT_QUERY),
  ]);

  return { featuredRelease, projects, news, agenda, biography, press, contact };
}

export async function getReleaseBySlug(slug: string) {
  return client.fetch<ReleaseDetail | null>(RELEASE_BY_SLUG_QUERY, { slug });
}

export async function getAllReleases() {
  return client.fetch<ReleaseSummary[]>(ALL_RELEASES_QUERY);
}

export async function getProjectBySlug(slug: string) {
  return client.fetch<ProjectDetail | null>(PROJECT_BY_SLUG_QUERY, { slug });
}

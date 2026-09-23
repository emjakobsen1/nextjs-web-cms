import { client } from "@/sanity/client";
import type { SanityImageSource } from "@sanity/image-url";
import type { PortableTextBlock } from "next-sanity";

export type SanityImage = SanityImageSource & { asset?: { _ref: string } };

export type Hero = {
  heading: string;
  mediaType: "image" | "video";
  image?: SanityImage;
  video?: { asset?: { url: string } };
  linkedRelease?: { title: string; slug: { current: string } } | null;
};

export type ReleaseSummary = {
  _id: string;
  title: string;
  slug: { current: string };
  image: SanityImage;
  length?: string;
  releaseDate?: string;
};

export type ReleaseDetail = ReleaseSummary & {
  description?: string;
  personnel?: string[];
  link?: string;
  project?: { title: string; slug: { current: string } };
};

export type Project = {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  releases: ReleaseSummary[];
};

export type NewsItem = {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  image?: SanityImage;
  mainText: PortableTextBlock[];
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

const options = { next: { revalidate: 60 } };

const HERO_QUERY = `*[_type == "hero"][0]{
  heading, mediaType, image, video{asset->{url}},
  "linkedRelease": linkedRelease->{title, slug}
}`;

const PROJECTS_QUERY = `*[_type == "project"] | order(order asc){
  _id, title, slug, description,
  "releases": *[_type == "release" && references(^._id)] | order(releaseDate desc){
    _id, title, slug, image, length, releaseDate
  }
}`;

const NEWS_QUERY = `*[_type == "newsPost"] | order(publishedAt desc)[0...6]{
  _id, title, slug, publishedAt, image, mainText
}`;

const AGENDA_QUERY = `*[_type == "event" && date >= now()] | order(date asc){
  _id, date, title, location, link
}`;

const BIOGRAPHY_QUERY = `*[_type == "biography"][0]{image, pullQuote, description}`;

const PRESS_QUERY = `*[_type == "press"][0]{quotes, pressKit{asset->{url, originalFilename}}}`;

const CONTACT_QUERY = `*[_type == "contact"][0]{email, socialLinks}`;

export const RELEASE_BY_SLUG_QUERY = `*[_type == "release" && slug.current == $slug][0]{
  _id, title, slug, image, length, releaseDate, description, personnel, link,
  "project": project->{title, slug}
}`;

export async function getHomeData() {
  const [hero, projects, news, agenda, biography, press, contact] = await Promise.all([
    client.fetch<Hero | null>(HERO_QUERY, {}, options),
    client.fetch<Project[]>(PROJECTS_QUERY, {}, options),
    client.fetch<NewsItem[]>(NEWS_QUERY, {}, options),
    client.fetch<AgendaItem[]>(AGENDA_QUERY, {}, options),
    client.fetch<Biography | null>(BIOGRAPHY_QUERY, {}, options),
    client.fetch<Press | null>(PRESS_QUERY, {}, options),
    client.fetch<Contact | null>(CONTACT_QUERY, {}, options),
  ]);

  return { hero, projects, news, agenda, biography, press, contact };
}

export async function getReleaseBySlug(slug: string) {
  return client.fetch<ReleaseDetail | null>(RELEASE_BY_SLUG_QUERY, { slug }, options);
}

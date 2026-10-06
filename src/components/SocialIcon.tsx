import type { ReactElement } from "react";

type IconProps = { className?: string };

function YouTubeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M22.5 6.5a3 3 0 0 0-2.1-2.1C18.6 4 12 4 12 4s-6.6 0-8.4.4A3 3 0 0 0 1.5 6.5 31 31 0 0 0 1 12a31 31 0 0 0 .5 5.5 3 3 0 0 0 2.1 2.1C5.4 20 12 20 12 20s6.6 0 8.4-.4a3 3 0 0 0 2.1-2.1A31 31 0 0 0 23 12a31 31 0 0 0-.5-5.5ZM9.8 15.5v-7l6.2 3.5-6.2 3.5Z" />
    </svg>
  );
}

function SpotifyIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      className={className}
    >
      <circle cx="12" cy="12" r="9.2" />
      <path d="M7 10c3.2-1 7-.6 10 1.2M7.6 13.2c2.6-.8 5.6-.5 8 .9M8.3 16.2c2-.6 4.3-.4 6 .7" />
    </svg>
  );
}

function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M13.5 21v-7.6h2.6l.4-3h-3v-1.9c0-.9.2-1.5 1.5-1.5h1.6V4.3C15.9 4.2 15 4.1 14 4.1c-2.2 0-3.7 1.3-3.7 3.8v2.5H7.7v3h2.6V21h3.2Z" />
    </svg>
  );
}

function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function BandcampIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <circle cx="12" cy="12" r="9.2" />
      <path d="M9.3 8.3h4l2.9 7.4h-4l-2.9-7.4Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function SoundcloudIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9 16.5h8.5a3 3 0 0 0 .3-6 4.6 4.6 0 0 0-8.6-1.7A2.8 2.8 0 0 0 6.7 11" />
      <path d="M5 12.5v4M7 10.8v5.7M9 9.5v7" />
    </svg>
  );
}

function LinktreeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className={className}>
      <path d="M12 3v18M12 9 6 5M12 9l6-4M12 15l-6 4M12 15l6 4" />
    </svg>
  );
}

const ICONS: { [key: string]: (props: IconProps) => ReactElement } = {
  youtube: YouTubeIcon,
  spotify: SpotifyIcon,
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  bandcamp: BandcampIcon,
  soundcloud: SoundcloudIcon,
  linktree: LinktreeIcon,
};

// Display names for the "<Icon> Bandcamp" / "<Icon> Spotify" listen-link
// buttons — keep these in step with the platform list in Studio's
// socialLink schema.
export const PLATFORM_LABELS: { [key: string]: string } = {
  youtube: "YouTube",
  spotify: "Spotify",
  facebook: "Facebook",
  instagram: "Instagram",
  bandcamp: "Bandcamp",
  soundcloud: "Soundcloud",
  linktree: "Linktree",
};

export default function SocialIcon({ platform, className }: { platform: string; className?: string }) {
  const Icon = ICONS[platform];
  if (!Icon) return null;
  return <Icon className={className} />;
}

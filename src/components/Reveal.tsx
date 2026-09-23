"use client";

import { useEffect, useState, type ElementType, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  duration?: number;
};

export default function Reveal({
  children,
  as: Tag = "div",
  className = "",
  delay = 0,
  duration = 600,
}: RevealProps) {
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);

  const clampedDuration = Math.min(Math.max(duration, 0), 700);

  return (
    <Tag
      ref={setNode}
      className={`reveal ${visible ? "reveal-visible" : ""} ${className}`}
      style={{ transitionDuration: `${clampedDuration}ms`, transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

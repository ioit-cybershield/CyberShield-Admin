// components/Card.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils"; // Already present in your project.[file:4]

export type CardVariant =
  | "hero"
  | "media"
  | "product"
  | "list"
  | "compactThumb";

export interface CardImage {
  src: string;
  alt: string;
}

export interface CardStat {
  label: string;
  value: string;
}

export interface CardData {
  id: string;
  variant: CardVariant;
  title: string;
  // Optional second line for titles like "Revitex WSX45"
  titleSecondary?: string;
  eyebrow?: string;
  subtitle?: string;
  description?: string;
  image?: CardImage;
  stats?: CardStat[];
  listItems?: string[];
  // Used for the "Mobility industries" multi-line list card.
  stackedLines?: string[];
  // Used for compact thumbnail row.
  thumbnailCaption?: string;
  href?: string;
}

export interface CardProps extends CardData {
  className?: string;
  // If true, render as "pressable" card with button semantics.
  interactive?: boolean;
  onClick?: () => void;
}

/**
 * Single highly reusable card with visual variants.
 * Rounded corner radius ≈ 28px -> rounded-[28px] (28px).[file:2]
 */
export function Card(props: CardProps) {
  const {
    variant,
    className,
    interactive,
    onClick,
    href,
    image,
    title,
    titleSecondary,
    eyebrow,
    subtitle,
    description,
    stats,
    listItems,
    stackedLines,
    thumbnailCaption,
  } = props;

  const prefersReducedMotion = useReducedMotion();

  const baseClasses =
    "relative flex h-full flex-col overflow-hidden rounded-[28px] bg-[#151515] text-white shadow-[0_24px_60px_rgba(0,0,0,0.45)]"; // shadow tuned to soft floating look.[file:2]

  const paddingByVariant: Record<CardVariant, string> = {
    hero: "p-8 md:p-10", // ~32–40px inner padding.[file:2]
    media: "p-0",
    product: "p-7 md:p-8",
    list: "p-7 md:p-8",
    compactThumb: "p-3",
  };

  const focusRing =
    "outline-none ring-2 ring-offset-2 ring-offset-[#0b0b0b] ring-[#ff5710] focus-visible:ring-2";

  const content = (
    <motion.article
      initial={
        prefersReducedMotion ? false : { opacity: 0, y: 8 } // 8px entrance slide.
      }
      whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      whileHover={
        prefersReducedMotion
          ? {}
          : { scale: variant === "compactThumb" ? 1.02 : 1.03 }
      }
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn(baseClasses, paddingByVariant[variant], className)}
      tabIndex={interactive || href ? 0 : -1}
      role={interactive || href ? "button" : "article"}
      aria-label={titleSecondary ? `${title} ${titleSecondary}` : title}
      onClick={onClick}
      onKeyDown={(e) => {
        if (!interactive && !href) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {renderCardBody({
        variant,
        image,
        title,
        titleSecondary,
        eyebrow,
        subtitle,
        description,
        stats,
        listItems,
        stackedLines,
        thumbnailCaption,
      })}
    </motion.article>
  );

  if (href) {
    // Avoid next/link here to keep Card maximally reusable; wrap with Link in parent when needed.
    return (
      <a href={href} className={focusRing}>
        {content}
      </a>
    );
  }

  return React.cloneElement(content as React.ReactElement, {
    className: cn((content as React.ReactElement).props.className, focusRing),
  });
}

interface RenderProps {
  variant: CardVariant;
  image?: CardImage;
  title: string;
  titleSecondary?: string;
  eyebrow?: string;
  subtitle?: string;
  description?: string;
  stats?: CardStat[];
  listItems?: string[];
  stackedLines?: string[];
  thumbnailCaption?: string;
}

function renderCardBody({
  variant,
  image,
  title,
  titleSecondary,
  eyebrow,
  subtitle,
  description,
  stats,
  listItems,
  stackedLines,
  thumbnailCaption,
}: RenderProps) {
  switch (variant) {
    case "hero":
      return (
        <div className="relative flex h-full flex-col justify-end">
          {image && (
            <div className="pointer-events-none absolute inset-0">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/65 via-black/30 to-transparent" />
            </div>
          )}
          <div className="relative z-10 max-w-[70%] space-y-3">
            {eyebrow && (
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-200">
                {eyebrow}
              </p>
            )}
            <h2 className="text-3xl leading-tight font-semibold md:text-4xl lg:text-5xl">
              {title}
              {titleSecondary && (
                <>
                  <br />
                  {titleSecondary}
                </>
              )}
            </h2>
            {subtitle && <p className="text-lg text-neutral-100">{subtitle}</p>}
          </div>
        </div>
      );

    case "media":
      return (
        <div className="relative flex h-full flex-col justify-end">
          {image && (
            <div className="absolute inset-0">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                loading="lazy"
                decoding="async"
                className="object-cover"
              />
            </div>
          )}
          <div className="relative z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-7 md:p-8">
            {eyebrow && (
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-200">
                {eyebrow}
              </p>
            )}
            <h3 className="text-2xl font-semibold md:text-3xl">{title}</h3>
            {subtitle && (
              <p className="mt-1 text-sm text-neutral-100">{subtitle}</p>
            )}
          </div>
        </div>
      );

    case "product":
      return (
        <div className="flex h-full flex-col gap-4">
          {image && (
            <div className="relative h-32 overflow-hidden rounded-3xl bg-[#201816]">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                loading="lazy"
                decoding="async"
                className="object-cover"
              />
            </div>
          )}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e6ded2]">
              {eyebrow}
            </p>
            <h3 className="text-2xl font-semibold leading-tight">
              {title}
              {titleSecondary && (
                <>
                  <br />
                  {titleSecondary}
                </>
              )}
            </h3>
            {subtitle && <p className="text-sm text-neutral-100">{subtitle}</p>}
          </div>
          {stats && stats.length > 0 && (
            <dl className="mt-auto grid grid-cols-1 gap-2 text-sm text-neutral-100">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-baseline justify-between gap-2 border-t border-white/10 pt-2"
                >
                  <dt className="text-xs uppercase tracking-[0.18em] text-neutral-400">
                    {stat.label}
                  </dt>
                  <dd className="text-sm font-medium text-white">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      );

    case "list":
      return (
        <div className="flex h-full flex-col justify-between">
          <div className="space-y-4">
            {eyebrow && (
              <p className="inline-flex rounded-full bg-[#e6ded2] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#151515]">
                {eyebrow}
              </p>
            )}
            <div className="space-y-2">
              {stackedLines?.map((line, idx) => (
                <p
                  key={idx}
                  className={cn(
                    "text-3xl font-semibold leading-tight md:text-4xl",
                    idx === 0 && "mt-1",
                  )}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>
          {listItems && listItems.length > 0 && (
            <div className="mt-6 space-y-1 text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
              {listItems.map((item) => (
                <span key={item} className="block">
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>
      );

    case "compactThumb":
      return (
        <div className="flex items-center gap-3">
          {image && (
            <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-2xl bg-[#201816]">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                loading="lazy"
                decoding="async"
                className="object-cover"
              />
            </div>
          )}
          <div className="space-y-0.5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-300">
              {eyebrow}
            </p>
            <p className="text-sm font-semibold leading-snug">
              {titleSecondary ? `${title} ${titleSecondary}` : title}
            </p>
            {thumbnailCaption && (
              <p className="text-xs text-neutral-400">{thumbnailCaption}</p>
            )}
          </div>
        </div>
      );

    default:
      return null;
  }
}

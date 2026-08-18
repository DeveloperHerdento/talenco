import { Fragment } from "react";

const MARKER_CLASSES: Record<string, string> = {
  hl: "text-brand-orange",
  b: "text-brand-blue",
  a: "text-brand-amber",
};

type RichTextProps = {
  text: string;
  highlightClassName?: string;
};

export function RichText({ text, highlightClassName }: RichTextProps) {
  const classes = highlightClassName ? { ...MARKER_CLASSES, hl: highlightClassName } : MARKER_CLASSES;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  for (const match of text.matchAll(/\[(hl|b|a)\](.*?)\[\/\1\]/g)) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    nodes.push(
      <span key={key++} className={classes[match[1]]}>
        {match[2]}
      </span>,
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));

  return <Fragment>{nodes}</Fragment>;
}

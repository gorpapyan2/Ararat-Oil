import React from "react";

interface SearchHighlighterProps {
  text: string | number | undefined | null;
  searchTerm: string;
  className?: string;
  highlightClassName?: string;
}

/**
 * Component that highlights substrings matching a search term within text
 * Useful for search results in tables and lists
 */
export function SearchHighlighter({
  text,
  searchTerm,
  className = "",
  highlightClassName = "bg-yellow-200 dark:bg-yellow-800 rounded px-1 font-medium",
}: SearchHighlighterProps) {
  // Convert to string and handle null/undefined
  const content = String(text ?? "");

  // If no search term or text is empty, just return the text
  if (!searchTerm.trim() || !content) {
    return <span className={className}>{content}</span>;
  }

  try {
    // Create a case-insensitive regular expression from the search term
    // Escape special regex characters first to prevent errors
    const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedSearchTerm})`, "gi");

    // Split the content by the regex
    const parts = content.split(regex);

    // If no matches were found (length === 1), return the original text
    if (parts.length === 1) {
      return <span className={className}>{content}</span>;
    }

    // Map the parts to React elements
    return (
      <span className={className}>
        {parts.map((part, i) => {
          // Check if this part matches the search term (case insensitive)
          const isMatch = part.toLowerCase() === searchTerm.toLowerCase();

          return isMatch ? (
            <mark key={i} className={highlightClassName}>
              {part}
            </mark>
          ) : (
            <React.Fragment key={i}>{part}</React.Fragment>
          );
        })}
      </span>
    );
  } catch (error) {
    // Handle regex errors gracefully
    console.error("SearchHighlighter error:", error);
    return <span className={className}>{content}</span>;
  }
}

/**
 * Higher-order function that wraps table cell content with search highlighting
 *
 * @param content The cell content to be highlighted
 * @param searchTerm The search term to highlight
 * @returns A function that returns the highlighted content
 */
export function highlightCellContent(
  content: React.ReactNode,
  searchTerm: string
): React.ReactNode {
  // If content is not a string or number, return it as is
  if (
    typeof content !== "string" &&
    typeof content !== "number" &&
    !React.isValidElement(content)
  ) {
    return content;
  }

  // If content is a number or string, wrap it with SearchHighlighter
  if (typeof content === "string" || typeof content === "number") {
    return <SearchHighlighter text={content} searchTerm={searchTerm} />;
  }

  // If content is a React element, check if it has children that are strings
  if (React.isValidElement(content)) {
    // If the child has text content, try to highlight it
    // This is a simplification; complex nested components would need more logic
    const childrenText = React.Children.toArray(content.props.children)
      .filter((child) => typeof child === "string" || typeof child === "number")
      .join(" ");

    if (childrenText) {
      // Return a clone with the text highlighted
      return React.cloneElement(
        content,
        content.props,
        <SearchHighlighter text={childrenText} searchTerm={searchTerm} />
      );
    }
  }

  // Default: return content unchanged
  return content;
}

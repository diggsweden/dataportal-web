/**
 * TypeScript type declarations for PrismJS plugins and components
 * This file allows TypeScript to recognize PrismJS modules when importing them
 */

// Enables line numbering functionality for code blocks
declare module "prismjs/plugins/line-numbers/prism-line-numbers";

// Adds a toolbar with various buttons above code blocks
declare module "prismjs/plugins/toolbar/prism-toolbar";

// Adds copy-to-clipboard button functionality to code blocks
declare module "prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard";

// Allows importing any PrismJS syntax highlighting components
// The wildcard (*) enables importing specific language support like 'prism-javascript', 'prism-typescript', etc.
declare module "prismjs/components/*";

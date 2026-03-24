/**
 * Generate a URL-friendly slug from a string.
 * Converts to lowercase and replaces non-alphanumeric characters with hyphens.
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^(-)+|(-)+$/g, '');
}

/**
 * Format a file size in bytes into a human-readable label.
 * E.g. 1048576 => '1.0 MB'
 */
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  let size = bytes;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(1)} ${units[i]}`;
}
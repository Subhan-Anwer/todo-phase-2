/**
 * Data Formatting Utilities
 *
 * Provides functions for formatting dates, text, and other data for display.
 */

/**
 * Format ISO 8601 date string to human-readable format
 * @param isoString - ISO 8601 date string (e.g., "2026-01-14T10:30:00Z")
 * @returns Formatted date string (e.g., "Jan 14, 2026")
 */
export function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Invalid date string:', isoString);
    return isoString;
  }
}

/**
 * Format ISO 8601 date string to relative time
 * @param isoString - ISO 8601 date string
 * @returns Relative time string (e.g., "2 hours ago", "yesterday")
 */
export function formatRelativeTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) {
      return 'just now';
    } else if (diffMinutes < 60) {
      return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else {
      return formatDate(isoString);
    }
  } catch (error) {
    console.error('Invalid date string:', isoString);
    return isoString;
  }
}

/**
 * Truncate text to a maximum length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.substring(0, maxLength).trim()}...`;
}

/**
 * Capitalize first letter of a string
 * @param text - Text to capitalize
 * @returns Capitalized text
 */
export function capitalizeFirst(text: string): string {
  if (!text || text.length === 0) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Format task count for display
 * @param count - Number of tasks
 * @returns Formatted string (e.g., "5 tasks", "1 task")
 */
export function formatTaskCount(count: number): string {
  return `${count} ${count === 1 ? 'task' : 'tasks'}`;
}

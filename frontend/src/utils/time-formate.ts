export const getISTTimeFormate = (expiredAt: number) => {
  if (!expiredAt || isNaN(expiredAt)) {
    return 'N/A';
  }
  const date = new Date(expiredAt);
  if (isNaN(date.getTime())) {
    return 'N/A';
  }
  const formattedTime = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  }).format(date);
  return formattedTime;
};

export function timeAgo(dateString: string): string {
  if (!dateString) return 'just now';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'just now';
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Handle future timestamps / clock skew
  if (seconds < 0) {
    return "just now";
  }
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    return interval === 1 ? "1 year ago" : `${interval} years ago`;
  }

  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return interval === 1 ? "1 month ago" : `${interval} months ago`;
  }

  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return interval === 1 ? "1 day ago" : `${interval} days ago`;
  }

  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return interval === 1 ? "1 hour ago" : `${interval} hours ago`;
  }

  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return interval === 1 ? "1 minute ago" : `${interval} minutes ago`;
  }

  return Math.floor(seconds) === 1
    ? "1 second ago"
    : `${Math.floor(seconds)} seconds ago`;
}

export function formatDateShort(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

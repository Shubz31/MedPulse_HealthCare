import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseStringify(value: any) {
  return JSON.parse(JSON.stringify(value));
}

export const convertFileToUrl = (file: File) => {
  return URL.createObjectURL(file);
};

export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);

  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return {
    dateTime: `${formattedDate}, ${formattedTime}`,
    date: formattedDate,
    time: formattedTime,
  };
};

export function decryptKey(passkey: string) {
  return atob(passkey);
}
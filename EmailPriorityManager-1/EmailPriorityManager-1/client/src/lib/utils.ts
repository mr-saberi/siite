import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format price in Persian
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fa-IR").format(price);
}

// Convert English numbers to Persian
export function toPersianNumbers(num: number | string): string {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/[0-9]/g, (digit) => persianDigits[parseInt(digit)]);
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  // Check if user data exists in local storage
  return !!localStorage.getItem("user");
}

// Check if user is admin
export function isAdmin(): boolean {
  try {
    const userData = localStorage.getItem("user");
    if (!userData) return false;
    
    const user = JSON.parse(userData);
    return user.isAdmin === true;
  } catch (error) {
    return false;
  }
}

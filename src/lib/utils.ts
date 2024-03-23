import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBudget(budget: number): string {
  const formattedBudget = budget
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, '$&,');
  return `$${formattedBudget}`;
}

export const calculateUpdatedPrice = (
  bidPrice: number,
  escalationPercent: number
) => {
  return Number(
    (bidPrice * (1 + escalationPercent / 100)).toFixed(2)
  );
};

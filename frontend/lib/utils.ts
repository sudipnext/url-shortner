import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { AuthActions } from "@/app/auth/utils";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const HomeURL = (): string => {
  return "http://localhost:8000/api/";
};

const { getToken } = AuthActions();

export const deleteURL = async (id: string) => {
  await fetch(`${HomeURL()}urls/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken("access")}`,
    },
  })
  return "deleted"
}

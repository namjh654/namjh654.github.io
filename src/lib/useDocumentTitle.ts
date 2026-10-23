import { useEffect } from "react";
import { site } from "../content/site";

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} — ${site.brand}` : site.brand;
  }, [title]);
}

export const formatDate = (date: string) => date.replace(/-/g, ". ");

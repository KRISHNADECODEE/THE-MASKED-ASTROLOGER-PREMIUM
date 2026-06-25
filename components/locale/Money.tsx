"use client";

import { useLocale } from "./LocaleProvider";

export function Money({ inr }: { inr: number }) {
  const { money } = useLocale();
  return <>{money(inr)}</>;
}

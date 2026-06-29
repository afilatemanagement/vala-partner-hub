import type { ReactNode } from "react";

export function WallShell({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-4 p-4 lg:p-6">{children}</div>;
}

export function TwoCol({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 lg:grid-cols-3">{children}</div>;
}

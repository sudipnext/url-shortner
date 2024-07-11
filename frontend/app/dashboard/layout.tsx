import React from "react";
import DashboardPage from "@/components/layouts/DashboardHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <DashboardPage children={children} />
    </section>
  );
}

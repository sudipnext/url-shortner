"use client";

import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/custom_ui/DateRangePicker";
import { Search } from "@/components/custom_ui/search";
import React from "react";

export default function DashboardPage({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4 flex-wrap">
            {/* <TeamSwitcher /> */}
            {/* <MainNav className="mx-6" /> */}
            <div className="mr-auto flex items-center space-x-4 mx-auto md:mx-0">
              <Search />
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2 flex-wrap">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2 flex-wrap">
              <DatePickerWithRange />
              <Button>Download</Button>
            </div>
          </div>
        {children}
        </div>
      </div>
    </>
  );
}

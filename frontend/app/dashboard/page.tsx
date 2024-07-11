import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import URLsPage from "@/components/dashboard_tabs/urls/main";
import Analytics from "@/components/dashboard_tabs/analytics/analytics";

type Props = {};

function page({}: Props) {
  return (
    <Tabs defaultValue="analytics" className="space-y-4">
      <TabsList>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="urls">Urls</TabsTrigger>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="notifications">Settings</TabsTrigger>
      </TabsList>
      {/* more content here  */}
      <TabsContent value="analytics" className="space-y-4">
        <Analytics />
      </TabsContent>

      <TabsContent value="urls" className="space-y-4">
        <URLsPage />
      </TabsContent>
    </Tabs>
  );
}

export default page;

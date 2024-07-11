"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import { z } from "zod";
import { HomeURL } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AuthActions } from "@/app/auth/utils";
import { toast, Toaster } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { FaRegClipboard } from "react-icons/fa";
import { useState } from "react";
const FormSchema = z.object({
  short_slug: z.string().min(6, {
    message: "Slug must be at least 6 characters.",
  }),
  original_url: z.string().url({
    message: "Please enter a valid URL.",
  }),
});

const ShortenedDataSchema = z.object({
  short_slug: z.string(),
  original_url: z.string(),
  qr_code: z.string(),
});

export function InputForm() {
  const [shortenedData, setShortenedData] = useState(
    {} as z.infer<typeof ShortenedDataSchema>
  );
  const [showData, setShowData] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      short_slug: "",
      original_url: "",
    },
  });
  const { getToken } = AuthActions();
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const res = await fetch(HomeURL() + "urls/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getToken("access"),
        },
        method: "POST",
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const responseData = await res.json();
        console.log(responseData);
        setShortenedData(responseData);
        setShowData(true);
        toast.success("URL Shortened Successfully");
        form.reset();
      } else {
        const errorData = await res.json();
        console.log(errorData);
        setShowData(false);
        let errorMessage = "";
        if (res.status == 401) {
          errorMessage =
            "You are not logged in: Please Login to Create Short Links";
        } else {
          errorMessage = Object.values(errorData).join(" ");
        }
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
      console.error(error);
    }
  }
  const downloadQRCode = async () => {
    try {
      const response = await fetch(shortenedData.qr_code);
      if (!response.ok) throw new Error("Network response was not ok");
      const blob = await response.blob();
      const localUrl = window.URL.createObjectURL(blob);

      const anchor = document.createElement("a");
      anchor.href = localUrl;
      anchor.download = `qr_code_${shortenedData.short_slug}.png`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(localUrl); // Clean up the local URL

      toast.success("QR Code Downloaded Successfully");
    } catch (error) {
      console.error("Download failed", error);
      toast.error("Failed to download QR Code");
    }
  };
  const copyToClipboard = async () => {
    const fullLink = `${HomeURL()}${shortenedData.short_slug}`; // Construct the full link
    try {
      await navigator.clipboard.writeText(fullLink);
      toast.success("Copied to clipboard");
    } catch (err) {
      console.error("Failed to copy: ", err); // Handle possible errors
    }
  };

  return (
    <>
      <Card className="w-[350px] sm:w-[400px] md:w-[700px]">
        <CardHeader>
          <CardTitle>Shorten URL</CardTitle>
          <CardDescription>
            Create a shortened URL that redirects to your original URL at one
            go.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <Toaster richColors />

            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-2/3 space-y-6"
            >
              <FormField
                control={form.control}
                name="short_slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the short slug that will be used to identify your
                      URL.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="original_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL to Shorten</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the URL that you want to shorten.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Generate</Button>
            </form>
          </Form>
        </CardContent>
        {showData ? (
          <CardFooter className="flex justify-between items-center">
            {/* shortened link and copy section */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <FaRegClipboard
                  onClick={copyToClipboard}
                  className="text-gray-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-blue-500">
                  {HomeURL()}
                  {shortenedData.short_slug}
                </p>
                <Image
                  src={shortenedData.qr_code}
                  alt="QR Code"
                  width={50}
                  height={50}
                />
              </div>
              <Button variant="outline" onClick={downloadQRCode}>
                Download QR
              </Button>
            </div>
          </CardFooter>
        ) : null}
      </Card>
    </>
  );
}

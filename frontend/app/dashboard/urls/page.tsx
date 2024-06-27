"use client";
import { useState, useEffect } from "react";
import { URLType, columns } from "./columns";
import { DataTable } from "./data-table";
import { HomeURL } from "@/lib/utils";
import { AuthActions } from "@/app/auth/utils";

const { getToken } = AuthActions();

async function getData() {
  // Fetch data from your API here.
  const response = await fetch(`${HomeURL()}urls/`, {
    headers: {
      Authorization: `Bearer ${getToken("access")}`,
    },
  });
  // Correctly await the JSON response and return it
  return await response.json();
}

export default function DemoPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getData();
      setData(data);
    }

    fetchData();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}

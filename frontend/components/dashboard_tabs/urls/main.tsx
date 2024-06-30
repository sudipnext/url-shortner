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

export default function URLsPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getData();
      setData(data);
    }

    fetchData();
  }, []);

  return (
    <>
      <DataTable columns={columns} data={data} />
    </>
  );
}

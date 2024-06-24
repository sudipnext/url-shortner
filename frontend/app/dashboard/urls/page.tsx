import { URLType, columns } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<URLType[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      original_url: "https://",
      clicks: 12,
      short_slug: "slkdjflksdf",
      qr_code: "slkdjfkld",
      edit: <>helo</>,
      active: "True"
    },
    // ...
  ]
}

export default async function DemoPage() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}

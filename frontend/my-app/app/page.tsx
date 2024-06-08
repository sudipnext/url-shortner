import { NavMenu } from "@/components/custom_ui/NavBar";
import { SiCurl } from "react-icons/si";
import { UserNav } from "@/components/custom_ui/DropDownUser";
import { InputForm } from "@/components/custom_ui/submitForm";
export default function DashboardPage() {
  return (
    <>
      <div className="flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <SiCurl /> <span>Shorty</span>
            <div className="mx-6" />
            <NavMenu />
            <div className="ml-auto flex items-center space-x-4">
              <UserNav />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center h-screen">
        <InputForm />
      </div>
    </>
  );
}

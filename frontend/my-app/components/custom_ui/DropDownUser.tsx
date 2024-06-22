"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoSettingsSharp } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import { IoIosLogOut } from "react-icons/io";
import useSWR from "swr";
import { Loader2 } from "lucide-react";
import { fetcher } from "@/app/fetcher";

interface UserNavProps {
  id: Number;
  username: string;
  email: string;
}

export function UserNav() {
  const { isLoggedIn, handleLogout, setLoading, loading } = useAuth();
  const onLogoutClick = () => {
    handleLogout();
  };
  const { data: user, error } = useSWR<UserNavProps>(
    isLoggedIn ? "auth/users/me" : null,
    fetcher,
    {
      onSuccess: () => setLoading(false),
      onError: () => setLoading(false),
    }
  );

  if (loading) {
    return <div className="mr-4 animate-spin"><Loader2/></div>; 
  }
  return (
    <>
      {isLoggedIn ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/avatars/03.png" alt="@shadcn" />
                <AvatarFallback>S</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.username ?? "Anonymous"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email ?? "shorty@gmail.com"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                Profile
                <DropdownMenuShortcut>
                  <CiUser />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Settings
                <DropdownMenuShortcut>
                  <IoSettingsSharp />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogoutClick}>
              Log out
              <DropdownMenuShortcut>
                <IoIosLogOut />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          <Button>
            <a href="/auth/login">Log in</a>
          </Button>
          <Button variant="outline">
            <a href="/auth/signup">Sign up</a>
          </Button>
        </>
      )}
    </>
  );
}

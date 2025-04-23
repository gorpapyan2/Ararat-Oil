import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem } from "@/components/ui/menubar";
import { Button } from "@/components/ui/button";

const UserMenu: React.FC = () => {
  const { user, profile, signOut, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) return null;

  if (!user) {
    return (
      <Button
        variant="outline"
        className="ml-2"
        onClick={() => navigate("/auth")}
      >
        Login
      </Button>
    );
  }

  // Use initials or fallback icon
  const initials = user.email
    ? user.email.split("@")[0][0].toUpperCase()
    : "U";

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger asChild>
          <span className="cursor-pointer flex items-center gap-2">
            <Avatar>
              <AvatarImage src={profile?.avatar_url} alt={user.email || "User"} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline text-sm font-medium">
              {profile?.full_name || user.email}
            </span>
          </span>
        </MenubarTrigger>
        <MenubarContent align="end">
          <MenubarItem onClick={() => { signOut(); navigate("/auth"); }}>
            Logout
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default UserMenu;

"use client";
import {
  ChevronsUpDown,
  LogOut,
  Users,
  Badge,
  ChartArea,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import Link from "next/link";

export function NavUser({
  userNav,
}: {
  userNav: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800/40 transition">
          <Avatar className="h-9 w-9 rounded-xl ring-2 ring-slate-600/50">
            <AvatarImage src={userNav.avatar} alt={userNav.name} />
            <AvatarFallback className="rounded-xl bg-slate-700 text-white font-semibold">
              {userNav.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="hidden lg:flex flex-col text-left text-sm leading-tight">
            <span className="truncate font-semibold text-slate-100">
              {userNav.name}
            </span>
            <span className="truncate text-xs text-slate-400">
              {userNav.email}
            </span>
          </div>
          <ChevronsUpDown className="ml-1 size-4 text-slate-400" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-64 rounded-xl border border-slate-700/50 bg-slate-900/95 backdrop-blur-sm shadow-2xl"
        side="bottom"
        align="end" // 👈 alinear menú con la derecha
        sideOffset={8}
      >
        <DropdownMenuGroup>
          <Link href="/talents">
            <DropdownMenuItem className="cursor-pointer flex items-center gap-3 px-4 py-3 text-slate-200 hover:text-white hover:bg-slate-800/50 rounded-lg">
              <Users className="h-4 w-4 text-blue-400" />
              <div>
                <div className="font-medium">Talentos</div>
                <div className="text-xs text-slate-400">
                  Gestionar talentos
                </div>
              </div>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-slate-700/50" />

        <Link href="/technical-references">
          <DropdownMenuItem className="cursor-pointer flex items-center gap-3 px-4 py-3 text-slate-200 hover:text-white hover:bg-slate-800/50 rounded-lg">
            <Badge className="h-4 w-4 text-purple-400" />
            <div>
              <div className="font-medium">Referentes Técnicos</div>
              <div className="text-xs text-slate-400">Administrar referentes</div>
            </div>
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator className="bg-slate-700/50" />

        <Link href="/interactions">
          <DropdownMenuItem className="cursor-pointer flex items-center gap-3 px-4 py-3 text-slate-200 hover:text-white hover:bg-slate-800/50 rounded-lg">
            <ChartArea className="h-4 w-4 text-green-400" />
            <div>
              <div className="font-medium">Interacciones</div>
              <div className="text-xs text-slate-400">Supervisar interacciones</div>
            </div>
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator className="bg-slate-700/50" />

        <DropdownMenuItem
          onClick={() => signOut()}
          className="cursor-pointer flex items-center gap-3 px-4 py-3 text-red-300 hover:text-red-200 hover:bg-red-900/20 rounded-lg"
        >
          <LogOut className="h-4 w-4 text-red-400" />
          <div>
            <div className="font-medium">Cerrar Sesión</div>
            <div className="text-xs text-red-400/70">Salir del sistema</div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

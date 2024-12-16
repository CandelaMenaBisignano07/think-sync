import { DefaultSession, DefaultUser } from "next-auth";
import { PermissionValues } from "./rooms.types";
declare module "next-auth" {
  interface User extends DefaultUser {
    _id: string; // Añadimos el campo _id
    provider:'google'|'github'
    permission?:PermissionValues,
    isAdmin?:boolean
  }
    interface Session {
      user: User & DefaultSession["user"];
    }
    }
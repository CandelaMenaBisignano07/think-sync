import { DefaultSession, DefaultUser} from "next-auth";
import { PermissionValues } from "./rooms.types";
import { DefaultJWT } from "next-auth/jwt";

type Providers = 'google'|'github'

declare module "next-auth" {
  interface User extends DefaultUser {
    _id: string;
    provider:Providers
    permission?:PermissionValues,
    isAdmin?:boolean
  }
    interface Session {
      user: User & DefaultSession["user"];
    }
}

declare module "next-auth/jwt"{
  interface JWT extends DefaultJWT{
    _id:string;
    provider:Providers
  }
}


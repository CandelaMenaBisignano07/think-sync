import { RoomData } from "@liveblocks/node";
import { Room } from "./rooms.types";
import { Session } from "next-auth";
export type Payloads = Room[] | Room | Session['user'][] | Session["user"] | RoomData


export type ErrorType={
    status:'error',
    error:string
};

export type SuccessType={
    status:'success',
    payload: Payloads
};

export type ResponseType=SuccessType | ErrorType
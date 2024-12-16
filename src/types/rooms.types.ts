import { Document } from "mongoose";

export interface Room extends Document {
    roomId: string; 
    userId: string;
    created_at: string; 
    invitedUsers:string[]
};


export type PermissionValues = ["room:write"] | ["room:read", "room:presence:write"] | null;
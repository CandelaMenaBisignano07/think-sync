import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/api/lib/connect";
import { roomModel } from "@/app/api/model/room.model";
import { EErrors } from "@/app/api/lib/EErrors";
import { Session } from "next-auth";
import { liveblocks } from "@/app/api/lib/client";
import { PermissionValues } from "@/types/rooms.types";
export async function GET(req:NextRequest, {params}: { params: Promise<{ id: string }>}){
    const userId = (await params).id;
    try {
        await connect();
        console.log(userId)
        const rooms = await roomModel.find({invitedUsers:{$in:userId}});
        return NextResponse.json({status:'success', payload: rooms},{status:200});
    } catch (error) {
        if(error instanceof Error) return NextResponse.json({status:'error', error:error.message}, {status:500});
        else return NextResponse.json({status:'error', error:EErrors[500]}, {status:500});
    }
}

export async function PUT(req:NextRequest,{params}: {params:Promise<{ id: string }>}){ //pasar a invitations
    const roomId = (await params).id;
    const {usersPermissions, currentUser} : {usersPermissions:Session['user'][], currentUser:Liveblocks['UserMeta']} = await req.json();
    try {
        await connect();
        console.log(usersPermissions, "los permisos")
        if(!currentUser) return NextResponse.json({status:'error', error:'user not found'}, {status:404})
        if(!usersPermissions) return NextResponse.json({status:'error', error:EErrors[400]}, {status:400});
        const result = Object.fromEntries(usersPermissions.map(item => [item._id, item.permission])) as Record<string, PermissionValues>
        const roomData = await liveblocks.updateRoom(roomId, {
            usersAccesses:result
        });
        console.log(roomData.usersAccesses, 'acaa')
        const updatedRoom =Object.keys(roomData.usersAccesses).filter((u)=> u !== roomData.metadata.admin)
        console.log(updatedRoom, 'new')
        await roomModel.findOneAndUpdate({roomId:roomId}, {$set:{invitedUsers:updatedRoom}});
        return NextResponse.json({status:'success', payload:roomData})
    } catch (error) {
        if(error instanceof Error) return NextResponse.json({status:'error', error:error.message}, {status:500});
        else return NextResponse.json({status:'error', error:EErrors[500]}, {status:500});
    }
}

import { NextRequest, NextResponse } from "next/server";
import { roomModel } from "../../model/room.model";
import { EErrors } from "../../lib/EErrors";
import { connect } from "../../lib/connect";
import { liveblocks } from "../../lib/client";
import { Session } from 'next-auth'
import { PermissionValues } from "@/types/rooms.types";

export async function GET(req:NextRequest, {params}: { params: Promise<{ id: string }>}){
    const roomId= (await params).id;
    try {
        await connect();
        const rooms = await roomModel.find({roomId});
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
        if(!currentUser) return NextResponse.json({status:'error', error:'user not found'}, {status:404})
        if(!usersPermissions) return NextResponse.json({status:'error', error:EErrors[400]}, {status:400});
        const result = Object.fromEntries(usersPermissions.map(item => [item._id, item.permission])) as Record<string, PermissionValues>
        console.log(result, 'el resultadoo')
        const roomData = await liveblocks.updateRoom(roomId, {
            usersAccesses:result
        });
        console.log(result,roomData.usersAccesses, currentUser, 'los accesos y el user')
        const updatedRoom =Object.keys(roomData.usersAccesses).filter((id)=> id !== currentUser.id)
        console.log(updatedRoom, 'la actualizada amorr')
        await roomModel.findOneAndUpdate({roomId:roomId}, {$set:{invitedUsers:updatedRoom}});
        return NextResponse.json({status:'success', payload:roomData})
    } catch (error) {
        if(error instanceof Error) return NextResponse.json({status:'error', error:error.message}, {status:500});
        else return NextResponse.json({status:'error', error:EErrors[500]}, {status:500});
    }
}

import { NextRequest, NextResponse } from "next/server";
import { roomModel } from "../model/room.model";
import { EErrors } from "../lib/EErrors";
import { liveblocks } from "../lib/client";
import { connect } from "../lib/connect";
import { LiveObject, toPlainLson } from "@liveblocks/client";
import { LiveMap } from "@liveblocks/client";
import { PlainLsonObject, RoomAccesses } from "@liveblocks/node";
export async function POST(req:NextRequest){
    const {roomId, userId}:{roomId:string, userId:string} = await req.json();
    try {
        await connect();
        if(!roomId || !userId) return NextResponse.json({status:'error', error:EErrors[400]}, {status:400})
        const userAccesses = {[userId as string]: ["room:write"]} as RoomAccesses
        const room = await liveblocks.createRoom(roomId, {
            defaultAccesses:[],
            usersAccesses:userAccesses,
            metadata:{
                admin:userId
            }
        });

        const newRoom={
            roomId: roomId,
            userId:userId,
            created_at: room.createdAt,
            invitedUsers:[]
        };
        const createdRoom = await roomModel.create(newRoom);

        const initialStorage: Liveblocks['Storage'] = {
            shapes: new LiveMap(),
            chatMessages: new LiveMap()
        }
        await liveblocks.initializeStorageDocument(roomId, toPlainLson(new LiveObject(initialStorage)) as PlainLsonObject)
        return NextResponse.json({status:'success', payload:createdRoom}, {status:201});
    } catch (error) {
        if(error instanceof Error) return NextResponse.json({status:'error', error:error.message}, {status:500});
        else return NextResponse.json({status:'error', error:EErrors[500]}, {status:500});
    }
};

export async function GET(req:NextRequest){
    try {
        await connect();
        const searchParams = req.nextUrl.searchParams;
        const roomId = searchParams.get('roomId');
        const userId = searchParams.get('userId');
        const filters:{userId?:string, roomId?:string} = {};
        if (roomId) filters.roomId = roomId;
        if(userId) filters.userId = userId;
        const rooms = await roomModel.find(filters);
        return NextResponse.json({status:'success', payload: rooms},{status:200});
    } catch (error) {
        if(error instanceof Error) return NextResponse.json({status:'error', error:error.message}, {status:500});
        else return NextResponse.json({status:'error', error:EErrors[500]}, {status:500});
    }
}
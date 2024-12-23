import { NextRequest, NextResponse } from "next/server";
import { roomModel } from "../../model/room.model";
import { EErrors } from "../../lib/EErrors";
import { connect } from "../../lib/connect";
import { liveblocks } from "../../lib/client";

export async function GET(req:NextRequest, {params}: { params: Promise<{ id: string }>}){ //obtiene room por roomId
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

export async function DELETE(req:NextRequest, {params}: { params: Promise<{ id: string }>}){
    const roomId= (await params).id;
    try {
        await connect();
        await liveblocks.deleteRoom(roomId);
        await roomModel.findOneAndDelete({roomId});
        return NextResponse.json({status:'success', message:'room deleted successfully'},{status:200});
    } catch (error) {
        if(error instanceof Error) return NextResponse.json({status:'error', error:error.message}, {status:500});
        else return NextResponse.json({status:'error', error:EErrors[500]}, {status:500});
    }
}

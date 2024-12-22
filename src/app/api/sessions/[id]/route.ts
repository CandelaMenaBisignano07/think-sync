import { NextRequest, NextResponse } from "next/server";
import { EErrors } from "../../lib/EErrors";
import { connect } from "../../lib/connect";
import { userModel } from "../../model/user.model";
export async function GET(req:NextRequest, {params}:{params:Promise<{ id: string }>}){
    const id = (await params).id;
    try {
        await connect();
        console.log(id, "el id")
        const users = await userModel.findById(id);
        return NextResponse.json({status:'success', payload:users});
    } catch (error) {
        if(error instanceof Error) return NextResponse.json({status:'error', error:error.message}, {status:500});
        else return NextResponse.json({status:'error', error:EErrors[500]}, {status:500});
    }
}
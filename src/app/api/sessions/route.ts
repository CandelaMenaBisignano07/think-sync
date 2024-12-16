import { NextResponse } from "next/server";
import { connect } from "../lib/connect";
import { userModel } from "../model/user.model";
import { EErrors } from "../lib/EErrors";
export async function GET() {
    try {
        await connect();
        const users = await userModel.find({});
        return NextResponse.json({status:'success', payload:users});
    } catch (error) {
        if(error instanceof Error) return NextResponse.json({status:'error', error:error.message}, {status:500});
        else return NextResponse.json({status:'error', error:EErrors[500]}, {status:500});
    }
}


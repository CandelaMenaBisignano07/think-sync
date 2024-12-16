import {NextResponse } from "next/server";
import { liveblocks } from "../lib/client";
import { EErrors } from "../lib/EErrors"
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/authOptionsConfig";
export async function POST() {
    try {
      const user = await getServerSession(authOptions)
      if(!user) return NextResponse.json({status:'error',error:'user not found'}, {status:404})
      const newUser = {
        id:user.user._id as string,
        name: user.user.name as string,
        email: user.user.email as string,
        avatar: user.user.image as string,
        }
      const { status, body } = await liveblocks.identifyUser(
      {
        userId: newUser.id,
        groupIds:[],
      },
      {
        userInfo:newUser
      }
    );
    return new Response(body,{status})
    } catch (error) {
        if(error instanceof Error) return NextResponse.json({status:'error', error:error.message}, {status:500});
        else return NextResponse.json({status:'error', error:EErrors[500]}, {status:500});
    }
  }
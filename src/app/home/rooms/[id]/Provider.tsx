"use client"
import { LiveblocksProvider } from "@liveblocks/react"
import React from "react"
import { Session } from "next-auth"
function Provider({children, user, roomId}:{children:React.ReactNode, user:Session, roomId:string}) {
  return (
    <>
    <LiveblocksProvider  throttle={16} authEndpoint={`/api/liveblocks-auth?userId=${user.user._id}&roomId=${roomId}`}>
      {children}
    </LiveblocksProvider>
    </>
  )
}

export default Provider

import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/app/api/lib/authOptionsConfig";
import LiveblocksRoomProvider from "./LiveblocksRoomProvider";

export default async function RoomIds({params}: {params: Promise<{ id: string }>}) {
  const roomId = (await params).id;
  const user = await getServerSession(authOptions);
  return (
    <LiveblocksRoomProvider user={user} roomId={roomId}/>
  );
}

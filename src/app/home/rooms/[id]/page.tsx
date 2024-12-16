import { getServerSession, Session } from "next-auth";
import MyRoom from "./MyRoom";
import Provider from "./Provider";
import { authOptions } from "@/app/api/lib/authOptionsConfig";
import { redirect } from "next/navigation";

export default async function Home({params}: {params: Promise<{ id: string }>}) {
  const roomId = (await params).id;
  const user = await getServerSession(authOptions);
  if(!user) return redirect('/');
  return (
    <Provider user={user} roomId={roomId}>
      <MyRoom id={roomId} user={user as Session}/>
    </Provider>
  );
}

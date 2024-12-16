import { getServerSession } from "next-auth"
import SideBar from "./SideBar"
import { authOptions } from "../api/lib/authOptionsConfig";
import { redirect } from "next/navigation";

async function MyLayout({children}: {children: React.ReactNode}) {
    const user = await getServerSession(authOptions);
    if(!user) return redirect("/")
  return (
    <div className=' bg-gray-100 grid grid-cols-home h-screen'>
    <SideBar user={user}/>
    <main>{children}</main>
    </div>
  )
}

export default MyLayout

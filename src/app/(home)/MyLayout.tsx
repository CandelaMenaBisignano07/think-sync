import { getServerSession } from "next-auth"
import SideBar from "./SideBar"
import { authOptions } from "../api/lib/authOptionsConfig";

async function MyLayout({children}: {children: React.ReactNode}) {
    const user = await getServerSession(authOptions);
  return (
    <div className=' bg-gray-100 grid grid-cols-home h-screen'>
    <SideBar user={user}/>
    <main>{children}</main>
    </div>
  )
}

export default MyLayout

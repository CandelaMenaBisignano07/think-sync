import { getServerSession } from "next-auth"
import { redirect } from "next/navigation";
async function page() {
    const user = await getServerSession();
    if(!user) return redirect('/api/auth/signin')
    else return redirect('/home')
}

export default page

"use client"
import { Session } from "next-auth"
import Image from "next/image"
interface UserComponentProps extends React.LiHTMLAttributes<HTMLLIElement>{
    user: {email:Session['user']['email'],image:Session['user']['image']}
}
function UserComponent({user, ...props}: UserComponentProps) {
  return (
    <li {...props}>
        <div className='w-[50px] h-[50px] rounded-full overflow-hidden'>
            <Image width={200} height={200} className='object-cover w-full h-full' alt="user profile image" src={user.image as string}/>
        </div>
      <span>{user.email}</span>
    </li>
  )
}

export default UserComponent
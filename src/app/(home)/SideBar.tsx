import Link from 'next/link'
import {Session } from 'next-auth'
import Image from 'next/image'
import Form from 'next/form'
async function SideBar({user}: {user:Session}) {
  return (
    <header className=" px-2 bg-white shadow-md font-bold h-[300px] w-[50%] rounded-2xl self-center mx-7">
        <nav className='flex justify-center flex-col h-full'>
          <ul className="flex flex-col justify-center items-center gap-2">
            <li>
                <Image className='rounded-full' src={user.user.image as string} width={50} height={50} alt='user image'/>
            </li>
            <li>
              <Link href={'/'}>
                Home
              </Link>
            </li>
            <li>
              <Link href={'/rooms'}>
                My Rooms
              </Link>
            </li>
            <li>
              <Form action={'/api/auth/signout'}>
                <button className='btn' type='submit'>signout</button>
              </Form> 
            </li>
          </ul>
        </nav>
      </header>
  )
}

export default SideBar

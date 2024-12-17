import { getServerSession } from 'next-auth';
import { authOptions } from '../api/lib/authOptionsConfig';
import MyLayout from './MyLayout';
async function HomePage() {
    const user =  await getServerSession(authOptions);
  return (
    <MyLayout>
      {/* Main Content */}
      <div className="w-full max-w-4xl p-6 mt-[100px] bg-white rounded-lg shadow-md flex flex-col">
        <h1 className='text-2xl font-semibold mb-6 text-center'>hi {user.user.name}! 👋</h1>
        
        <section className="mb-4">
          <h3 className="text-xl font-medium text-gray-800">User Information</h3>
          <p className="text-gray-700 mt-2">Name: <span className="font-semibold">{user.user.name}</span></p>
          <p className="text-gray-700 mt-1">Email: <span className="font-semibold">{user.user.email}</span></p>
          <p className='text-gray-700 mt-1'>account provider: {user.user.provider}</p>
        </section>
        
        <section className="mb-4">
          <h3 className="text-xl font-medium text-gray-800">Explore Rooms</h3>
          <p className="text-gray-700 mt-2">Check out the rooms available for you and start managing them effectively.</p>
        </section>
        
        <section className="mb-4">
          <h3 className="text-xl font-medium text-gray-800">Get Started</h3>
          <p className="text-gray-700 mt-2">Begin by exploring the rooms or creating a new one tailored to your needs.</p>
        </section>
      </div>
    </MyLayout>
  )
}

export default HomePage

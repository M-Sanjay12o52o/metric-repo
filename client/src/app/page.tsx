import { getServerSession } from "next-auth";
import Link from "next/link";
import { options } from "./api/auth/[...nextauth]/options";

export default async function Home() {
  const session = await getServerSession(options)

  return (
    <div className='w-screen h-screen bg-gray-700'>
      <h1 className="flex flex-col items-center pt-12 rounded-lg font-bold text-5xl text-black">
        Hello {session?.user?.name}!
      </h1>
      <div className='flex justify-center gap-8 pt-36'>
        <button className='w-32 h-12 bg-blue-500 rounded-md text-xl'>
          <Link href={"/create"}>Create</Link>
        </button>
        <button className='w-32 h-12 bg-blue-500 rounded-md text-xl'>
          <Link href={"/join"}>Join</Link>
        </button>
      </div>
    </div>
  )
}

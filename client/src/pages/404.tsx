import Link from 'next/link'


const NotFound = () => {
  return (
    <div className='flex flex-col items-center'>
      <div className="mt-10 mb-4 text-5xl text-gray-800">
        Page Not Found
      </div>
      <Link href='/'>
        <a href="" className="px-4 py-2">Go Home</a>
      </Link>
    </div>
  )
}

export default NotFound
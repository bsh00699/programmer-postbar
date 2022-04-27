import dayjs from "dayjs"
import { Sub } from "../common/types"
import { useAuthState } from '../ctx/auth'
import Link from 'next/link'


const SideBar = ({ sub }: { sub: Sub }) => {
  const { createdAt, description, name } = sub
  const { authenticated } = useAuthState()

  return (
    <div className='mt-4 ml-6 w-80'>
      <div className="bg-white rounded">
        <div className="p-3 bg-blue-500 rounded-t">
          <div className="font-semibold text-white">Abou Community</div>
        </div>
        <div className="p-3">
          <p className="mb-3 text-md">{description}</p>
          <div className="flex mb-3 text-sm font-medium">
            <div className='w-1/2'>
              <div>5.2k</div>
              <div>memmbers</div>
            </div>
            <div className='w-1/2'>
              <div>100</div>
              <div>online</div>
            </div>
          </div>
          {/* created date */}
          <div className='my-3'>
            <i className='mr-2 fas fa-birthday-cake'></i>
            Created {dayjs(createdAt).format('D MMM YYYY')}
          </div>
          {/* create post btn */}
          {
            authenticated && (
              <Link href={`/r/${name}/submit`}>
                <div className="w-full py-1 text-sm blue button">
                  Create Post
                </div>
              </Link>
            )
          }

        </div>

      </div>

    </div>
  )
}

export default SideBar
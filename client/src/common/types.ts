export interface Post {
  identifier: string
  body: string
  title: string
  slug: string
  subName: string
  createdAt: string
  updatedAt: string
  username: string
  url: string
  voteScore?: number
  commentCount?: number
  userVote?: number
  sub?: Sub
}

export interface User {
  username: string
  email: string
  createdAt: string
  updatedAt: string
}
export interface Sub {
  createdAt: string
  updatedAt: string
  name: string
  title: string
  description: string
  imageUrn: string
  bannerUrn: string
  username: string
  posts: Post[]
  imageUrl: string
  bannerUrl: string
  postCount?: string
}


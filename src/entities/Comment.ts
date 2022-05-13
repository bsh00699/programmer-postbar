import {
  Entity as TOEntity,
  Column,
  Index,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
  OneToMany
} from "typeorm";
import EntityInter from './Entity'
import { makeId } from '../util/helper'
import User from './User'
import Post from './Post'
import Vote from "./Vote";
import { Exclude, Expose } from 'class-transformer'

@TOEntity('comments')
export default class Comment extends EntityInter {
  constructor(comment: Partial<Comment>) {
    super()
    Object.assign(this, comment)
  }

  @Index()
  @Column()
  identifier: string

  @Column()
  body: string

  @Column()
  username: string

  // 每个用户可以有多个评论
  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User

  // 每个帖子也有多个评论
  @ManyToOne(() => Post, post => post.comments, { nullable: false })
  post: Post

  @Exclude()
  @OneToMany(() => Vote, vote => vote.comment)
  votes: Vote[]

  @Expose() get voteScore(): number {
    return this.votes?.reduce((prev, curr) => {
      return prev + (curr.value || 0)
    }, 0)
  }

  protected userVote: number
  setUserVote(user: User) {
    const index = this.votes?.findIndex(v => v.username === user.username)
    this.userVote = index !== -1 ? this.votes[index].value : 0
  }

  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = makeId(8)  // 参数尽量大一点，增加它为唯一数量级的概率
  }
}
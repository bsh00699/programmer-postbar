import {
  Entity as TOEntity,
  Column,
  Index,
  BeforeInsert,
  ManyToOne,
  JoinColumn
} from "typeorm";
import EntityInter from './Entity'
import { makeId } from '../util/helper'
import User from './User'
import Post from './Post'

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

  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = makeId(8)  // 参数尽量大一点，增加它为唯一数量级的概率
  }
}
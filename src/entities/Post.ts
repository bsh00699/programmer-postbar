import { IsEmail, Length } from "class-validator";
import {
  Entity as TOEntity,
  Column,
  Index,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
  OneToMany,
  AfterLoad
} from "typeorm";
import bcrypt from 'bcrypt'
import { Exclude, Expose } from 'class-transformer'
import EntityInter from './Entity'
import User from './User'
import Sub from './Sub'
import Vote from "./Vote";
import { makeId, slugify } from '../util/helper'
import Comment from "./Comment";

@TOEntity("posts")
export default class Post extends EntityInter {
  constructor(post: Partial<Post>) {
    super()
    Object.assign(this, post)
  }

  @Index()
  @Column()
  identifier: string

  @Column()
  title: string

  @Index()
  @Column()
  slug: string

  @Column({ nullable: true, type: 'text' })
  body: string

  @Column()
  subName: string  // 文章子名称

  @Column()
  username: string

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User

  @ManyToOne(() => Sub, (sub) => sub.posts)
  @JoinColumn({ name: 'subName', referencedColumnName: 'name' })
  sub: Sub

  @Exclude()
  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[]

  @Exclude()
  @OneToMany(() => Vote, vote => vote.post)
  votes: Vote[]

  // 可以这样添加新的 url 字段
  @Expose() get url(): string {
    return `/r/${this.subName}/${this.identifier}/${this.slug}`
  }

  @Expose() get commentCount(): number {
    return this.comments?.length
  }

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

  // 也这样添加新的 url 字段
  // protected url: string
  // @AfterLoad()
  // createFields() {
  //   this.url = `/r/${this.subName}/${this.identifier}/${this.slug}`
  // }

  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = makeId(7) // 参数尽量大一点，增加它为唯一数量级的概率
    this.slug = slugify(this.title)
  }
}

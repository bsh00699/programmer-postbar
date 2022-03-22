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
import { makeId, slugify } from '../util/helper'
import Comment from "./Comments";

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

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[]

  // 可以这样添加新的 url 字段
  @Expose() get url(): string {
    return `/r/${this.subName}/${this.identifier}/${this.slug}`
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

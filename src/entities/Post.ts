import { IsEmail, Length } from "class-validator";
import {
  Entity as TOEntity,
  Column,
  Index,
  BeforeInsert,
  ManyToOne,
  JoinColumn
} from "typeorm";
import bcrypt from 'bcrypt'
import { Exclude } from 'class-transformer'
import EntityInter from './Entity'
import User from './User'
import Sub from './Sub'
import { makeId, slugify } from '../util/helper'

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

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User

  @ManyToOne(() => Sub, (sub) => sub.posts)
  @JoinColumn({ name: 'subName', referencedColumnName: 'name' })
  sub: Sub

  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = makeId(7) // 参数尽量大一点，增加它为唯一数量级的概率
    this.slug = slugify(this.title)
  }
}

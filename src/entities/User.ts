import { IsEmail, Length } from "class-validator";
import {
  Entity as TOEntity,
  Column,
  Index,
  BeforeInsert,
  OneToMany
} from "typeorm";
import bcrypt from 'bcrypt'
import { Exclude } from 'class-transformer'
import EntityInter from './Entity'
import Post from './Post'

@TOEntity("users")
export default class User extends EntityInter {
  constructor(user: Partial<User>) {
    super()
    Object.assign(this, user)
  }

  @Index()
  @IsEmail()
  @Column({ unique: true })
  email: string;

  @Index()
  @Length(3, 255, { message: 'Username must be at least 3 characters long' })
  @Column({ unique: true })
  username: string;

  @Exclude()
  @Column()
  @Length(6, 255)
  password: string;

  @OneToMany((type) => Post, (post) => post.user) // 一个用户可以对应多个post
  posts: Post[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 6)
  }
}

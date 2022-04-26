import {
  Entity as TOEntity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany
} from "typeorm";
import EntityInter from './Entity'
import User from './User'
import Post from './Post'
import { Expose } from "class-transformer";

@TOEntity("subs")
export default class Sub extends EntityInter {
  constructor(sub: Partial<Sub>) {
    super()
    Object.assign(this, sub)
  }

  @Index()
  @Column({ unique: true })
  name: string

  @Column()
  title: string

  @Column({ type: 'text', nullable: true }) // desc 允许为空
  description: string

  @Column({ nullable: true })
  imageUrn: string

  @Column({ nullable: true }) // 横幅
  bannerUrn: string

  @Column()
  username: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User

  @OneToMany(() => Post, post => post.subName)
  posts: Post

  @Expose()
  get imageUrl(): string {
    return this.imageUrn ? `${process.env.APP_URL}/images/${this.imageUrn}`
      : `${process.env.APP_URL}/_img/gravatar.png`
  }

  @Expose()
  get bannerUrl(): string | undefined {
    return this.bannerUrn ? `${process.env.APP_URL}/images/${this.bannerUrn}`
      : undefined
  }
}

import {
  Entity as TOEntity,
  Column,
  JoinColumn,
  ManyToOne
} from "typeorm";
import EntityInter from './Entity'
import User from './User'
import Post from './Post'
import Comment from "./Comments";

@TOEntity("votes")
export default class Vote extends EntityInter {
  constructor(vote: Partial<Vote>) {
    super()
    Object.assign(this, vote)
  }

  @Column()
  value: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User

  @ManyToOne(() => Post)
  post: Post

  @ManyToOne(() => Comment)
  comment: Comment

  @Column()
  username: string;
}

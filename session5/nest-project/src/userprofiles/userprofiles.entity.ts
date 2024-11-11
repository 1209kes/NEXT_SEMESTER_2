import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/users/users.entity";

@Entity()
export class Userprofile {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ nullable: true })
    bio: string;
    
    @Column({ nullable: true })
    avatarUrl: string;
    
    @OneToOne(() => User, user => user.profile, {eager: true})
    @JoinColumn()
    user: User;
}
import { Client } from '../../client/entities/client.entity'
import { Entity, Column, PrimaryGeneratedColumn, BeforeUpdate, BeforeInsert, ManyToOne, JoinColumn } from 'typeorm'

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string

    @Column({ unique: true })
    email: string

    @Column({ unique: true })
    username: string

    @Column()
    password: string

    @Column({ nullable: true })
    name: string

    @Column({ nullable: true })
    walletAddress: string

    @Column({ default: false })
    isVerified: boolean

    @Column({ nullable: true })
    verificationToken: string

    @ManyToOne(() => Client, { nullable: true }) // Mối quan hệ ManyToOne với Client
    @JoinColumn({ name: 'clientId' }) // Tên cột trong bảng user sẽ là clientId
    client: Client

    @Column({ nullable: true }) // Cột clientId lưu trữ ID của Client
    clientId: string

    @Column({ type: 'int', width: 11, update: false })
    createdAt: number

    @Column({ type: 'int', width: 11, nullable: true })
    updatedAt: number

    @BeforeUpdate()
    public setUpdatedAt() {
        this.updatedAt = ~~(Date.now() / 1000)
    }

    @BeforeInsert()
    public setCreatedAt() {
        this.createdAt = ~~(Date.now() / 1000)
    }
}

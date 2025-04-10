import { Entity, Column, PrimaryGeneratedColumn, BeforeUpdate, BeforeInsert } from 'typeorm'

@Entity()
export class Client {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: number

    @Column()
    name: string

    @Column({ unique: true })
    clientId: string

    @Column()
    clientSecret: string

    @Column()
    redirectUri: string

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

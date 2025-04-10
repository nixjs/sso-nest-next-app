import { Injectable, ConflictException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as crypto from 'crypto'
import { Client } from './entities/client.entity'

@Injectable()
export class ClientService {
    constructor(
        @InjectRepository(Client)
        private clientRepository: Repository<Client>
    ) {}

    async create(name: string, clientId: string, redirectUri: string): Promise<Client> {
        const existingClient = await this.clientRepository.findOne({ where: { clientId } })
        if (existingClient) {
            throw new ConflictException('clientId already exists.')
        }

        const clientSecret = crypto.randomBytes(32).toString('hex')
        const client = this.clientRepository.create({
            name,
            clientId,
            clientSecret,
            redirectUri
        })

        return this.clientRepository.save(client)
    }

    async findAll(): Promise<Client[]> {
        return this.clientRepository.find()
    }

    async findOne(clientId: string): Promise<Client> {
        const client = await this.clientRepository.findOne({ where: { clientId } })
        if (!client) {
            throw new NotFoundException('clientId not found')
        }
        return client
    }

    async update(clientId: string, name: string, redirectUri: string): Promise<Client> {
        const client = await this.findOne(clientId)
        client.name = name
        client.redirectUri = redirectUri
        return this.clientRepository.save(client)
    }

    async delete(clientId: string): Promise<void> {
        const client = await this.findOne(clientId)
        await this.clientRepository.remove(client)
    }
}

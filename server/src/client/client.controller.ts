import { Controller, Post, Body, Get, Put, Delete, Param } from '@nestjs/common'
import { ClientService } from './client.service'
import { Client } from './entities/client.entity'

@Controller('client')
export class ClientController {
    constructor(private readonly clientService: ClientService) {}

    @Post()
    async createClient(
        @Body('name') name: string,
        @Body('clientId') clientId: string,
        @Body('redirectUri') redirectUri: string
    ): Promise<Client> {
        return this.clientService.create(name, clientId, redirectUri)
    }

    @Get()
    async getAllClients(): Promise<Client[]> {
        return this.clientService.findAll()
    }

    @Get(':clientId')
    async getClientById(@Param('clientId') clientId: string): Promise<Client> {
        return this.clientService.findOne(clientId)
    }

    @Put(':clientId')
    async updateClient(
        @Param('clientId') clientId: string,
        @Body('name') name: string,
        @Body('redirectUri') redirectUri: string
    ): Promise<Client> {
        return this.clientService.update(clientId, name, redirectUri)
    }

    @Delete(':clientId')
    async deleteClient(@Param('clientId') clientId: string): Promise<void> {
        return this.clientService.delete(clientId)
    }
}

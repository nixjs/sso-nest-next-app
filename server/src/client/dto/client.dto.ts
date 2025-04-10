import { IsNotEmpty } from 'class-validator'

export class ClientDto {
    @IsNotEmpty({ message: 'Name not empty' })
    name: string

    @IsNotEmpty({ message: 'Client id not empty' })
    clientId: string

    @IsNotEmpty({ message: 'Redirect uri id not empty' })
    redirectUri: string
}

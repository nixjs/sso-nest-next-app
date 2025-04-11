import { Address, createPublicClient, Hex, http } from 'viem'
import { bscTestnet, bsc } from 'viem/chains'

export const getPublicClient = (env: 'dev' | 'prod') => {
    const chain = env === 'dev' ? bscTestnet : bsc
    return createPublicClient({
        chain,
        transport: http()
    })
}

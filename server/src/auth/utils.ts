import { Address, Hex } from 'viem'
import * as crypto from 'crypto'
import { getPublicClient } from '../utils/viem.config'

export const createNonce = () => crypto.randomBytes(16).toString('hex')

export const verifyMessage = async ({
    nonce,
    address,
    signature,
    env
}: {
    nonce: string
    address: string
    signature: string
    env: 'dev' | 'prod'
}) => {
    try {
        const publicClient = getPublicClient(env)
        return await publicClient.verifyMessage({
            address: address as Address,
            message: nonce,
            signature: signature as Hex
        })
    } catch (err) {
        return false
    }
}

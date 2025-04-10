import axios from 'axios'
import { toQueryString } from './helpers'

export interface ClientPayload {
    client_id: string
    client_secret: string
    redirect_uri: string
}

export const login = (apiUrl: string, payload: ClientPayload) => {
    window.location.href = `${apiUrl}/auth/login?${toQueryString(payload as unknown as Record<string, string>)}`
}

export const register = async (email: string, username: string, password: string, name: string, client_id: string) => {
    try {
        const res = await axios.post(`/api/user/register?client_id=${client_id}`, { email, username, password, name })
        return res.data
    } catch (error) {
        console.log({ message: 'Lỗi khi đăng ký' })
    }
}

export const fetchUserInfo = async (accessToken: string) => {
    try {
        const res = await axios.get('/api/auth/userinfo', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        return res.data
    } catch (error) {
        throw error
    }
}

export const refreshToken = async () => {
    try {
        const sessionId = localStorage.getItem('session_id')
        if (!sessionId) throw new Error('session ID not found')

        const res = await axios.post('/api/auth/refresh', { session_id: sessionId })
        const { access_token, session_id: newSessionId } = res.data
        localStorage.setItem('access_token', access_token)
        localStorage.setItem('session_id', newSessionId)
        return { access_token }
    } catch (error) {
        localStorage.clear()
        throw error
    }
}

export const checkSession = async (client: Pick<ClientPayload, 'client_id' | 'client_secret'>, sessionId?: string, tempToken?: string) => {
    try {
        const { client_id, client_secret } = client
        if (tempToken) {
            const res = await axios.post('/api/auth/check-session', {
                client_id,
                client_secret,
                session_id: tempToken
            })
            const { access_token, session_id: newSessionId } = res.data
            localStorage.setItem('access_token', access_token)
            localStorage.setItem('session_id', newSessionId)
            return { access_token }
        }

        const sessionIdToUse = sessionId || localStorage.getItem('session_id')
        if (!sessionIdToUse) {
            throw new Error('session ID not found')
        }

        const res = await axios.post('/api/auth/check-session', {
            client_id,
            client_secret,
            session_id: sessionIdToUse
        })
        const { access_token, session_id: newSessionId } = res.data
        localStorage.setItem('access_token', access_token)
        localStorage.setItem('session_id', newSessionId)
        return { access_token }
    } catch (error) {
        console.log({ message: 'Invalid session' })
    }
}

export const logout = async () => {
    try {
        const sessionId = localStorage.getItem('session_id')
        if (sessionId) {
            await axios.post('/api/auth/logout', { session_id: sessionId })
        }
        localStorage.removeItem('access_token')
        localStorage.removeItem('session_id')
    } catch (error) {
        console.log('Failed to logout')
    }
}

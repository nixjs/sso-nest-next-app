'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function CallbackTemplate() {
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        const accessToken = searchParams.get('access_token')
        const sessionId = searchParams.get('session_id')
        const tempToken = searchParams.get('temp_token')
        console.log('Access Token from query:', accessToken)
        console.log('Session ID from query:', sessionId)
        console.log('Temp Token from query:', tempToken)

        if (accessToken && (sessionId || tempToken)) {
            localStorage.setItem('access_token', accessToken)
            localStorage.setItem('session_id', sessionId || tempToken || '')
            console.log('Access Token stored in localStorage:', localStorage.getItem('access_token'))
            console.log('Session ID stored in localStorage:', localStorage.getItem('session_id'))
            router.push('/')
        } else {
            console.error('No access token or session ID/temp token found in query parameters')
            router.push('/')
        }
    }, [router, searchParams])

    return (
        <div className="min-h-screen flex items-center justify-center">
            <p>Processing...</p>
        </div>
    )
}

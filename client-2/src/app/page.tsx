'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { fetchUserInfo, login, refreshToken, checkSession, logout } from '../lib/auth'
import { useSearchParams } from 'next/navigation'

export default function Home() {
    const [user, setUser] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)
    const searchParams = useSearchParams()

    // useEffect(() => {
    //     const checkUserSession = async () => {
    //         const accessToken = localStorage.getItem('access_token')
    //         console.log('Access Token from localStorage:', accessToken)

    //         const tryFetchUserInfo = async (token: string) => {
    //             try {
    //                 const data = await fetchUserInfo(token)
    //                 setUser(data)
    //             } catch (err: any) {
    //                 if (err.response?.status === 401) {
    //                     try {
    //                         const { access_token } = await refreshToken()
    //                         tryFetchUserInfo(access_token)
    //                     } catch (refreshError) {
    //                         try {
    //                             const { access_token }: any = await checkSession()
    //                             tryFetchUserInfo(access_token)
    //                         } catch (sessionError) {
    //                             console.log('Phiên không hợp lệ:', sessionError)
    //                         }
    //                     }
    //                 } else {
    //                     setError('Lỗi khi lấy thông tin người dùng')
    //                 }
    //             }
    //         }

    //         if (accessToken) {
    //             await tryFetchUserInfo(accessToken)
    //         } else {
    //             try {
    //                 const { access_token }: any = await checkSession()
    //                 await tryFetchUserInfo(access_token)
    //             } catch (sessionError) {
    //                 console.log('Phiên không hợp lệ:', sessionError)
    //             }
    //         }
    //     }

    //     checkUserSession()
    // }, [])

    // const handleLogin = async () => {
    //     setError(null)
    //     const accessToken = localStorage.getItem('access_token')
    //     console.log('Access Token from localStorage:', accessToken)

    //     const tryFetchUserInfo = async (token: string) => {
    //         try {
    //             const data = await fetchUserInfo(token)
    //             setUser(data)
    //         } catch (err: any) {
    //             if (err.response?.status === 401) {
    //                 try {
    //                     const { access_token } = await refreshToken()
    //                     tryFetchUserInfo(access_token)
    //                 } catch (refreshError) {
    //                     try {
    //                         const { access_token }: any = await checkSession()
    //                         tryFetchUserInfo(access_token)
    //                     } catch (sessionError) {
    //                         login() // Chuyển hướng đến trang đăng nhập nếu không có session
    //                     }
    //                 }
    //             } else {
    //                 setError('Lỗi khi lấy thông tin người dùng')
    //             }
    //         }
    //     }

    //     if (accessToken) {
    //         tryFetchUserInfo(accessToken)
    //     } else {
    //         try {
    //             const { access_token }: any = await checkSession()
    //             tryFetchUserInfo(access_token)
    //         } catch (sessionError) {
    //             login() // Chuyển hướng đến trang đăng nhập nếu không có session
    //         }
    //     }
    // }

    useEffect(() => {
        const checkUserSession = async () => {
            const accessToken = localStorage.getItem('access_token')
            const sessionIdFromQuery = searchParams.get('session_id')
            const tempTokenFromQuery = searchParams.get('temp_token')
            console.log('Access Token from localStorage:', accessToken)
            console.log('Session ID from query:', sessionIdFromQuery)
            console.log('Temp Token from query:', tempTokenFromQuery)

            const tryFetchUserInfo = async (token: string) => {
                try {
                    const data = await fetchUserInfo(token)
                    setUser(data)
                } catch (err: any) {
                    if (err.response?.status === 401) {
                        try {
                            const { access_token } = await refreshToken()
                            tryFetchUserInfo(access_token)
                        } catch (refreshError) {
                            try {
                                const { access_token }: any = await checkSession(
                                    sessionIdFromQuery ?? undefined,
                                    tempTokenFromQuery ?? undefined
                                )
                                tryFetchUserInfo(access_token)
                            } catch (sessionError) {
                                console.log('Phiên không hợp lệ:', sessionError)
                            }
                        }
                    } else {
                        setError('Lỗi khi lấy thông tin người dùng')
                    }
                }
            }

            if (accessToken) {
                await tryFetchUserInfo(accessToken)
            } else {
                try {
                    const { access_token }: any = await checkSession(sessionIdFromQuery ?? undefined, tempTokenFromQuery ?? undefined)
                    await tryFetchUserInfo(access_token)
                } catch (sessionError: any) {
                    console.log('Phiên không hợp lệ:', sessionError)
                }
            }
        }

        checkUserSession()
    }, [searchParams])

    const handleLogin = async () => {
        setError(null)
        const accessToken = localStorage.getItem('access_token')
        console.log('Access Token from localStorage:', accessToken)

        const tryFetchUserInfo = async (token: string) => {
            try {
                const data = await fetchUserInfo(token)
                setUser(data)
            } catch (err: any) {
                if (err.response?.status === 401) {
                    try {
                        const { access_token } = await refreshToken()
                        tryFetchUserInfo(access_token)
                    } catch (refreshError) {
                        try {
                            const { access_token }: any = await checkSession()
                            tryFetchUserInfo(access_token)
                        } catch (sessionError) {
                            login() // Chuyển hướng đến trang đăng nhập nếu không có session
                        }
                    }
                } else {
                    setError('Lỗi khi lấy thông tin người dùng')
                }
            }
        }

        if (accessToken) {
            await tryFetchUserInfo(accessToken)
        } else {
            try {
                const { access_token }: any = await checkSession()
                await tryFetchUserInfo(access_token)
            } catch (sessionError) {
                login() // Chuyển hướng đến trang đăng nhập nếu không có session
            }
        }
    }

    const handleRegister = async () => {
        setError(null)
        const accessToken = localStorage.getItem('access_token')
        console.log('Access Token from localStorage:', accessToken)

        const tryFetchUserInfo = async (token: string) => {
            try {
                const data = await fetchUserInfo(token)
                setUser(data)
            } catch (err: any) {
                if (err.response?.status === 401) {
                    try {
                        const { access_token } = await refreshToken()
                        tryFetchUserInfo(access_token)
                    } catch (refreshError) {
                        try {
                            const { access_token }: any = await checkSession()
                            tryFetchUserInfo(access_token)
                        } catch (sessionError) {
                            window.location.href = '/register' // Chuyển hướng đến trang đăng ký nếu không có session
                        }
                    }
                } else {
                    setError('Lỗi khi lấy thông tin người dùng')
                }
            }
        }

        if (accessToken) {
            tryFetchUserInfo(accessToken)
        } else {
            try {
                const { access_token }: any = await checkSession()
                tryFetchUserInfo(access_token)
            } catch (sessionError) {
                window.location.href = '/register' // Chuyển hướng đến trang đăng ký nếu không có session
            }
        }
    }

    const handleLogout = async () => {
        try {
            await logout()
            setUser(null)
            setError(null)
        } catch (error) {
            setError('Lỗi khi đăng xuất')
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mb-4">Website B</h1>
            {error && <p className="text-red-500">{error}</p>}
            {!user ? (
                <div className="flex flex-col gap-4">
                    <button onClick={handleLogin} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Đăng nhập qua SSO
                    </button>
                    <button onClick={handleRegister} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                        Đăng ký tài khoản
                    </button>
                </div>
            ) : (
                <div className="text-center">
                    <p className="text-lg">
                        Xin chào, {user.name} ({user.email})
                    </p>
                    <Link
                        href={`http://localhost:3001?session_id=${localStorage.getItem('session_id') || ''}`}
                        className="text-blue-500 hover:underline"
                    >
                        Đi đến Website A
                    </Link>
                    <div className="mt-4">
                        <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                            Đăng xuất
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

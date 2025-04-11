export function getAccessToken(authorization: string): string | null {
    // Check if the authorization header is provided and starts with 'Bearer '
    if (!authorization || !authorization.startsWith('Bearer ')) {
        return null
    }

    // Extract the token by removing 'Bearer ' prefix
    const token = authorization.substring(7) // 'Bearer ' is 7 characters long
    return token
}

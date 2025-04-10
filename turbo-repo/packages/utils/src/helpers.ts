export function toQueryString(payload: Record<string, string>): string {
    return Object.entries(payload)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&')
}

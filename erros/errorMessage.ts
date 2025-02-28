export const getErrorMessage = (e: unknown): string => {
    if (e instanceof Error) return e.message
    if (typeof e === 'object' && e !== null && 'message' in e) return String(e.message)
    return 'Ocorreu um erro desconhecido.'
}
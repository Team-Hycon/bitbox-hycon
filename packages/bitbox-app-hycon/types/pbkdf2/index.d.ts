declare module 'pbkdf2'
{
    export function pbkdf2Sync(password: string, salt: string, iterations: number, keylen: number, digest: string): Buffer
}
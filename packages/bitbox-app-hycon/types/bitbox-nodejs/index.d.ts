declare module '@glosfer/bitbox-nodejs'
{
    export class Communication {
        constructor(deviceID: string)
        public close(): void
        public sendPlain(msg: string): any
        public sendEncrypted(msg: string, fun: (respond: any) => void): void
        public setCommunicationSecret(password: string): void
    }

    export const hid: {
        getDeviceInfo(): any
        openDevice(): any
    }
}
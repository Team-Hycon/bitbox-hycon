import { Communication } from "@glosfer/bitbox-nodejs"
import { pbkdf2Sync } from "pbkdf2"

const nameRegex = /^[0-9a-zA-Z-_ ]{1,31}$/
export interface IresponseEcho { echo: string, error: IResponseError }
export interface IResponseSign { sign: ISign[], error: IResponseError }
interface ISign { sig: string, recid: string }
export interface IResponseStatus { device: IDevice, error: IResponseError }
interface IResponseError { message: string, code: number, command: string }
export interface IResponseGetXPub { xpub: string, echo: string, error: IResponseError }
interface IDevice { serial: string, version: string, name: string, id: string, seeded: boolean, lock: boolean, bootlock: boolean, sdcard: boolean, TFA: string, U2F: boolean, U2F_hijack: boolean }
export interface IResponseSeed { error: string, seed: string }
export interface IResponseDelete { error: string, backup: string }
export interface IResponseReset { error: string, reset: string }
export interface IResponsePassword { error: string, password: string }

export interface IResponseName { error: string, name: string }
function stretchKey(key: any) {
    return pbkdf2Sync(key, "Digital Bitbox", 20480, 64, "sha512").toString("hex")
}

export class BitBox {
    // set password or not
    public initialize: boolean
    // has wallet or not
    public seeded: boolean
    private communication: Communication
    private password: string
    private deviceID: string

    constructor(deviceID: string) {
        this.deviceID = deviceID
        this.communication = new Communication(deviceID)
        this.initialize = false
        this.seeded = false
    }

    public getDeviceID() {
        return this.deviceID
    }

    // to check whether bitbox's password is set up. Plain text communication
    public ping() {
        try {
            const response = this.communication.sendPlain('{"ping":""}')
            if (response.ping === "password") {
                this.initialize = true
            }
            return response
        } catch (e) {
            throw e
        }
    }
    // create password for bitbox
    public createPassword(password: string) {
        try {
            const response = this.communication.sendPlain('{ "password" : "' + password + '" }')
            if (!response.error) {
                this.setPassword(password)
                this.initialize = true
            }
        } catch (e) {
            throw e
        }
    }
    // helper function, set password for communication encryption
    public setPassword(password: string) {
        try {
            this.communication.setCommunicationSecret(password)
            this.password = password
        } catch (e) {
            throw e
        }
    }
    public async deviceInfo(): Promise<IResponseStatus> {
        try {
            return new Promise<IResponseStatus>((resolved, rejected) => {
                return this.communication.sendEncrypted('{"device": "info"}', (response: IResponseStatus) => {
                    if (!response.error) {
                        resolved(response)
                    } else {
                        rejected(response)
                    }
                })
            })
        } catch (e) {
            throw e
        }
    }

    public async createWallet(name: any): Promise<IResponseSeed> {
        try {
            return new Promise<IResponseSeed>((resolved, rejected) => {
                if (!name || !nameRegex.exec(name)) {
                    rejected("Only 1 to 31 alphanumeric characters are allowed.")
                }
                const stretchedKey = stretchKey(this.password)
                // console.log("stretchedKey: " + stretchedKey)
                this.communication.sendEncrypted('{ "seed" : { "source" : "create", "key" : "' + stretchedKey + '", "filename" : "' + name + '.pdf" }}', (response: IResponseSeed) => {
                    if (!response.error) {
                        resolved(response)
                        this.seeded = true
                    } else {
                        rejected(response)
                    }
                })
            })
        } catch (e) {
            throw e
        }
    }

    public async setName(name: any): Promise<IResponseName> {
        try {
            return new Promise<IResponseName>((resolved, rejected) => {
                if (!name || !nameRegex.exec(name)) {
                    rejected("Only 1 to 31 alphanumeric characters are allowed.")
                }
                this.communication.sendEncrypted('{"name": "' + name + '"}', (response: IResponseName) => {
                    if (!response.error) {
                        resolved(response)
                    } else {
                        rejected(response)
                    }
                })
            })
        } catch (e) {
            throw e
        }
    }

    public async deleteAllWallets() {
        try {
            return new Promise((resolved, rejected) => {
                this.communication.sendEncrypted('{"backup": "erase"}', (response: IResponseDelete) => {
                    if (!response.error) {
                        resolved(response)
                    } else {
                        rejected(response)
                    }
                })
            })
        } catch (e) {
            throw e
        }
    }

    // get extended public key by specified keypath. for hycon "m/44'/1397'/0'/0/0"
    public async getXPub(keypath: string) {
        try {
            return new Promise<IResponseGetXPub>((resolved, rejected) => {
                this.communication.sendEncrypted('{ "xpub" : "' + keypath + '" }', (response: IResponseGetXPub) => {
                    if (!response.error) {
                        resolved(response)
                    } else {
                        rejected(response)
                    }
                })
            })
        } catch (e) {
            throw e
        }

    }

    public async sign(keypath: string, hash: string) {
        try {
            return new Promise<IResponseSign>((resolved, rejected) => {
                const signRequest1 = '{ "sign" : { "meta" : "hash", "data" : [{ "keypath" : "' + keypath + '", "hash" : "' + hash + '" }]}}'
                const signRequest2 = '{ "sign" : "" }'
                this.communication.sendEncrypted(signRequest1, (response1: IresponseEcho) => {
                    if (!response1.error) {
                        this.communication.sendEncrypted(signRequest2, (response2: IResponseSign) => {
                            if (!response2.error) {
                                resolved(response2)
                            } else {
                                rejected(response2)
                            }
                        })
                    } else {
                        rejected(response1)
                    }
                })
            })
        } catch (e) {
            throw e
        }
    }

    public async reset() {
        try {
            return new Promise((resolved, rejected) => {
                this.communication.sendEncrypted('{"reset": "__ERASE__"}', (response: IResponseReset) => {
                    if (!response.error) {
                        this.setPassword("")
                        this.initialize = false
                        this.seeded = false
                        resolved(response)
                    } else {
                        rejected(response)
                    }
                })
            })
        } catch (e) {
            throw e
        }
    }

    public async updatePassword(password: string) {
        try {
            return new Promise((resolved, rejected) => {
                this.communication.sendEncrypted('{ "password" : "' + password + '" }', (response: IResponsePassword) => {
                    if (!response.error) {
                        this.setPassword(password)
                        this.initialize = true
                        resolved(response)
                    } else {
                        rejected(response)
                    }
                })
            })
        } catch (e) {
            throw e
        }
    }

    public close() {
        try {
            this.communication.close()
        } catch (e) {
            throw e
        }
    }
}

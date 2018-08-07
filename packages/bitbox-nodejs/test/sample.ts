import { HDKey } from "hdkey"
import { Address } from "../../common/address"
import { PublicKey } from "../../common/publicKey"
import { Tx } from "../../common/tx"
import { SignedTx } from "../../common/txSigned"
import { Hash } from "../../util/hash"
import { Bitbox, IResponseGetXPub, IResponseSign, IResponseStatus } from "@glosfer/bitbox-nodejs"
import hid = require("bitbox-hid")
// tslint:disable-next-line:no-var-requires
const input = require("input")

export async function main() {
    const hidInfo = hid.getDeviceInfo()
    if (!hidInfo) {
        // tslint:disable-next-line:no-console
        console.warn(`Digital Bitbox not plugged in`)
    } else {
        const bitbox = new Bitbox(hidInfo.path)
        // tslint:disable-next-line:no-console
        console.log(`Found Digital Bitbox ${bitbox.getDeviceID()}`)

        bitbox.ping()
        let pw = await input.password("Please enter password: ")
        let status: IResponseStatus
        if (bitbox.initialize) {
            while (true) {
                bitbox.setPassword(pw)
                try {
                    status = await bitbox.deviceInfo()
                    // tslint:disable-next-line:no-console
                    console.log(status)
                    break
                } catch (e) {
                    // after 15 time incorrect password, return code 101, device been factory reset, ask to input new ps
                    if (e.error.code === 101) {
                        pw = await input.password("New Password: ")
                        bitbox.createPassword(pw)
                    } else {
                        // password is wrong, input password
                        pw = await input.password("Password is wrong, please input again: ")
                    }
                }
            }
        } else {
            bitbox.createPassword(pw)
            status = await bitbox.deviceInfo()
        }

        if (status && !status.device.seeded) {
            while (true) {
                try {
                    await bitbox.createWallet("test")
                    break
                } catch (e) {
                    await bitbox.deleteAllWallets()
                }
            }
        }
        const path = "m/44'/1397'/0'/0/0"
        const xpub: IResponseGetXPub = await bitbox.getXPub(path)
        const hdkey = HDKey.parseExtendedKey(xpub.xpub)
        const pubk = hdkey.publicKey
        // tslint:disable-next-line:no-console
        console.log(`Public key: ${pubk.toString("hex").length}, ${pubk.toString("hex")}`)
        const hyconPubK = new PublicKey(pubk)
        // tslint:disable-next-line:no-console
        console.log(`Hycon address: ${hyconPubK.address()}`)
        // stimulate tx sign and sending
        const from = "H4KMBfZj9DRhe8WPvJCEbTLMf5TvGFUFN"
        const to = "HA11nMmuTgeyEtBDCJdCJ8oRHcJ6DwAx"
        const amount = 0.000000001
        const fee = 0.000000001
        const nonce = 0
        const tx = new Tx({ from: new Address(from), to: new Address(to), amount, fee, nonce })
        const hash = new Hash(tx)
        // tslint:disable-next-line:no-console
        console.log(`tx hash is: ${hash.toHex().length}, ${hash.toHex()}`)

        const response: IResponseSign = await bitbox.sign(path, hash.toHex())
        if (response.sign) {
            const sign = response.sign[0].sig
            const recover = response.sign[0].recid
            const sig = Buffer.from(sign, "hex")
            const rec = Number(recover)
            const signTx = new SignedTx(tx, sig, rec)
            const ret = hyconPubK.verify(signTx)
            // tslint:disable-next-line:no-console
            console.log(`sign verification: ${ret}`)
        }
    }
}

main().catch((e) => {
    // tslint:disable-next-line:no-console
    console.warn(e)
})

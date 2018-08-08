const hid = require("../src/hid.js")

describe("Connection test", () => {

    it("call getDeviceInfo when device is not connected", () => {
        const hidInfo = hid.getDeviceInfo()
        expect(hidInfo).toBe(null)
    })

    it("call openDevice when device is not connected", () => {
        function result() {
            hid.openDevice(null)
        }
        expect(result).toThrow(new Error("cannot open device with path null"))
    })
})
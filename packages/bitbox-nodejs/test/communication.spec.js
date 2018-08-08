const { Communication } = require("../src/index")

describe("Communication test", () => {

    it("create new Communication class when device is not connected", () => {
        function result() {
            new Communication(null)
        }
        expect(result).toThrow(new Error("device is not available"))
    })
})
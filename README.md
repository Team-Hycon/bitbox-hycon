# BitBox Hycon
This repository hosts libraries to communicate with BitBox hardware wallet.


## Published packages

| Package | Description |
| --------|-------------|
| [`bitbox-hid`](/packages/bitbox-hid) | Node implementation of the communication layer using `node-hid` (USB) |
| [`@glosfer/bitbox-nodejs`](/packages/bitbox-nodejs) | Bitbox API for Hycon |


## Examples

```js
import hid = require("bitbox-hid")
import { Bitbox, IResponseGetXPub } from "@glosfer/bitbox-nodejs";
import HDKey = require("hdkey")

const getHyconAddress = async () => {
  const hidInfo = hid.getDeviceInfo()
  if (!hidInfo) {
    console.log(`Digital BitBox not plugged in`)
	return
  }
  const bitbox = new Bitbox(hidInfo.path)
  const xpub: IResponseGetXPub = await bitbox.getXPub("m/44'/1397'/0'/0/0")
  const hdkey = HDKey.parseExtendedKey(xpub.xpub)
  const result = hdkey.publicKey
  return result;
};
getHyconAddress().then(a => console.log(`Public key: ${a.toString("hex")}`));
```

## Issues & Pull Requests

If you have an issue, feel free to add it to the [Issues](https://github.com/Team-Hycon/bitbox-hycon/issues) tab.
If you'd like to help us out, the [Pull Request](https://github.com/Team-Hycon/bitbox-hycon/pulls) tab is a great place to start.

**If you have found a security bug, please contact us at [security@glosfer.com](security@glosfer.com).**

# BitBox API for Hycon
BitBox Hardware Wallet Node JS API for Hycon.

## Example

```js
import { hid } = require("@glosfer/bitbox-nodejs")
import { BitBox, IResponseGetXPub } from "@glosfer/bitbox-app-hycon";
import HDKey = require("hdkey")

const getHyconAddress = async () => {
    const hidInfo = hid.getDeviceInfo()
    if (!hidInfo) {
        console.log(`Digital BitBox not plugged in`)
        return
    }
    const bitbox = new BitBox(hidInfo.path)
    const xpub: IResponseGetXPub = await bitbox.getXPub("m/44'/1397'/0'/0/0")
    const hdkey = HDKey.parseExtendedKey(xpub.xpub)
    const result = hdkey.publicKey
    return result;
};
getHyconAddress().then(a => console.log(`Public key: ${a.toString("hex")}`));
```

### Install dependencies

```bash
npm install
```

### Build

```bash
npm build
```

### Deploy

Checklist before deploying a new release:

* you have the right in the glosfer org on NPM
* you have run `npm login` once (check `npm whoami`)
* Go to **master** branch
  * your master point on glosfer repository (check with `git config remote.$(git config branch.master.remote).url` and fix it with `git branch --set-upstream master origin/master`)
  * you are in sync (`git pull`) and there is no changes in `git status`
* Run `npm` once, there is still no changes in `git status`

**deploy a new release**

```
 npm run clean
 npm install
 npm run lint
 npm run build
 npm publish
```

then, go to [/releases](https://github.com/Team-Hycon/bitbox-hycon/releases) and create a release with change logs.

## Issues & Pull Requests

If you have an issue, feel free to add it to the [Issues](https://github.com/Team-Hycon/bitbox-hycon/issues) tab.
If you'd like to help us out, the [Pull Request](https://github.com/Team-Hycon/bitbox-hycon/pulls) tab is a great place to start.

**If you have found a security bug, please contact us at [security@glosfer.com](security@glosfer.com).**

# BitBox HID
Node implementation of the communication layer using `node-hid` (USB).

## Examples

```js
import hid from "bitbox-nodejs";

const hidInfo = hid.getDeviceInfo()
if (!hidInfo) {
  console.log(`Digital Bitbox is not plugged in`)
} else {
  console.log(`Successfully retrieved info: ${hidInfo}`)
}
```

### Install dependencies

```bash
npm install
```

### Deploy

Checklist before deploying a new release:

* you have the right on NPM
* you have run `npm login` once (check `npm whoami`)
* Go to **master** branch
  * your master point on repository (check with `git config remote.$(git config branch.master.remote).url` and fix it with `git branch --set-upstream master origin/master`)
  * you are in sync (`git pull`) and there is no changes in `git status`
* Run `npm` once, there is still no changes in `git status`

**deploy a new release**

```
 npm install
 npm test
 npm publish
```

then, go to [/releases](https://github.com/Team-Hycon/bitbox-hycon/releases) and create a release with change logs.

## Issues & Pull Requests

If you have an issue, feel free to add it to the [Issues](https://github.com/Team-Hycon/bitbox-hycon/issues) tab.
If you'd like to help us out, the [Pull Request](https://github.com/Team-Hycon/bitbox-hycon/pulls) tab is a great place to start.

**If you have found a security bug, please contact us at [security@glosfer.com](security@glosfer.com).**

## Credits
Kudos to [SHIFT team](https://shiftcrypto.ch/team) (Digital BitBox developers)
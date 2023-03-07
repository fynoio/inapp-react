# @fyno/inapp

> React SDK for Fyno's inapp notification center

[![NPM](https://img.shields.io/npm/v/@fyno/inapp.svg)](https://www.npmjs.com/package/@fyno/inapp) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

![Fyno: Fire your notifications](https://fynodev.s3.ap-south-1.amazonaws.com/others/Fyno_Banner.jpeg)

## Install

```bash
npm install --save @fyno/inapp
```

## Usage
Before installing Inapp Notification Center make sure you have generated HMAC signature in the backend by following the below process
```jsx
import crypto from "crypto";
const computedUserHmac = crypto
  .createHmac("sha256", "WSID"+"token")
  .update("USER_ID")
  .digest("hex");

```

```jsx
import {FynoInappCenter} from '@fyno/inapp'

class Example extends Component {
  const config = {
    userId: 'user_id',
    workspaceId: 'ws_id',
    signature: 'signature generated from backend'
    themeConfig: {
      logo: 'LINK_TO_BRAND_LOGO',
      primary: 'PRIMARY_COLOR',
      lightBackground: 'LIGHT_THEME_BACKGROUND_COLOR',
      darkBackground: 'DARK_THEME_BACKGROUND_COLOR'
    }//optional
  }
  render() {
    return <FynoInappCenter {...config}/>
  }
}
```
OR

```jsx
import {FynoInApp} from '@fyno/inapp'

class Example extends Component {
  const themeConfig: {
      logo: 'LINK_TO_BRAND_LOGO',
      primary: 'PRIMARY_COLOR',
      lightBackground: 'LIGHT_THEME_BACKGROUND_COLOR',
      darkBackground: 'DARK_THEME_BACKGROUND_COLOR'
  }//optional
  render() {  
    return <FynoInappCenter user="{userid}" workspace="{workspace_id}" signature="{signature generated from backend}" themeConfig={themeConfig}/>
  }
}
```

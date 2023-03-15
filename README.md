# @fyno/inapp-react

> React SDK for Fyno's inapp notification center

[![NPM](https://img.shields.io/npm/v/@fyno/inapp-react.svg)](https://www.npmjs.com/package/@fyno/inapp-react) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

![Fyno: Fire your notifications](https://fynodev.s3.ap-south-1.amazonaws.com/others/Fyno_Banner.jpeg)

## Install

```bash
npm install --save @fyno/inapp-react
```

## Usage
Before installing Inapp Notification Center make sure you have generated HMAC signature in the backend by following the below process
```jsx
import crypto from "crypto";
const computedUserHmac = crypto
  .createHmac("sha256", "WSID"+"INTEGRATION_TOKEN")
  .update("USER_ID")
  .digest("hex");

```

```jsx
import {FynoInappCenter} from '@fyno/inapp-react'

class Example extends Component {
  const config = {
    userId: 'USER_ID',
    workspaceId: 'WSID',
    signature: 'computedUserHmac'
    themeConfig: {
      logo: 'LINK_TO_BRAND_LOGO',
      primary: 'PRIMARY_COLOR',
      lightBackground: 'LIGHT_THEME_BACKGROUND_COLOR',
      darkBackground: 'DARK_THEME_BACKGROUND_COLOR'
    }, //optional
    notificationSettings: {
      sound: 'LINK_TO_NOTIFICATION_SOUND'
    } //optional
  }
  render() {
    return <FynoInappCenter {...config}/>
  }
}
```
OR

```jsx
import {FynoInApp} from '@fyno/inapp-react'

class Example extends Component {

  const themeConfig: {
      logo: 'LINK_TO_BRAND_LOGO',
      primary: 'PRIMARY_COLOR',
      lightBackground: 'LIGHT_THEME_BACKGROUND_COLOR',
      darkBackground: 'DARK_THEME_BACKGROUND_COLOR'
  }
  const notificationSettings = {
    sound: 'LINK_TO_NOTIFICATION_SOUND'
  }
  render() {  
    return <FynoInappCenter user="{userid}" workspace="{workspace_id}" signature="{signature generated from backend}" themeConfig={themeConfig} notificationSettings={notificationSettings}/>
  }
}
```

# @fyno/inapp-react

> React SDK for Fyno's inapp notification center

[![NPM](https://img.shields.io/npm/v/@fyno/inapp-react.svg)](https://www.npmjs.com/package/@fyno/inapp-react) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

![Fyno: Fire your notifications](https://fynodev.s3.ap-south-1.amazonaws.com/others/Fyno_Banner.jpeg)

## Install

```bash
npm install --save @fyno/inapp-react
```

## Usage

### Prerequisite

Before installing Inapp Notification Center make sure you have generated HMAC signature in the backend by following the below process. Make sure you pass your user distinct id in place of user id. This has to be generated for every user and the same needs to be passed to inapp-react SDK

- WSID - You can get workspace id from fyno [api keys](https://app.fyno.io/api-keys) page
- Integration Token - You can get integration token from [integration](https://app.fyno.io/integrations) page
- User ID - This has to be the distinct id of the user who is currently logged in. This will help fyno to identify the user to send user specific notifications

```jsx
import crypto from 'crypto'
const signature = crypto
  .createHmac('sha256', 'WSID' + 'INTEGRATION_TOKEN')
  .update('USER_ID')
  .digest('hex')
```

**_NOTE:_** Please make sure you are generating the signature on backend or middleware. You might expose your api keys if done on frontend.

### SDK Initlization in frontend

```jsx
import {FynoInappCenter} from '@fyno/inapp-react'

class Example extends Component {
  const config = {
    mode: 'THEME_MODE',//<light|dark>
    userId: 'USER_ID',
    workspaceId: 'WSID',
    integration: 'INTRGRATION_ID',
    signature: 'signature'
    themeConfig: {
      logo: 'LINK_TO_BRAND_LOGO',
      primary: 'PRIMARY_COLOR',
      lightBackground: 'LIGHT_THEME_BACKGROUND_COLOR',
      darkBackground: 'DARK_THEME_BACKGROUND_COLOR'
      header: 'Notifications' // By default the header will not be shown to make the UX better, If specified header will be shown with the title specified in inapp-center.
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
import {FynoInappCenter} from '@fyno/inapp-react'

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
    return <FynoInappCenter theme="light" user="{userid}" workspace="{workspace_id}" integration="{integration_id}" signature="{signature generated from backend}" themeConfig={themeConfig} notificationSettings={notificationSettings}/>
  }
}
```

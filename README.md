![Fyno: Fire your notifications](https://fynodev.s3.ap-south-1.amazonaws.com/others/Fyno_Banner.jpeg)

# fyno-inapp

> Made with create-react-library

[![NPM](https://img.shields.io/npm/v/fyno-inapp.svg)](https://www.npmjs.com/package/fyno-inapp) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save @fyno/inapp
```

## Usage

```jsx
import {FynoInappCenter} from '@fyno/inapp'
import '@fyno/inapp/dist/index.css'

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
import '@fyno/inapp/dist/index.css'

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

<!-- # @fyno/inapp-react

[![NPM](https://img.shields.io/npm/v/@fyno/inapp-react.svg)](https://www.npmjs.com/package/@fyno/inapp-react) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

![Fyno: Fire your notifications](https://fynodev.s3.ap-south-1.amazonaws.com/others/Fyno_Banner.jpeg)

**Fyno In-app React SDK**:
This React library allows you to easily integrate Fyno's in-app notification center into your React application.

#### Features:

- Display notifications from Fyno within your React app
- Customizable notification center appearance
- Manage user preferences

## Install

```bash
npm install --save @fyno/inapp-react
```

## Usage

### Prerequisite

Before installing Inapp Notification Center make sure you have generated HMAC signature in the backend by following the below process. Make sure you pass your user distinct id in place of user id. This has to be generated for every user and the same needs to be passed to inapp-react SDK

- WSID - You can get workspace id from fyno [api keys](https://app.fyno.io/api-keys) page
- Integration Token - You can get integration token from [integration](https://app.fyno.io/integrations) page
- User ID - This has to be the distinct id of currently logged in user. This will help fyno to identify the user to send user specific notifications

### HMAC signature generation

1. Javascript - Node

```javascript - Node
import crypto from 'crypto'
//or
// const crypto = require('crypto')
const signature = crypto
  .createHmac('sha256', 'WSID' + 'INTEGRATION_TOKEN')
  .update('USER_ID')
  .digest('hex')
```

2. JavaScript - JS

```javascript - JS
const crypto = require('crypto-js')
const secretKey = 'WSID' + 'INTEGRATION_TOKEN'
const userId = 'USER_ID'

const signature = CryptoJS.HmacSHA256(userId, secretKey).toString(
  CryptoJS.enc.Hex
)
```

3. Python

```python
import hashlib
import hmac

secret_key = b'WSID'+b'INTEGRATION_TOKEN'
user_id = 'USER_ID'

signature = hmac.new(secret_key, user_id.encode('utf-8'), hashlib.sha256).hexdigest()
```

4. Java

```java
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

public class SignatureExample {

    public static void main(String[] args) throws Exception {
        String secretKey = "WSID" + "INTEGRATION_TOKEN"; // Concatenate the secret key
        String userId = "USER_ID";

        // Create a new instance of the HmacSHA256 algorithm
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        mac.init(secretKeySpec);

        // Compute the hash
        byte[] hash = mac.doFinal(userId.getBytes(StandardCharsets.UTF_8));

        // Convert the hash to a hexadecimal string
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            String hex = String.format("%02x", b);
            hexString.append(hex);
        }

        String signature = hexString.toString();
    }
}
```

5. PHP

```php
$secretKey = 'WSID'.'INTEGRATION_TOKEN';
$userId = 'USER_ID';

$signature = hash_hmac('sha256', $userId, $secretKey);
```

6. Ruby

```ruby
require 'openssl'

secret_key = 'WSID'+'INTEGRATION_TOKEN'
user_id = 'USER_ID'

signature = OpenSSL::HMAC.hexdigest(OpenSSL::Digest.new('sha256'), secret_key, user_id)
```

7. C#

```c#
using System;
using System.Security.Cryptography;
using System.Text;

class Program
{
    static void Main()
    {
        string secretKey = "WSIDINTEGRATION_TOKEN";
        string userId = "USER_ID";

        using (HMACSHA256 hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secretKey))
        {
            byte[] hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(userId));
            string signature = BitConverter.ToString(hash).Replace("-", "").ToLower();
        }
    }
}
```

**_NOTE:_** Please make sure if you are generating the signature on frontend, You might expose your api keys. It's recommended to do the token generation

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
      darkBackground: 'DARK_THEME_BACKGROUND_COLOR',
      header: 'Notifications', // By default the header will not be shown to make the UX better, If specified header will be shown with the title specified in inapp-center.
      //Advanced theme configuration
      position: 'left|right', //By default the notification center will be opened as a menu dropdown, if you have right or left navigation where the notification icon is located then you can set the notification position to open the notification with full height to the side
      offset: '0', //Only used if the notification center position is left or right, This specifies the width of your side navigation pane
      preference_mode: 'none|embed|modal', //Default is none if sepcified `embed` the user preferences panel will be shown within the notification center or if specified `modal` the preference panel will be shown in a modal window
    }, //optional
    notificationSettings: {
      sound: 'LINK_TO_NOTIFICATION_SOUND',
      invertTheme: false //If you want notification toast with the inverted theme make this to true
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
    sound: 'LINK_TO_NOTIFICATION_SOUND',
    invertTheme: false //If you want notification toast with the inverted theme make this to true
  }
  render() {
    return <FynoInappCenter theme="light" user="{userid}" workspace="{workspace_id}" integration="{integration_id}" signature="{signature generated from backend}" themeConfig={themeConfig} notificationSettings={notificationSettings}/>
  }
}
``` -->

# @fyno/inapp-react

[![NPM](https://img.shields.io/npm/v/@fyno/inapp-react.svg)](https://www.npmjs.com/package/@fyno/inapp-react) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

![Fyno: Fire your notifications](https://fynodev.s3.ap-south-1.amazonaws.com/others/Fyno_Banner.jpeg)

**Fyno In-app React SDK**:
This React library allows you to easily integrate Fyno's in-app notification center into your React application.

#### Features:

- Display notifications from Fyno within your React app
- Customizable notification center appearance
- Manage user preferences

## Install

```bash
npm install --save @fyno/inapp-react
```

## Usage

### Prerequisites

Before installing the In-app Notification Center, make sure you have generated the HMAC signature in the backend by following the process below. Ensure you replace the placeholder values with actual ones.

- **Workspace ID (WSID):** Obtain from your Fyno [Workspace Settings](https://app.dev.fyno.io/workspaces) page.
- **Integration ID:** Get integration ID from the [Integrations](https://app.fyno.io/integrations) page.
- **Integration Token:** Get Integration Token from the [Integrations](https://app.fyno.io/integrations) page.
- **User ID:** This should be the unique identifier of the currently logged-in user, enabling Fyno to send user-specific notifications.

### HMAC Signature Generation

1. **JavaScript - Node**

```javascript - Node
import crypto from 'crypto'
const signature = crypto
  .createHmac('sha256', 'WSID' + 'INTEGRATION_TOKEN')
  .update('USER_ID')
  .digest('hex')
```

2. **JavaScript - Browser**

```javascript - JS
const crypto = require('crypto-js')
const secretKey = 'WSID' + 'INTEGRATION_TOKEN'
const userId = 'USER_ID'

const signature = CryptoJS.HmacSHA256(userId, secretKey).toString(
  CryptoJS.enc.Hex
)
```

3. **Python**

```python
import hashlib
import hmac

secret_key = b'WSID'+b'INTEGRATION_TOKEN'
user_id = 'USER_ID'

signature = hmac.new(secret_key, user_id.encode('utf-8'), hashlib.sha256).hexdigest()
```

4. **Java**

```java
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

public class SignatureExample {

    public static void main(String[] args) throws Exception {
        String secretKey = "WSID" + "INTEGRATION_TOKEN";
        String userId = "USER_ID";

        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        mac.init(secretKeySpec);

        byte[] hash = mac.doFinal(userId.getBytes(StandardCharsets.UTF_8));

        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            String hex = String.format("%02x", b);
            hexString.append(hex);
        }

        String signature = hexString.toString();
    }
}
```

5. **PHP**

```php
$secretKey = 'WSID'.'INTEGRATION_TOKEN';
$userId = 'USER_ID';

$signature = hash_hmac('sha256', $userId, $secretKey);
```

6. **Ruby**

```ruby
require 'openssl'

secret_key = 'WSID'+'INTEGRATION_TOKEN'
user_id = 'USER_ID'

signature = OpenSSL::HMAC.hexdigest(OpenSSL::Digest.new('sha256'), secret_key, user_id)
```

7. **C#**

```csharp
using System;
using System.Security.Cryptography;
using System.Text;

class Program
{
    static void Main()
    {
        string secretKey = "WSIDINTEGRATION_TOKEN";
        string userId = "USER_ID";

        using (HMACSHA256 hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secretKey))
        {
            byte[] hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(userId));
            string signature = BitConverter.ToString(hash).Replace("-", "").ToLower();
        }
    }
}
```

**_NOTE:_** Ensure you generate the signature on the backend to avoid exposing your API keys.

### SDK Initialization in Frontend

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
      darkBackground: 'DARK_THEME_BACKGROUND_COLOR',
      header: 'Notifications', // Specify a header title. Default: For better UX we defaulted to No header.
      // Advanced theme configuration
      position: 'left|right', // By default, the notification center opens as a menu dropdown. Use 'left' or 'right' to open it to the side.
      offset: '0', // Used only with 'left' or 'right' position. Specifies the width of your side navigation pane.
      preference_mode: 'none|embed|modal', // Default: 'none'. If 'embed', user preferences are shown within the notification center. If 'modal', preferences appear in a separate window.
      globalChannels: '<ARRAY_OF_CHANNELS>', //To let users opt-out communication from a specific channel globally you can use this setting to mention the channels in an array. Ex.['sms', 'whatsapp']
    },
    notificationSettings: {
      sound: 'LINK_TO_NOTIFICATION_SOUND',
      invertTheme: false // Set to true for notification toast with inverted theme.
    }
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
    sound: 'LINK_TO_NOTIFICATION_SOUND',
    invertTheme: false // Set to true for notification toast with inverted theme.
  }
  render() {
    return <FynoInappCenter theme="light" user="{userid}" workspace="{workspace_id}" integration="{integration_id}" signature="{signature generated from backend}" themeConfig={themeConfig} notificationSettings={notificationSettings}/>
  }
}
```

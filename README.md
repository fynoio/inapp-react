# Fyno In-App React SDK

[![NPM](https://img.shields.io/npm/v/@fyno/inapp-react.svg)](https://www.npmjs.com/package/@fyno/inapp-react) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

![Fyno: Fire your notifications](https://fynodev.s3.ap-south-1.amazonaws.com/others/Fyno_Banner.jpeg)

The **Fyno In-App React SDK** makes it easy to add a customizable notification center to your React app. It’s a flexible tool to help you show notifications and let users manage how they receive them, all from within your app.

### Key Features

- Display notifications from Fyno with in your React app.
- Customize how the notification center looks to match your brand.
- Let users control their notification preferences for different channels.

## Installation

To get started, run this in your terminal:

```bash
npm install --save @fyno/inapp-react
```

## Getting Started

Before setting up the notification center, you’ll need to generate an HMAC signature on your backend. This ensures everything is secure and properly configured. Here’s what you’ll need:

- **Workspace ID (WSID):** You can find this in your Fyno [Workspace Settings](https://app.dev.fyno.io/workspaces).
- **Integration ID & Token:** These are available from the [Integrations](https://app.fyno.io/integrations) section in Fyno.
- **User ID:** This is the unique ID of the user currently logged in, so Fyno knows who to send notifications to.

### Generating the HMAC Signature

Below are examples of how to generate the HMAC signature in different backend languages. Just swap in your actual `WSID`, `INTEGRATION_TOKEN`, and `USER_ID`.

1. **JavaScript - Node**

```javascript
import crypto from 'crypto'
const signature = crypto
  .createHmac('sha256', 'WSID' + 'INTEGRATION_TOKEN')
  .update('USER_ID')
  .digest('hex')
```

2. **JavaScript - Browser**

```javascript
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

secret_key = b'WSID' + b'INTEGRATION_TOKEN'
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

secret_key = 'WSID' + 'INTEGRATION_TOKEN'
user_id = 'USER_ID'

signature = OpenSSL::HMAC.hexdigest(OpenSSL::Digest.new('sha256'), secret_key, user_id)
```

7. **C#**

```csharp
using System;
using System.Security.Cryptography;
using System.Text;

class Program {
    static void Main() {
        string secretKey = "WSIDINTEGRATION_TOKEN";
        string userId = "USER_ID";

        using (HMACSHA256 hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secretKey))) {
            byte[] hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(userId));
            string signature = BitConverter.ToString(hash).Replace("-", "").ToLower();
        }
    }
}
```

_Important_: Make sure to generate the signature on your backend to keep your API keys safe and secure.

## Setting Up the SDK in Your Frontend

Once your backend is ready, you can easily add the SDK to your frontend. Here’s an example to get you started:

```jsx
import { FynoInappCenter } from '@fyno/inapp-react';

class Example extends Component {
  const config = {
    mode: 'light', // Choose between 'light' or 'dark' theme
    user: 'USER_ID',
    workspace: 'WSID',
    integration: 'INTEGRATION_ID',
    signature: 'signature',
    themeConfig: {
      logo: 'LINK_TO_BRAND_LOGO',
      primary: 'PRIMARY_COLOR',
      lightBackground: 'LIGHT_THEME_BACKGROUND_COLOR',
      darkBackground: 'DARK_THEME_BACKGROUND_COLOR',
      header: 'Notifications', // Optional header title
      position: 'left', // Set to 'left' or 'right' to have it slide out from the side
      preference_mode: 'embed' // Display user preferences within the notification center
    },
    globalChannels: ['sms', 'whatsapp'], // Channels for user to opt-out of globally
    notificationSettings: {
      sound: 'LINK_TO_NOTIFICATION_SOUND',
      invertTheme: false, // Toggle this to change the theme of notification toasts
      toastPosition: 'top-right', // Position of toast notifications
      duration: 5000 // How long to show each notification in milliseconds
    },
    onMessageRecieved: (message) => {
      console.log('New message:', message);
    },
    onMessageClicked: (message) => {
      console.log('Message clicked:', message);
    }
  };

  render() {
    return <FynoInappCenter {...config} />;
  }
}
```

## User Preferences

Fyno also gives users control over how they get notified. Users can subscribe or unsubscribe from channels like email, SMS, and push notifications.

To enable user preferences, use the `preference_mode` property in your config:

- **`none`:** Preferences won’t be shown.
- **`embed`:** Preferences will be shown inside the notification center.
- **`modal`:** Preferences will be shown in a separate modal window.

Here’s an example using embedded preferences:

```jsx
import { FynoInappCenter } from '@fyno/inapp-react'

const config = {
  themeConfig: {
    preference_mode: 'embed'
  },
  globalChannels: ['sms', 'whatsapp']
}

return <FynoInappCenter {...config} />
```

## Configurations

When using the **Fyno In-App React SDK**, several properties (props) need to be passed to configure the behavior of the notification center. Here’s a breakdown of **required** and **optional** props:

### Required Props

1. **user** (String):
   The unique identifier of the current logged-in user, allowing Fyno to send user-specific notifications.

2. **workspace** (String):
   The workspace ID (WSID) obtained from your Fyno [Workspace Settings](https://app.dev.fyno.io/workspaces).

3. **integration** (String):
   The integration ID from your Fyno [Integrations](https://app.fyno.io/integrations) page.

4. **signature** (String):
   HMAC signature generated in the backend to secure your integration (generated based on the user and integration).

### Optional Props

1. **themeConfig** (Object):
   Customize the appearance of the notification center. You can pass the following options:

   - **logo** (String): URL of your brand logo.
   - **header** (String): Custom title for the notification center.
   - **position** (String): 'left' or 'right' to position the notification center.
   - **offset** (Number): The offset from the edge for positioning.
   - **preference_mode** (String): How user preferences are shown. Options: 'none', 'embed', 'modal'.

2. **globalChannels** (Array of Strings):
   Define global notification channels like 'sms' or 'whatsapp' that users can opt out of.

3. **notificationSettings** (Object):
   Customize how notifications are displayed. Options include:

   - **sound** (String): URL to a notification sound file.
   - **invertTheme** (Boolean): Set to `true` if you want to invert the notification toast theme.
   - **toastPosition** (String): Set the position for toast notifications (e.g., 'top-right', 'bottom-left').

4. **onMessageRecieved** (Function):
   Callback function triggered when a new message is received. Example:

   ```javascript
   (message) => {
     console.log('New message:', message)
   }
   ```

5. **onMessageClicked** (Function):
   Callback function triggered when a notification is clicked. Example:

   ```javascript
   (message) => {
     console.log('Message clicked:', message)
   }
   ```

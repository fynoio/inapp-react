# Fyno In-App Notification Center

## Silent / Background Notifications Documentation

### Introduction

The Fyno In-App Notification Center has introduced a new feature that allows users to send silent notifications, which are notifications without any visible user interface element, accompanied by a data payload. To use this feature effectively, you need to create a notification template in the Fyno application with the template type set to "silent." Additionally, developers need to add the `onMessageReceived` event handler to the In-App SDK configuration for capturing these silent notifications.

This documentation provides a step-by-step guide on how to create a silent notification template in Fyno and how to capture these notifications in your application.

### Creating a Silent Notification Template in Fyno

To create a silent notification template in Fyno:

1. **Log in to the Fyno Application:** Log in to your Fyno account and navigate to the _Templates_.

2. **Create a New Notification Template:**

   - Click the "Create Template" button or Edit the existing template.
   - Set the template type to "Silent." This indicates that this notification template will be used for sending silent notifications.
   - Fill in the data payload.
   - You may leave placeholders for content that can be dynamically filled by your application.

3. **Save the Template:**

   - Click the "Save" button to create the silent notification template.

### Capturing Silent Notifications in Your Application

To capture silent notifications in your application, you need to pass the `onMessageReceived` event handler to the In-App SDK. Here's how:

1. **Integrate the Fyno In-App SDK:**

   - Ensure you have integrated the Fyno In-App SDK into your application as per the [Integration Guide](https://docs.fyno.io/recipes/fynos-in-app-sdk-reactjs).

2. **Configure the SDK with `onMessageReceived` Event Handler:**

   - When configuring the Fyno In-App SDK, add the `onMessageReceived` event handler, passing it your custom `messageHandler` function.

   ```javascript
   <FynoInappCenter {...config} onMessageReceived={messageHandler} />
   ```

   - The `messageHandler` function should be defined in your application to handle incoming silent notifications.

> **_NOTE:_** Make sure you are using **@fyno/inapp-react library** - v1.0.15 or later

3. **Implement the `messageHandler` Function:**

   - In your `messageHandler` function, you can access the silent notification data payload and perform actions based on the received data. For example:

   ```javascript
   const messageHandler = (notification) => {
     // Handle the silent notification data payload here
     const data = notification.notification.additional_data
     // Perform actions based on the data received
   }
   ```

### Example Use Case

Suppose you have a application where users initiate a payment, and you want to send silent notifications to update payment information in real-time without disturbing the user with visible notifications. You can create a silent notification template in Fyno with placeholders for data, and then, by following the steps above, capture and update the payment information in your application seamlessly.

```javascript
<FynoInappCenter {...config} onMessageReceived={messageHandler} />
```

```javascript
const messageHandler = (notification) => {
  // Handle the silent notification data payload
  const data = notification.notification_content.additional_data

  // Update the state information in your app
  updatePaymentInformation(data)
}
```

### Conclusion

By creating a silent notification template in Fyno and configuring the In-App SDK with the `onMessageReceived` event handler, developers can easily send and capture silent notifications in their applications. This feature allows for non-intrusive updates and real-time data synchronization while providing a smooth user experience.

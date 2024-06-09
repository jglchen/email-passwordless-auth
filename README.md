# Email Passwordless authentication with Firebase and React

For modern Internet users, managing account passwords is often a headache. If your password is very simple, such as "123" or your birthday, etc., your account will be very dangerous because many people can easily guess your password and hack the account.But if your password is very complex, you can easily forget it, especially if you try to choose different passwords for different accounts. Therefore, people began to need some authentication methods that did not require passwords on the Internet.

This article and the following writings explore how passwordless authentication integrates with Firebase and React, highlighting its benefits for online security and user experience.

## Why use Firebase for a passwordless authentication?

[Firebase is a platform developed by Google](https://firebase.google.com/) that offers a variety of tools and services for building web and mobile applications. 
It provides functionalities like real-time databases, authentication, cloud storage, and hosting, making it easier and faster for developers to create and scale apps without managing the backend.

Using Firebase is beneficial because it offers an inbuilt authentication service that supports passwordless methods. 
This means developers can implement secure, passwordless login systems without building from scratch.

## Authenticate with Firebase Using Email Link in JavaScript

You can use Firebase Authentication to sign in a user by sending them an email containing a link, which they can click to sign in. In the process, the user's email address is also verified.

There are numerous benefits to signing in by email:
- Low friction sign-up and sign-in.
- Lower risk of password reuse across applications, which can undermine security of even well-selected passwords.
- The ability to authenticate a user while also verifying that the user is the legitimate owner of an email address.
- A user only needs an accessible email account to sign in. No ownership of a phone number or social media account is required.
- A user can sign in securely without the need to provide (or remember) a password, which can be cumbersome on a mobile device.
- An existing user who previously signed in with an email identifier (password or federated) can be upgraded to sign in with just the email. For example, a user who has forgotten their password can still sign in without needing to reset their password.     

## Setting up the demo project

To demonstrate the email passwordless authentication, we first need to set up a demo project. Here’s a brief guide on how to create a Firebase project, add a React app to the project, integrate the Firebase SDK, and add the Firebase script to the React app.

### Creating a Firebase project

To create a project in Firebase, follow these three steps:

1. Open the [Firebase console](https://console.firebase.google.com/)
2. Click **Add project**
3. Enter a name for your project, for this tutorial we’ll use **AuthProject**, and follow the instructions to create the project.

### Adding a React app to the Firebase project

1. Once your project is created, click on </> (the web icon shown below the project name) or select the platform you’re targeting (e.g., iOS, Android).
2. Register your app by providing an app nickname.
3. If you’re setting up a web app, you can also set up [Firebase Hosting](https://firebase.google.com/docs/hosting) at this stage.

### Integrating the Firebase SDK

After registering your app, Firebase will provide you with a configuration object containing the keys and URLs that your app will use to initialize Firebase. You’ll get a script for web apps to include in your React Project; here’s an example of the code:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID" (optional for Firebase JS SDK v7.20.0 and later)
};
```

### Adding Firebase script to the React project

We use the following command to create the project of Next.js, which is a React framework.

```node
npx create-next-app email-passwordless-auth
```

You can just navigate to the directory of email-passwordless-auth and run the following npm command.

```node
npm install firebase
```

To add the Firebase script, create a file in the source folder, name it **firebaseConfig.js**, and paste in the following code:

```javascript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID" //optional for Firebase JS SDK v7.20.0 and later
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
```

## Implementing email link authentication

The email link authentication method is straightforward. When you want to sign up or log in to a website, instead of creating a password, the site sends a unique link to your email. Clicking on this link confirms your identity and logs you in. It’s a secure method because only the person with access to the email can use the link. It simplifies the process, ensuring that the right person is accessing the account without passwords.

### Enable Email Link sign-in for your Firebase project

To sign in users by email link, you must first enable the Email provider and Email link sign-in method for your Firebase project:

1. In the [Firebase console](https://console.firebase.google.com/?authuser=0), open the **Authentication** section.
2. On the **Sign in method** tab, enable the **Email/Password** provider. Note that email/password sign-in must be enabled to use email link sign-in.
3. In the same section, enable **Email link (passwordless sign-in)** sign-in method.
4. Click **Save**.

### Send an authentication link to the user's email address

To initiate the authentication flow, please give the user an interface that prompts them to provide their email address and then call **sendSignInLinkToEmail** to request that Firebase send the authentication link to the user's email.

1. Construct the **ActionCodeSettings** object, which provides Firebase with instructions on constructing the email link. Set the following fields:
  
    - **url**: The deep link to embed and any additional state to be passed along. The link's domain has to be added in the Firebase Console list of authorized domains, which can be found by going to the Sign-in method tab (Authentication -> Settings).
    - **handleCodeInApp**: Set to true. The sign-in operation has to always be completed in the app unlike other out of band email actions (password reset and email verifications). This is because, at the end of the flow, the user is expected to be signed in and their Auth state persists within the app.

    ```javascript
    const actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be in the authorized domains list in the Firebase Console.
      url: 'https://www.example.com/finishSignUp?cartId=1234',
      // This must be true.
      handleCodeInApp: true,
    };
    ```
2. Ask the user for their email.
3. Send the authentication link to the user's email, and save the user's email in case the user completes the email sign-in on the same device.
    ```javascript
    import { getAuth, sendSignInLinkToEmail } from "firebase/auth";

    const auth = getAuth();
    sendSignInLinkToEmail(auth, email, actionCodeSettings)
      .then(() => {
        // The link was successfully sent. Inform the user.
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        window.localStorage.setItem('emailForSignIn', email);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ...
      });    
    ```
## Complete sign in with the email link

### Security concerns

Firebase Auth requires the user's email address to be provided when completing the sign-in flow to prevent a sign-in link from being used to sign in as an unintended user or on an unintended device. For sign-in to succeed, this email address must match the address to which the sign-in link was originally sent.

You can streamline this flow for users who open the sign-in link on the same device they request the link, by storing their email address locally - for instance using localStorage or cookies - when you send the sign-in email. Then, use this address to complete the flow. Do not pass the user’s email in the redirect URL parameters and re-use it as this may enable session injections.

### Completing sign-in in a web page

To complete the sign in on the landing page, call signInWithEmailLink with the user's email and the actual email link containing the one-time code.

```javascript
import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";

// Confirm the link is a sign-in with email link.
const auth = getAuth();
if (isSignInWithEmailLink(auth, window.location.href)) {
  // Additional state parameters can also be passed via URL.
  // This can be used to continue the user's intended action before triggering
  // the sign-in operation.
  // Get the email if available. This should be available if the user completes
  // the flow on the same device where they started it.
  let email = window.localStorage.getItem('emailForSignIn');
  if (!email) {
    // User opened the link on a different device. To prevent session fixation
    // attacks, ask the user to provide the associated email again. For example:
    email = window.prompt('Please provide your email for confirmation');
  }
  // The client SDK will parse the code from the link for you.
  signInWithEmailLink(auth, email, window.location.href)
    .then((result) => {
      // Clear email from storage.
      window.localStorage.removeItem('emailForSignIn');
      // You can access the new user by importing getAdditionalUserInfo
      // and calling it with result:
      // getAdditionalUserInfo(result)
      // You can access the user's profile via:
      // getAdditionalUserInfo(result)?.profile
      // You can check if the user is new or existing:
      // getAdditionalUserInfo(result)?.isNewUser
    })
    .catch((error) => {
      // Some error occurred, you can inspect the code: error.code
      // Common errors could be invalid email and invalid or expired OTPs.
    });
}
```

### Demonstration Apps

We have prepared [a demonstration app](https://github.com/jglchen/email-passwordless-auth) for Authentication with Firebase Using Passwordless Email Link in Next.js for your review. You can also check another [demonstration app](https://github.com/jglchen/firebase-auth-email) we developed of Firebase Authentication with a Passwordless Email Link. 
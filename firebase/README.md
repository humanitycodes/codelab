# Firebase Automation

For additional information, read the [Firebase CLI Reference][1].

## Token Generation

To generate a new token (used to avoid interactive logins in CI environments), do the following:

1. Run `firebase login:ci`.
2. Provide the password for humanitycodes@gmail.com.
3. Replace the contents of the file `token` with the newly generated token.

## Creating a Personal Dev Database

To prepare a new Firebase database for the MSU Code Lab application, perform the following steps:

1. Sign into the [Firebase Console][2] using the humanitycodes@gmail.com account.
2. Click the "Create New Project" button:
   * Type "MsuLansingCodesDev-<username>" as the project name, replacing `<username>` with the result of `whoami` on the developer's computer.
   * Click "Create Project".
3. Enable GitHub in the Authentication settings:
   * Use the Client ID and Secret found in `backend/env/dev/.env`.
   * Click "Save".
4. Enable Email/Password in the Authentication settings.
5. Create a service account for the database:
   * Click "Permissions" in the Settings (gear icon) menu.
   * Click on "Service accounts" in the left panel.
   * Click "Create Service Account" at the top of the page:
     - Service account name: `MsuLansingCodesSvcAcct-<username>`
     - Role: `Editor`
     - Furnish a new private key: `Yes`
     - Key type: `JSON`
   * Click "Create".
   * Save the Service Account JSON file to `backend/env/dev/firebase-service-account-<username>.json`.
6. Make the following changes to the `msu.lansing.codes` project:
   * Add an alias to `firebase/.firebaserc`:
     - `"<username>": "msulansingcodesdev-<username>"`
   * Create a frontend environment file:
     - Name the file `frontend/src/env/dev-<username>.js`.
     - The contents should look like this:
       ```js
       import devDefaults from './dev'

       export default Object.assign(devDefaults, {
         firebaseConfig: {
           apiKey: '<API_KEY>',
           authDomain: '<AUTH_DOMAIN>',
           databaseURL: '<DATABASE_URL>',
           storageBucket: '<STORAGE_BUCKET>',
           messagingSenderId: '<MESSAGING_SENDER_ID>'
         }
       })
       ```
     - Replace the contents of `firebaseConfig` with the "Web Setup" config found in the Firebase Console on the Authentication settings page.
7. Apply the Firebase rules by running the following command from the `firebase` directory:
   ```sh
   firebase deploy --project <username> --token `cat token`
   ```
8. _Optional:_ Import a database.
   - In the Firebase Console for the database you would like to copy, navigate to the Database page.
   - Click the vertical ellipses and select "Export JSON".
   - In the Firebase Console for the new database, navigate to the Database page.
   - Click the vertical ellipses, select "Import JSON", and upload the exported JSON file.


[1]: https://firebase.google.com/docs/cli/ "Firebase CLI Reference"
[2]: https://console.firebase.google.com/ "Firebase Console"

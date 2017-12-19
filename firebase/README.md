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
   * Type "MsuLansingCodesDev-&lt;username&gt;" as the project name, replacing `<username>` with the result of `whoami` on the developer's computer.
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

## Restoring from Backups

The production database (`MsuLansingCodes`) is configured to take daily backups. If you ever need to restore the database from a backup, follow the steps below:

1. Determine the date in the past that you want to restore.
2. Deploy the version of the code that matches the restore date:
   1. _**Note:** This step can be skipped if you are sure no model changes have been made since the restore date._
   2. If you expect the recover process to take a long or unknown time, enable "Maintenance Mode" for `msu-lansing-codes` in Heroku.
   3. Checkout the code version that matches the data you are restoring and manually deploy it to `msu-lansing-codes` in Heroku.
3. Download the Firebase backups that match the restore date:
   1. Sign into the [Firebase Console][2] using the humanitycodes@gmail.com account.
   2. Select `MsuLansingCodes` from the dropdown in the top left corner of the window.
   3. Click on "Database" in the left panel.
   4. Click on "Backups" in the top middle portion of the page.
   5. In the table labeled "Activity", find the row with a Start Time that matches the restore date.
   6. Click on `msulansingcodes_data.json.gz` and `msulansingcodes_rules.json.gz` to download them.
   7. Unzip each file you downloaded using a graphical tool or command line:
      ```sh
      gunzip *.json.gz
      ```
4. Restore the Firebase data:
   1. Click on "Database" in the left panel.
   2. Click on the `⋮` on the "Data" table and select "Import JSON".
   3. Click "Browse" in the dialog that appears and select the `*-msulansingcodes_data.json` that you downloaded and unzipped.
   4. Click "Import" to restore the data.
5. Restore the Firebase rules:
   1. Open the `*-msulansingcodes_rules.json` file and copy the contents to your clipboard. Alternatively, on macOS you can use the following terminal command:
      ```sh
      cat *-msulansingcodes_rules.json | pbcopy
      ```
   2. Click on "Rules" tab on the Database page.
   3. Delete the contents of the Rules edit box.
   4. Paste the rules from your clipboard into the edit box.
   5. Click "Publish" at the top of the edit box.
6. Disable "Maintenance Mode" for `msu-lansing-codes` in Heroku if it was enabled.
7. Verify that you are able to sign into [codelab.cas.msu.edu][3] and can access the restored data in the website.

[1]: https://firebase.google.com/docs/cli/ "Firebase CLI Reference"
[2]: https://console.firebase.google.com/ "Firebase Console"
[3]: https://codelab.cas.msu.edu/ "MSU Code Lab Homepage"

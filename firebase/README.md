# Firebase Automation

For additional information, read the [Firebase CLI Reference][1].

## Token Generation

To generate a new token (used to avoid interactive logins in CI environments), do the following:

1. Run `firebase login:ci`.
2. Provide the password for humanitycodes@gmail.com.
3. Replace the contents of the file `token` with the newly generated token.



[1]: https://firebase.google.com/docs/cli/ "Firebase CLI Reference"

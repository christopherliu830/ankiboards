# ankiboards

## SPA Requirements

<ul>
  <li> firebase-config.json (you should get this from a firebase app). This is needed for connecting to the Firestore.</li>
  <li> Your environment must have the ankiboards API url as well as the AnkiConnect url set. </li>
</ul>

## Building the SPA

1. Clone the directory
2. For building dev environments: `npm run build:dev`
3. For deploying to firebase: `npm run deploy`
4. For testing: npm run start (you also need to start the server)


## Server Environment Variables
  
Set these in your .env file:

<ul>
  <li> GOOGLE_APPLICATION_CREDENTIALS=[path to service-account.json] <i>(required)</i> </li>
  <li> DEBUG=[server/express]:* </li>
  <li> PORT=[port] </li>
</ul>

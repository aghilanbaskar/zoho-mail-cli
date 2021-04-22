#!/usr/bin/env node
"use strict";

const authClient = require( "../src/authClient" );

// read in settings
dotenv.config();

const config = {
 clientId: '1000.W5RO2PMZFJJSTBDLM8O6VHELIBRH4D',
 scopes: 'ZohoMail.messages.READ',
 redirect_url: 'https://localhost:8080/'
};

const main = async () => {
 try {
   const auth = authClient( config );
   const { token, userInfo } = await auth.executeAuthFlow();
   console.log( token, userInfo );
   console.log( "You have successfully authenticated your CLI application!"  );
 } catch ( err ) {
   console.log(  err  );
 }
};

main();
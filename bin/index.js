#!/usr/bin/env node

"use strict";

const axios = require( "axios" );
const fs = require('fs');
const myArgs = process.argv.slice(2);
const firstCommand = myArgs[0];
const authClient = require( "../src/authClient" );

const login = async () => {
    try {
        const auth = authClient( { authorizationURL: 'https://accounts.zoho.com/oauth/v2/auth?client_id=1000.W5RO2PMZFJJSTBDLM8O6VHELIBRH4D&response_type=token&scope=ZohoMail.messages.READ,ZohoMail.accounts.READ&redirect_uri=http://localhost:8080/callback/' });
        const oauth_token = await auth.executeAuthFlow();
        console.log(oauth_token.access_token);
        const config = {
            headers: { Authorization: `Bearer ${oauth_token.access_token}` }
          };
        const res = await axios.get('http://mail.zoho.com/api/accounts', config );

        if(res.data.status.code === 200){
            console.log('Account Data fetched successfully');
            oauth_token.account = res.data.data;
        }else {
            console.log('*************************************************************');
            console.log('Failed to fetch account id from token. Try login again');
            console.log('****************************************************************');
            process.exit();
        }
        fs.writeFileSync(__dirname+'/oauth_token.json', JSON.stringify(oauth_token));
        console.log( "You have successfully authenticated ZOHO MAIL CLI!" );
        if (!fs.existsSync(__dirname+'/oauth_token.json')) {
            console.log('Not able to save token...Try again')
        }
        process.exit();
    } catch ( err ) {
        console.log( err  );
    }
};

const message = async () => {
    if (!fs.existsSync(__dirname+'/oauth_token.json')) {
        console.log('*******************************************************************');
        console.log('Authorization token not found. Try "mail login" to create one');
        console.log('*******************************************************************');
        process.exit();
    }
    const authorization_token = JSON.parse(fs.readFileSync(__dirname+'/oauth_token.json'));
    // console.log('Token Exist',authorization_token.access_token, authorization_token.account[0].accountId);
    const config = {
        headers: { Authorization: `Bearer ${authorization_token.access_token}` }
    };
    const res = await axios.get(`http://mail.zoho.com/api/accounts/${authorization_token.account[0].accountId}/messages/view`, config );
    // console.log(res.data)
    if(!(res.data.status.code && res.data.status.code === 200)){
        console.log('Failed during fetching data');
    }
    for (const key in res.data.data) {
        console.log('*******************************************************************************************');
        console.log('From: '+res.data.data[key].fromAddress);
        console.log('Subject: '+res.data.data[key].subject);
        console.log('Summary: '+res.data.data[key].summary);
        // console.log('*******************************************************************************************');
    }
};

if(firstCommand == 'login'){
    login();
}else if(firstCommand == 'message'){
    message();
} else {
    console.log('****************************************************************');
    console.log('Commands Available');
    console.log('1. login');
    console.log('2. getmail');
    console.log('Try with above two commands. Eg run  "mail login"');
    console.log('****************************************************************');
    process.exit()
}

// https://accounts.zoho.com/oauth/v2/auth/refresh?client_id=1000.W5RO2PMZFJJSTBDLM8O6VHELIBRH4D&response_type=token&scope=ZohoMail.messages.READ,ZohoMail.accounts.READ&redirect_uri=http://localhost:8080/callback/
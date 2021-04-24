#!/usr/bin/env node

"use strict";

const axios = require( "axios" );
const fs = require('fs');
const myArgs = process.argv.slice(2);
const firstCommand = myArgs[0];
const authClient = require( "../src/authClient" );
const location = {
    'us': 'mail.zoho.com',
    'in': 'mail.zoho.in',
    'eu': 'mail.zoho.eu',
    'au': 'mail.zoho.au'
}

const login = async (authorizationURL) => {
    try {
        const auth = authClient( { authorizationURL });
        const oauth_token = await auth.executeAuthFlow();
        console.log(oauth_token.access_token,oauth_token.location, location[oauth_token.location] );
        const config = {
            headers: { Authorization: `Bearer ${oauth_token.access_token}` }
          };
        const res = await axios.get(`http://${location[oauth_token.location]}/api/accounts`, config );

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

const messages = async (query_params) => {
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
    let params = ''
    if(Object.keys(query_params).length > 0){
        params = new URLSearchParams(query_params).toString();
        params='?'+params;
    }
    await axios.get(`http://${location[authorization_token.location]}/api/accounts/${authorization_token.account[0].accountId}/messages/view${params}`, config ).then((res) => {
        for (const key in res.data.data) {
            console.log('*******************************************************************************************');
            console.log('From: '+res.data.data[key].fromAddress);
            console.log('Subject: '+res.data.data[key].subject);
            console.log('Summary: '+res.data.data[key].summary);
            // console.log('*******************************************************************************************');
        }
      }).catch((error) => {
        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        }
        console.log('*******************************************************************************************');
        console.log('Failed during fetching data');
        console.log('Deleting token...........');
        fs.unlinkSync(__dirname+'/oauth_token.json');
        if (!fs.existsSync(__dirname+'/oauth_token.json')) {
            console.log('Token deleted sucessfully...........');
        }
        console.log('Refreshing the token..........................');
        console.log('*******************************************************************************************');
        login('https://accounts.zoho.com/oauth/v2/auth/refresh?client_id=1000.W5RO2PMZFJJSTBDLM8O6VHELIBRH4D&response_type=token&scope=ZohoMail.messages.READ,ZohoMail.accounts.READ&redirect_uri=http://localhost:8080/callback/');
      })
};

if(firstCommand == 'login'){
    login('https://accounts.zoho.com/oauth/v2/auth?client_id=1000.W5RO2PMZFJJSTBDLM8O6VHELIBRH4D&response_type=token&scope=ZohoMail.messages.READ,ZohoMail.accounts.READ&redirect_uri=http://localhost:8080/callback/');
}else if(firstCommand == 'messages'){
    let query = {};
    myArgs.slice(1).forEach((val) => {
        val = val.replace("'", "");
        val = val.replace('"', '');
        val = val.split('=');
        if(val.length === 2){
            query[val[0]] = val[1]
        }
      })
      console.log(query)
    messages(query);
} else {
    console.log('****************************************************************');
    console.log('Commands Available');
    console.log('1. login');
    console.log('2. messages');
    console.log('Try with above two commands. Eg run  "mail login"');
    console.log('****************************************************************');
    process.exit();
}



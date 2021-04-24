const express = require('express');
const open = require( "open" );

module.exports = ( { authorizationURL } ) => {
    if ( !authorizationURL) {
      throw new Error( "Not able to find authorization URL." );
    }
    
    // Start server and begin auth flow
    const executeAuthFlow = () => {
      return new Promise( async ( resolve, reject ) => {
        // create express app
        const app = express()
    
        app.get('/callback/', (req, res) => {
            res.send('<!DOCTYPE html><html lang="en"><head><title>Zoho Mail CLI</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>*{box-sizing:border-box}body{font-family:Arial,Helvetica,sans-serif;margin:0}.header{padding:80px;text-align:center;background:#1abc9c;color:white}.header h1{font-size:40px}@media screen and (max-width: 700px){.row{flex-direction:column}}@media screen and (max-width: 400px){.navbar a{float:none;width:100%}}</style></head><body><div class="header"><h1>Zoho Mail CLI</h1><h4>Thanks For Authenticating the CLI app</h4><p>You can close your browser tab now.</p></div></body><script>location.replace("/saveToken?"+(window.location.hash).substr(2))</script></html>')
        })
        app.get('/saveToken', (req, res) => {
            try {
                resolve( req.query );
                res.send('<!DOCTYPE html><html lang="en"><head><title>Zoho Mail CLI</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>*{box-sizing:border-box}body{font-family:Arial,Helvetica,sans-serif;margin:0}.header{padding:80px;text-align:center;background:#1abc9c;color:white}.header h1{font-size:40px}@media screen and (max-width: 700px){.row{flex-direction:column}}@media screen and (max-width: 400px){.navbar a{float:none;width:100%}}</style></head><body><div class="header"><h1>Zoho Mail CLI</h1><h4>Thanks For Authenticating the CLI app</h4><p>You can close your browser tab now.</p></div></body></html>')
            } catch (error) {
                console.log('error', error)
            } finally {
                server.close();
                console.log('Server closed')
            }
        })
        var server =  app.listen(8080, () => {
            console.log("Server is listening on port ");
            open( authorizationURL );
            console.log("Please wait untill the browser open...");
        }).on('error', function (err) {
            if(err.errno === 'EADDRINUSE') {
                console.log(`----- Port 8080 is busy-----`);
            } else {
                console.log(err);
            }
            process.exit();
        });

      });
    };
    
    return {
      executeAuthFlow
    };
  };
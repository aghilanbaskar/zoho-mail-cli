# Zoho Mail CLI

Zoho Mail CLI is a node client tool used to authenticate and read account and messages data

## Prerequisites
    * npm  >= 5.0.0
    * node >= 10.0.0

## Installation

Clone and install required packages
```bash
git clone https://github.com/aghilanbaskar/zoho-mail-cli.git

cd zoho-mail-cli

npm i

npm install -g .
```

or install globally via npm package
```sh
npm install -g zoho-mail
```

## Usage

To authenticate the CLI app.
```cli
mail login
```
To read the messages.
```cli
mail messages
```
Read messages with a custom request body
```CLI
mail messages status=read limit=10 sortorder=true
```
Refer [Zoho Get Mail Documentation](https://www.zoho.com/mail/help/api/get-emails-list.html) to pass additional request body params.

## License
[MIT](https://choosealicense.com/licenses/mit/)
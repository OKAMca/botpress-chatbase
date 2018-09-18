# botpress-chatbase
Chatbase is a cloud service that offers products for designing, analyzing, and optimizing conversational experiences. This botpress module integrates your bot with chatbase analytics.

## Use
Install Via NPM
```sh
npm install --save botpress-chatbase
```
chatbase.json config file:
```JS
{
    "apiKey": "<your chatbase api key>",
    "platform": "<chatbase bot platform>",
    "notHandledIntents": "unknown,none" // optional field, comma seperated fallback intents
}
```
On the incoming middleware chain, this module should be placed after botpress-nlu module

const chatbase = require("@google/chatbase");

module.exports = {
  config: {
    apiKey: {
      type: "string",
      required: true,
      default: "",
      env: "CHATBASE_API_KEY"
    },
    platform: {
      type: "string",
      required: true,
      default: "unknown",
      env: "CHATBASE_PLATFORM"
    },
    notHandledIntents: {
      type: "string",
      required: false,
      default: "",
      env: "CHATBASE_NOT_HANDLED_INTENTS"
    }
  },

  // eslint-disable-next-line no-unused-vars
  init: async (bp, configurator, helpers) => {
    const config = await configurator.loadAll();
    chatbase.setApiKey(config.apiKey);

    if( config.platform !== 'auto' ) {
      chatbase.setPlatform(config.platform);
    }

    async function incomingMiddleware(event, next) {
      if (event.type != "text" && event.type != 'message' && event.type != 'postback') {
        next();
        return;
      }
      
      if( config.platform === 'auto' ) {
        const platform = event.platform || 'unknown';
        chatbase.setPlatform(platform);
      }

      const notHandledIntents = config.notHandledIntents.split(",");
      const newMsg = chatbase.newMessage();
      let intent = "";
      let confidence = 0

      if (event.nlu) {
        intent = event.nlu.intent.name;
        confidence = event.nlu.intent.confidence
      }

      if (notHandledIntents.includes(intent) || confidence < 0.7 ) {
        newMsg.setAsNotHandled;
      } else {
        newMsg.setAsHandled;
      }

      newMsg
        .setAsTypeUser()
        .setMessage(event.text)
        .setUserId(event.user.id)
        .setIntent(intent)
        .send();

      next();
    }

    async function outgoingMiddleware(event, next) {
      if (event.type != "text" && event.type != 'message' && event.type != 'postback') {
        next();
        return;
      }

      if( config.platform === 'auto' ) {
        const platform = event.platform || 'unknown';
        chatbase.setPlatform(platform);
      }

      const userId = event.user != null ? event.user.id : event.raw.to;
      const newMsg = chatbase.newMessage();
      newMsg
        .setAsTypeAgent()
        .setMessage(event.text)
        .setUserId(userId)
        .setAsHandled()
        .send();
      next();
    }

    bp.middlewares.register({
      name: "chatbase.incoming",
      module: "botpress-chatbase",
      type: "incoming",
      handler: incomingMiddleware,
      order: 10,
      description: "Send every incoming message to chatbase for analytics"
    });

    bp.middlewares.register({
      name: "chatbase.outgoing",
      module: "botpress-chatbase",
      type: "outgoing",
      handler: outgoingMiddleware,
      order: 10,
      description:
        "Updates every outgoing message in chatbase with Intent, Handled or NotHandled information"
    });
  },

  // eslint-disable-next-line no-unused-vars
  ready: async (bp, configurator, helpers) => {
    // Your module's been loaded by Botpress.
    // Serve your APIs here, execute logic, etc.

    // eslint-disable-next-line no-unused-vars
    const config = await configurator.loadAll();
    // Do fancy stuff here :)
  }
};

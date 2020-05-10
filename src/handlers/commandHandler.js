const Markup = require("telegraf/markup");
const { sessionInit } = require("../sessionInit");
const { deposit } = require("./commands/deposit");
const { balance } = require("./commands/balance");
const { withdraw } = require("./commands/withdraw");
const { isBanned } = require("../utils/isBanned")
// const { checkDeposits } = require("./commands/checkDeposits");

module.exports.commandHandler = bot => {
  bot.start(async ctx => {
    if (ctx.chat.type == "private") await start(ctx);
  });

  bot.help(ctx => {
    if (ctx.chat.type == "private") help(ctx);
  });

  bot.command("menu", ctx => {
    if (ctx.chat.type == "private") menu(ctx);
  });

  bot.command("balance", async ctx => {
    await isAllowed(ctx, balance);
  });

  bot.command("deposit", async ctx => {
    await isAllowed(ctx, deposit);
  });

  bot.command("withdraw", async ctx => {
    if (isBanned(ctx.from.id)) return ctx.reply('Your account has been suspended!🤕');
    await isAllowed(ctx, withdraw);
  });
};

const isAllowed = async (ctx, commandFunction) => {
  if (ctx.chat.type == "private") {
    if (ctx.from.is_bot) return ctx.reply("Only humans accepted.");
    if (!ctx.session.wallet) await sessionInit(ctx);
    await commandFunction(ctx);
  }
};

const start = async ctx => {
  await sessionInit(ctx);

  ctx.reply(
    `Welcome to COCOA Tip Bot ${ctx.from.first_name}!`,
    Markup.keyboard([
      ["/balance", "/help"],
      ["/deposit", "/withdraw"]
    ])
      .oneTime()
      .resize()
      .extra()
  );
};

const help = ctx => {
  helpMsg = `
*CocoaTip help page* \n 
How can I help you? list of my commands:
                          
Type:

/deposit - deposit *🥛COCOA🍫* tokens

/help - list of all commands 

/withdraw - withdrawing *🥛COCOA🍫* 

/balance - your *🥛COCOA🍫* balance

If you need further assistance go to @CocoaToken group.
`;
  ctx.replyWithMarkdown(
    helpMsg,
    Markup.keyboard([
      ["/balance", "/help"],
      ["/deposit", "/withdraw"]
    ])
      .oneTime()
      .resize()
      .extra()
  );
};

const menu = ctx => {
  ctx.reply(
    `Main Menu:`,
    Markup.keyboard([
      ["/balance", "/help"],
      ["/deposit", "/withdraw"]
    ])
      .oneTime()
      .resize()
      .extra()
  );
};

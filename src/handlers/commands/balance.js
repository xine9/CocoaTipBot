const Markup = require("telegraf/markup");
const { getSession } = require("../../dynamoDB");
const { sessionInit } = require("../../sessionInit");

module.exports.balance = async ctx => {
  const session = await getSession(ctx.from.id);
  
  if (!session.wallet.cocoaPoints) await sessionInit(ctx);

  const cocoaPoints = session.wallet.cocoaPoints;

  ctx.replyWithMarkdown(
    `*${ctx.from.first_name}* your balance is: *${cocoaPoints.toLocaleString('en-US')}* ☕*COCOA*`,
    Markup.keyboard([["/balance", "/help"], ["/deposit", "/withdraw"]])
      .oneTime()
      .resize()
      .extra()
  );
};

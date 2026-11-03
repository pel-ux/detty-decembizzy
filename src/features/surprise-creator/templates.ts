import type { VibeId } from "./vibes";

/** {name} is replaced with the recipient's name. Add variations freely. */
export const TEMPLATES: Record<VibeId, readonly string[]> = {
  funny: [
    "Ho ho ho! {name}, Santa don hear say you dey form hard guy this year. Your December activities are currently under investigation.",
    "{name}, Santa checked the list twice. Your name appeared both times, with a note: \"Too much gist, not enough savings.\"",
    "Breaking news from the North Pole: {name} was spotted announcing \"I'm resting this December\" and then attending five events.",
    "{name}, Santa has seen your Detty December plans. He is concerned. He is also impressed. Mostly concerned.",
    "{name}, Santa is at your gate with gifts. He is also hungry. Please bring jollof.",
    "{name}, Santa has one request this December: reply to your messages. Even he is tired of \"seen\".",
  ],
  savage: [
    "{name}, Santa reviewed your year. The report is not looking good. But because Christmas is involved, we go manage you.",
    "Santa tried to put you on the nice list, {name}. The system asked for evidence. We are still waiting.",
    "{name}, you said \"new year, new me\" last January. Santa has the receipts. He's choosing peace because it's Christmas.",
    "Santa has one gift for you, {name}: a gentle reminder that \"I'm coming\" is not a location.",
    "Santa wanted to roast you properly, {name}, but he doesn't want to ruin your Christmas mood. You're lucky today.",
    "{name}, your name is on the nice list. Santa wrote it in pencil. Don't test him.",
  ],
  romantic: [
    "Someone has been thinking about you this Christmas, {name}. Santa may not reveal the identity yet, but the vibes are suspicious.",
    "{name}, Santa delivered a lot of gifts this year, but he says one message was the hardest to carry: someone really likes you.",
    "Dear {name}, if you've been smiling at your phone this December, Santa knows why. So does someone special.",
    "{name}, Santa checked the list. Your name is next to a heart. He's not allowed to say whose.",
    "Some people make December feel warmer, {name}. Santa says you're one of them, and someone agrees.",
    "{name}, Santa has one question and one hint: do you believe in Christmas miracles? Someone is hoping you do.",
  ],
  wholesome: [
    "Dear {name}, Santa wants you to know that you deserve joy, peace, and beautiful moments this Christmas.",
    "{name}, whatever this year took from you, Santa is sending something back: rest, laughter and good food.",
    "Santa checked on the people who make others feel at home, {name}. Your name came up first.",
    "{name}, you showed up for people this year, even on tired days. Santa noticed, and so did they.",
    "Merry Christmas, {name}. May your December be full of good news, full plates and people who are glad you're there.",
    "{name}, Santa has just one wish for you this Christmas: that the new year is kinder than the last.",
  ],
  mysterious: [
    "{name}, a Christmas surprise is waiting for you. One person has something to say, and Santa is keeping the secret.",
    "Santa received a message for you, {name}. He has been told not to say who sent it. He is sweating.",
    "Santa received a name, a message and strict instructions, {name}. He'll only say this: you know this person.",
    "{name}, check your circle. Someone in it planned this, and Santa has been sworn to secrecy.",
    "A clue from Santa, {name}: they know you well, they've been planning this for days, and they're probably waiting for your reaction.",
    "{name}, this surprise has a sender. Santa has the name. Santa will not be taking questions.",
  ],
};

/** Optional personal-detail line, per vibe. {detail} is user-supplied text. */
export const DETAIL_SUFFIX: Record<VibeId, string> = {
  funny: "P.S. Santa also heard about {detail}. He has questions.",
  savage: "P.S. Santa noted this: {detail}. He's choosing peace.",
  romantic: "P.S. Santa also heard something about {detail}. Interesting.",
  wholesome: "P.S. Santa hasn't forgotten {detail}.",
  mysterious: "P.S. Santa was told to mention {detail}. Make of that what you will.",
};
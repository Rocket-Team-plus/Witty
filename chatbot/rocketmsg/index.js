'use strict';

const bodyParser = require('body-parser');
const crypto = require('crypto');
const express = require('express');
const fetch = require('node-fetch');
const axios = require('axios');
const mysql = require('mysql');


let Wit = require('node-wit').Wit;
let log = require('node-wit').log;

let greeting = {
	'嗨': '請問有什麼事我可以幫忙的呢？',
	'哈囉': '請問有什麼事我可以幫忙的呢？',
	'你好': '請問有什麼事我可以幫忙的呢？',
	'再見': '好的，下次見',
	'掰掰': '好的，下次見',
	'88': '好的，下次見',
	'下次見': '好的，下次見',
	'早安': '早安',
	'午安': '午安',
	'晚安': '晚安',
	'謝謝': '不客氣'
};

let secret = {
	'#智障AI': '對不起主人，請您盡情懲罰我吧~',
	'#五條悟': '我知道！王辰君的老公!',
	'#你除了吃你還會幹麻': '對不起',
	'#好棒': '又成功一個了呢',
	'#噢不': '又哪裡出問題了ㄋ'
}

let question_format = {
	'商品問題': '有+(商品名)+嗎？\n(商品名)+多少錢？\n' +
	'可以看+(商品名)+嗎？',
	'付款配送問題': '現在空空',
	'訂單問題': '現在空空',
	'直播問題': '現在空空',
	'店家營業問題': '現在空空',
	'標數問題': '現在空空'
}

let help = ['greeting', 'secret', 'question_format'];

// Webserver parameter
const PORT = process.env.PORT || 80 || 443;

// Wit.ai parameters
const WIT_TOKEN = process.env.WIT_TOKEN;

// Messenger API parameters
const FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN;


if (!FB_PAGE_TOKEN) { throw new Error('missing FB_PAGE_TOKEN') }
	const FB_APP_SECRET = process.env.FB_APP_SECRET;
if (!FB_APP_SECRET) { throw new Error('missing FB_APP_SECRET') }
	const FB_VERIFY_TOKEN = 'test';

// Messenger API specific code

const fbMessage = (id, text) => {
	const body = JSON.stringify({
		message_type: 'RESPONSE',
		recipient: { id },
		message: { text },
	});

	const qs = 'access_token=' + encodeURIComponent(FB_PAGE_TOKEN);

	return fetch('https://graph.facebook.com/v11.0/me/messages?' + qs, {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body,
	})
	.then(rsp => rsp.json())
	.then(json => {
		if (json.error && json.error.message) {
			throw new Error(json.error.message);
		}
		return json;
	});
};

// Wit.ai bot specific code

// This will contain all user sessions.
// Each session has an entry:
// sessionId -> {fbid: facebookUserId, context: sessionState}
const sessions = {};

const findOrCreateSession = (fbid) => {
	let sessionId;
  // Let's see if we already have a session for the user fbid
  Object.keys(sessions).forEach(k => {
  	if (sessions[k].fbid === fbid) {
  		sessionId = k;
  	}
  });
  if (!sessionId) {
    // No session found for user fbid, let's create a new one
    sessionId = new Date().toISOString();
    sessions[sessionId] = {fbid: fbid, context: {}};
}
return sessionId;
};

// Setting up our bot
const wit = new Wit({
	accessToken: WIT_TOKEN,
	logger: new log.Logger(log.INFO)
});


// Starting our webserver and putting it all together
const app = express();
app.use(({method, url}, rsp, next) => {
	rsp.on('finish', () => {
		console.log(`${rsp.statusCode} ${method} ${url}`);
	});
	next();
});
app.use(bodyParser.json({ verify: verifyRequestSignature }));

// Webhook setup
app.get('/webhook', (req, res) => {
	if (req.query['hub.mode'] === 'subscribe' &&
		req.query['hub.verify_token'] === FB_VERIFY_TOKEN) {
		res.send(req.query['hub.challenge']);
	res.sendStatus(200);
} else {
	res.sendStatus(400);
}
});

//Connecting to DB
var connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : 'rocketteamplus',
	database : 'rocketteam',
	port: 3306
});

connection.connect();

// Message handler
app.post('/webhook', (req, res) => {
	const data = req.body;

	if (data.object === 'page') {
		data.entry.forEach(entry => {
			entry.messaging.forEach(event => {
				if (event.message && !event.message.is_echo) {
          // We retrieve the Facebook user ID of the sender
          const sender = event.sender.id;

          // We could retrieve the user's current session, or create one if it doesn't exist
          // This is useful if we want our bot to figure out the conversation history
          // const sessionId = findOrCreateSession(sender);

          // We retrieve the message content
          const {text, attachments} = event.message;

          if (attachments) {
            // We received an attachment
            fbMessage(sender, 'Sorry I can only process text messages for now.')
            .catch(console.error);
        } else if (text) {
            // We received a text message
            if (!checkDefaultText(text, sender)) {
            	wit.message(text).then((data) => {
            		console.log(JSON.stringify(data));
            		let intents = data.intents;
            		let entities = data.entities;
            		let confidence_e = [];
            		Object.keys(entities).forEach(entity => {
            			confidence_e.push(entities[entity][0].confidence);
            		});

            		if (!isEmpty(intents)) {
            			let confidence_i = [intents[Object.keys(intents)[0]].confidence];
            			if (checkConfidence(confidence_i)) {
            				if(!handleIntents(sender, intents, entities, confidence_e)) {
            					fbMessage(sender, `收到訊息： ${text},但因為entities信心度不夠而不處理` );
            				} 
            			} else  if (!isEmpty(entities)) {
            				if(!handleNoIntents(sender, entities, confidence_e)) {
            					fbMessage(sender, `收到訊息： ${text},但因為entities信心度不夠而不處理` );
            				} 
            			} else {
            				fbMessage(sender, `收到訊息： ${text},但因為intents信心度不夠且無法辨認entities而不處理` );
            			}
            		} else if (!isEmpty(entities)) {
            			if(!handleNoIntents(sender, entities, confidence_e)) {
            				fbMessage(sender, `收到訊息： ${text},沒有intents且因為entities信心度不夠而不處理` );
            			} 
            		} else {
            			fbMessage(sender, `收到訊息： ${text},但我們目前無法處理` );
            		}

            	}).catch((err) => {
            		console.error('Oops! Got an error from Wit: ', err.stack || err);
            	})
            }     
        }
    } else {
    	console.log('received event', JSON.stringify(event));
    }
});
		});
	}
	res.sendStatus(200);
});

app.listen(PORT);
console.log('Listening on :' + PORT + '...');

/*
 * Verify that the callback came from Facebook. Using the App Secret from
 * the App Dashboard, we can verify the signature that is sent with each
 * callback in the x-hub-signature field, located in the header.
 *
 * https://developers.facebook.com/docs/graph-api/webhooks#setup
 *
 */
 function verifyRequestSignature(req, res, buf) {
 	var signature = req.headers["x-hub-signature"];
 	console.log(signature);

 	if (!signature) {
    // For testing, let's log an error. In production, you should throw an
    // error.
    console.error("Couldn't validate the signature.");
} else {
	var elements = signature.split('=');
	var method = elements[0];
	var signatureHash = elements[1];

	var expectedHash = crypto.createHmac('sha1', FB_APP_SECRET)
	.update(buf)
	.digest('hex');

	if (signatureHash != expectedHash) {
		throw new Error("Couldn't validate the request signature.");
	}
}
}

function isEmpty(val) {
	return (val === undefined || val == null || val.length <= 0) ;
}

function checkConfidence(array) {
	let trigger = true;
	for (var i = 0; i < array.length; i++) {
		if (array[i] >= 0.7) {
			trigger = true;
		} else {
			trigger = false;
			break;
		}
	}
	return trigger;
}

//---------------------------------------------------------
/* 
index reference:

0: help 
1: greeting -> show all
2: secret -> show all
3: secret -> respone
4: greeting -> response
5: question format -> response
6: question -> show all

*/

function checkDefaultText(text, sender) {
	if (text === 'help') {
		handleDefaultText(sender, 0);
		return true;
	} else if (text === 'greeting') {
		handleDefaultText(sender, 1);
		return true;
	} else if (text === 'secret') {
		handleDefaultText(sender, 2);
		return true;
	} else if (text === 'question_format') {
		handleDefaultText(sender, 6);
		return true;
	} else if (text.indexOf('#') != -1) {
		let count = 0;
		Object.keys(secret).forEach(sc => {
			if(sc.indexOf(text) != -1){
				count++;
			}
		})
		if (count > 0) {
			handleDefaultText(sender, 3, text);
			return true;
		} else {
			return false;
		}
	} else {
		let gt_count = 0;
		Object.keys(greeting).forEach(gt => {
			if(text === gt){
				gt_count++;
			}
		})
		let qt_count = 0;
		Object.keys(question_format).forEach(qt => {
			if (text === qt) {
				qt_count++;
			}
		})
		if (gt_count > 0 ) {
			handleDefaultText(sender, 4, text);
			return true;
		} else if (qt_count > 0) {
			handleDefaultText(sender, 5, text);
			return true;
		} else {
			return false;
		}
	}
}

function addText(text, res, type) {
	greeting[text] = res;
}

function showAll(sender, type) {
	if (type == 1) {
		fbMessage(sender, Object.keys(greeting).toString());
	} else if (type == 2) {
		fbMessage(sender, Object.keys(secret).toString());
	} else if (type == 6) {
		fbMessage(sender, Object.keys(question_format).toString());
	}
}

function handleDefaultText(sender, type, ...text) {
	if (type == 0) {
		fbMessage(sender, help.toString() + '\n輸入以上字詞以獲得更多資訊！\n' +
			'greeting: 基本問答\nsecret: 神秘的東西\nquestion_format: 問題格式');
	} else if (type == 1) {
		showAll(sender, 1);
	} else if (type == 2) {
		showAll(sender, 2);
	} else if (type == 3) {
		fbMessage(sender, secret[text[0]]);
	} else if (type == 4) {
		fbMessage(sender, greeting[text[0]]);
	} else if (type == 5) {
		fbMessage(sender, question_format[text[0]]);
	} else if (type == 6) {
		showAll(sender, 6);
	} 
}

//-----------------------------------------------------------------------

function handleIntents(sender, intents, entities, confidence_e) {
	if (checkConfidence(confidence_e)) {
		if (intents[Object.keys(intents)[0]].name === '商品問題') {
			handleProductQuestion(sender, entities);
			return true;
		} else if (intents[Object.keys(intents)[0]].name === '付款配送') {
			handleDeliveryAndPaymentQuestion(sender, entities);
			return true;
		} else if (intents[Object.keys(intents)[0]].name === '訂單問題') {
			handleOrderQuestion(sender, entities);
			return true;
		} else if (intents[Object.keys(intents)[0]].name === '直播問題') {
			handleStreamingQuestion(sender, entities);
			return true;
		} else if (intents[Object.keys(intents)[0]].name === '店家營業問題') {
			handleStoreQuestion(sender, entities);
			return true;
		} else if (intents[Object.keys(intents)[0]].name === '標數問題') {
			handleBidQuestion(sender, entities);
			return true;
		} else {
			fbMessage(sender, '抱歉，目前我們無法處理這樣的問題');
		}
	} else {
		return false;
	}
}

function handleNoIntents(sender, entities, confidence_e) {
	if (checkConfidence(confidence_e)) {
		handleProductQuestion(sender, entities);
		handleDeliveryAndPaymentQuestion(sender, entities);
		handleOrderQuestion(sender, entities);
		handleStreamingQuestion(sender, entities);
		handleStoreQuestion(sender, entites);
		handleBidQuestion(sender, entities);
		return true;
	} else {
		return false;
	}
}

function handleProductQuestion(sender, entities) {
	if (checkEntityIndex(entities, 'product:product')) {
		let keyword = entities[Object.keys(entities)[Object.keys(entities).indexOf('product:product')]][0].body;
		if (checkEntityIndex(entities, 'money:money')) {
			postQueryAndReply(sender, keyword, 0);
		} else if (checkEntityIndex(entities, 'yes_no:yes_no')) {
			if (checkEntityIndex(entities, 'day:day')) {
				fbMessage(sender, keyword + '有沒有不知道，幫你問直播主');
			} else if (checkEntityIndex(entities, 'see:see')) {
				fbMessage(sender, '好就給你看' + keyword);
			} else {
				postQueryAndReply(sender, keyword, 1);
			}
		} else if (checkEntityIndex(entities, 'see:see')) {
			if (checkEntityIndex(entities, 'day:day')) {
				fbMessage(sender, keyword + '這個不知道耶，要問直播主');
			} else {
				postQueryAndReply(sender, keyword, 2);
			}
		} else if (checkEntityIndex(entities, 'usage:usage')) {
			fbMessage(sender, keyword + '要怎麼用不知道，要問直播主');
		} else {
			fbMessage(sender, '幫你問問直播主');
		}
	} else if (checkEntityIndex(entities, 'money:money')) {
		fbMessage(sender, '一律87元');
	} else if (checkEntityIndex(entities, 'see:see')) {
		fbMessage(sender, '幫你問直播主可不可以看');
	} else if (checkEntityIndex(entities, 'usage:usage')) {
		fbMessage(sender, '幫你問問直播主怎麼用');
	} else if (checkEntityIndex(entities, 'yes_no:yes_no')) {
		fbMessage(sender, '幫你問問直播主有沒有');
	}
}

function handleDeliveryAndPaymentQuestion(sender, entities) {
	if (checkEntityIndex(entities, 'delivery:delivery')) {
		if (checkEntityIndex(entities, 'time:time')) {
			fbMessage(sender, '什麼時候送？我幫你問問直播主');
		} else if (checkEntityIndex(entities, 'yes_no:yes_no')) {
			fbMessage(sender, '要看是什麼方式取貨喔');
		}
	} else if (checkEntityIndex(entities, 'pay:pay')) {
		if (checkEntityIndex(entities, 'yes_no:yes_no')) {
			fbMessage(sender, '要看是什麼方式付款喔');
		}
	} else if (checkEntityIndex(entities, 'money:money')) {
		fbMessage(sender, '運費一律60謝謝');
	}
}

function handleOrderQuestion(sender, entities) {
	if (checkEntityIndex(entities, 'order:order')) {
		fbMessage(sender, '抱歉，訂單問題一律先問直播主');
	}
}

function handleStreamingQuestion(sender, entities) {
	if (checkEntityIndex(entities, 'live:live')) {
		fbMessage(sender, '抱歉，直播問題一律先問直播主');
	}
}

function handleStoreQuestion(sender, entities) {
	if (checkEntityIndex(entities, 'open:open')) {
		fbMessage(sender, '抱歉，店家問題一律先問直播主');
	}
}

function handleBidQuestion(sender, entities) {
	if (checkEntityIndex(entities, 'number:number')) {
		fbMessage(sender, '抱歉，標數問題一律先問直播主');
	}
}

function checkEntityIndex(entities, name) {
	if (Object.keys(entities).indexOf(name) != -1) {
		return true;
	} else {
		return false;
	}
}

function postQueryAndReply(sender, keyword, type) {
	if (type == 0) {
		connection.query('SELECT price from products WHERE product_name LIKE \'%' + keyword + '%\'', 
			function (error, results, fields) {
				if (error) {
					throw error;
				}
				if (!isEmpty(results)) {
					fbMessage(sender, results[0].price);
				} else {
					fbMessage(sender, '抱歉，沒有這項商品喔');
				}
			});
	} else if (type == 1) {
		connection.query('SELECT product_name from products WHERE product_name LIKE \'%' + keyword + '%\'', 
			function (error, results, fields) {
				if (error) {
					throw error;
				}
				if (!isEmpty(results)) {
					fbMessage(sender, '有' + keyword + '喔');
				} else {
					fbMessage(sender, '抱歉，沒有這項商品喔');
				}
			});
	} else if (type == 2) {
		connection.query('SELECT product_name from products WHERE product_name LIKE \'%' + keyword + '%\'', 
			function (error, results, fields) {
				if (error) {
					throw error;
				}
				if (!isEmpty(results)) {
					fbMessage(sender, '好的，給你看一下' + keyword);
				} else {
					fbMessage(sender, '抱歉，沒有這項商品喔');
				}
			});
	}
}
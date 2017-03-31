var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: '',
    appPassword: ''
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

// Arrays of menu items to display with choice prompts

var noodles = [
	'Rice Noodle',
	'Flat Rice Noodle',
	'Northern Fine Cut Noodle',
	'Shan Dong Noodle',
	'Instant Noodle',
	'Udon',
	'Egg Noodle',
	'Rice Cake',
	'Rice'
];

var broth = [
	'Szechuan Spicy',
	'Thai Tom Yam',
	'Japanese Curry',
	'Original Spicy',
	'Chicken Broth',
	'Vegetarian Soup'
];

var eggs = [
	'Boiled',
	'Stewed',
	'Fried'
];

var vegetables = [
	'Chives',
	'Mushroom',
	'Bean Sprout',
	'Chinese Cabbage',
	'Black Fungus',
	'Sliced Tomato',
	'Bak Choi',
	'Spinach',
	'Enoki Mushroom',
	'Mashed Garlic',
	'Sliced Pickle'
];

var mainToppings = [
	'Spam',
	'Dried Bean Curd',
	'Sliced Chicken',
	'Sliced Beef',
	'Beef Tripe',
	'Fresh Fish Cut',
	'Fresh Shrimp',
	'Fish Ball',
	'Fish Cake',
	'Five Spicy Beef',
	'Salty Duck',
	'Braised Pork',
	'Braised Rib',
	'Braised Beef',
	'Braised Pork Meat Ball',
	'Broccoli',
	'Sliced Dried Tofu'
];

// function to create a list like the Prompts.choice does, but to use with text so we can have multiple answers

var createList = function(array){

	var list = '\n'; // set it to a string with a line break

	for (var i = 0 ; i < array.length ; i++) {
		list += i+1 + '. ' + array[i] + '\n'; // number each item, and break the line afterwards
	}

	return list;

}



//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', [
	function (session) {
		builder.Prompts.text(session, 'Hi, I\'m NoodleBot! I\'m here to help you order a delicious bowl of noodle soup. Let me know when you\'re ready by saying anything.');
	},
	function (session) {
		builder.Prompts.choice(session, 'First, let\'s decide what kind of broth you would like.', broth);
	},
	function (session, args) {
		console.log('hi there');
		session.userData.orderDetails = {};
		if (args && args.response && args.response.entity) {
			session.userData.orderDetails['broth'] = args.response.entity;
		}
		builder.Prompts.choice(session, 'Cool. Next pick the kind of noodles you would like.', noodles);
	},
	function (session, args) {
		if (args && args.response && args.response.entity) {
			session.userData.orderDetails['noodles'] = args.response.entity;
		}
		builder.Prompts.choice(session, 'Great! Your noodles will also come with an egg. How would you like your egg prepared?', eggs);
	},
	function (session, args) {
		if (args && args.response && args.response.entity) {
			session.userData.orderDetails['egg'] = args.response.entity;
		}
		builder.Prompts.text(session, 'Alright, time to take your pick at the main toppings. Enter up to 3 numbers separated by a comma and a space (ex. 3, 6, 2) (You can order more than 3, and will be charged 1.50 per extra topping)' + createList(mainToppings));
	},
	function (session, args) {

		//example args.response = '3, 6, 2';

		// turn the string of numbers into an array of ints so that we can use them to get the corresponding items from the array of choices
		var array = args.response.split(',');

		var choices = [];

		for (var i = 0 ; i < array.length ; i++) {
  			array[i] = parseInt(array[i]);
  			choices.push(mainToppings[array[i]-1]);
		}



		session.userData.orderDetails['mainToppings'] = choices;
		
		console.log('session.userData.orderDetails: ', session.userData.orderDetails);
		builder.Prompts.text(session, 'Now let\'s pick your vegetables. Enter up to 3 numbers separated by a comma and a space (ex. 3, 6, 2) (You can order more than 3, and will be charged 1.50 per extra topping)' + createList(vegetables));
	},
	function (session, args) {

		//example args.response = '3, 6, 2';

		// turn the string of numbers into an array of ints so that we can use them to get the corresponding items from the array of choices
		var array = args.response.split(',');

		var choices = [];

		for (var i = 0 ; i < array.length ; i++) {
  			array[i] = parseInt(array[i]);
  			choices.push(vegetables[array[i]-1]);
		}



		session.userData.orderDetails['vegetables'] = choices;
		
		console.log('session.userData.orderDetails at teh end: ', session.userData.orderDetails);


		var finalOrder = session.userData.orderDetails;
		// we have this finalOrder object we'd send somewhere on the backend to actually place the order

		builder.Prompts.text(session, 'Sweet! Your order is all finished, and has been sent to the restaurant to be prepared.');
	},
]);
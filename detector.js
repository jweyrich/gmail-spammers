function get_spammers () {
	var matches = $('div[role=main] span[email][name]');
	// TODO(jweyrich): How to identify and filter out duplicate DOM elements?
	var hashtable = {};
	matches.each(function (i, v) {
		var key = v.attributes.email.value;
		var value = {
			name: v.attributes.name.value,
			//hits: key in hashtable ? hashtable[key].hits + 1 : 1
		};
		hashtable[key] = value;
	});
	return hashtable;
}

function flatten (obj) {
    var result = Object.create(obj);
    for (var key in result) {
    	if (!result.hasOwnProperty(key))
        	result[key] = obj[key];
    }
    return result;
}

function communicate_result (detail) {
	// Send data to the Chrome extension.
	document.dispatchEvent(new CustomEvent('GmailSpammers:ResultsNotification', {
		detail: detail
	}));
}

function navigation_reactor () {
	console.debug('detector.js: Changed location to ' + window.location);
	var match = /https\:\/\/mail\.google\.com\/mail\/u\/\d+\/#spam(?:\/p\d+)*$/.test(window.location);
	if (match) {
		//alert('Match at ' + window.location);
		var spammers = get_spammers();
		//console.debug(JSON.stringify(flatten(spammers), null, 2));
		communicate_result(spammers);
	}
}

$(window).load(function () {
	//console.debug('detector.js: running on ' + window.location);
	window.addEventListener('popstate', navigation_reactor);
	// TODO(jweyrich): Invoke the reactor only when we detect the spam list has been added to the DOM.
	navigation_reactor();
	//console.debug('detector.js: done!');
});
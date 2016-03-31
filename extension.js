function show_results (detail) {	
	if (Object.keys(detail).length == 0)
		return;

	var json = JSON.stringify(detail, null, 0);
	
	var results_window = openWindowWithParameters(
		chrome.extension.getURL('popup.html'),
		{ detail: json }
	);
}

function openWindowWithParameters (location, params) {
	var windowName = 'ResultsWindow';
	var windowURL = location;
	var windowWidth = Math.ceil(window.width / 2);
	var windowHeight = window.height - 100;
	var windowOptions ='toolbar=no, location=no, status=no, menubar=no, scrollbars=yes, resizable=yes'
		+ ', width=' + windowWidth + ', height=' + windowHeight;
	var form = document.createElement("form");
	form.setAttribute("method", "GET");
	form.setAttribute("action", windowURL);
	form.setAttribute("target", windowName);
	for (var i in params) {
		if (params.hasOwnProperty(i)) {
			var input = document.createElement('input');
			input.type = 'hidden';
			input.name = encodeURIComponent(i);
			input.value = encodeURIComponent(params[i]);
			form.appendChild(input);
		}
	}
	document.body.appendChild(form);
	window.open('', windowName, windowOptions);
	form.target = windowName;
	form.submit();
	document.body.removeChild(form);
}

function injectScript (path) {
	var s = document.createElement('script');
	s.src = chrome.extension.getURL(path);
	s.onload = function () { s.parentNode.removeChild(s); };
	(document.head || document.documentElement).appendChild(s);
	return s;
}

function main () {
	// Inject scripts
	injectScript('jquery-2.2.2.min.js')
		.onload = function () { injectScript('detector.js') };

	// Event listener
	document.addEventListener('GmailSpammers:ResultsNotification', function (e) {
		// e.detail contains the transferred data.
		show_results(e.detail);
	});
}

$(document, window).ready(main);
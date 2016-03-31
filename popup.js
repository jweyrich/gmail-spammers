function getRequestVariables () {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
		vars[decodeURIComponent(key)] = decodeURIComponent(value);
	});
	return vars;
}

$(document).ready(function () {
	var get = getRequestVariables();
	var json = decodeURIComponent(get['detail']);
	var obj = JSON.parse(json);

	var lis = Object.keys(obj).map(function (key) {
		var li = document.createElement('li');
		li.setAttribute('class', 'list-item');
		//li.innerText = obj[key].hits + " \"" + obj[key].name + "\" <" + key + ">";
		li.innerText = "\"" + obj[key].name + "\" <" + key + ">";
		return li;
	});

	$('ul.list').append(lis);
});

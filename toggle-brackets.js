/* global findAndReplaceDOMText */

// javascript:
(function(){
	'use strict';

	// initialize on first click
	var initialized = false;
	if (!initialized) {
		initialized = true;
		init();
	}

	// toggle class="display-brackets" on <body>
	window.hideBrackets = !window.hideBrackets;
	if (window.hideBrackets) {
		document.body.classList.remove('display-brackets');
	} else {
		document.body.classList.add('display-brackets');
	}
	
	// execute callback after passed script URLs have loaded
	function loadScripts(urls, cb) {
		var numReady = 0;
		function count() {
			if (++numReady === urls.length) cb();
		}

		urls.forEach(function loadScript(url) {
			var s = document.createElement('script');
			s.src = url;
			s.defer = true;
			s.onload = count;
			document.body.appendChild(s);
		});
	}

	// find the first parent that contains the passed nodes
	function getNearestAnscestor() {
		return [].reduce.call(arguments, function(prev, cur) {
			if (prev.contains(cur)) {
				return prev;
			} else {
				var parent = prev.parentNode;
				while (!parent.contains(cur)) {
					parent = parent.parentNode;
				}
				return parent;
			}
		});
	}
	
	// Get the text nodes which are descendants of the passed parent
	function getTextNodes(parent){
		var all = [];
		for (parent = parent.firstChild; parent; parent = parent.nextSibling) {
			if (['SCRIPT','STYLE'].indexOf(parent.tagName) >= 0) continue;
			if (parent.nodeType == 3) all.push(parent);
			else all = all.concat(getTextNodes(parent));
		}
		return all;
	}
	
	function init() {
		// wrap bracketed text in <span class="bracketed-text"> elements
		var replace = (function() {			
			// create <span> for cloning and wrapping bracketed text
			var wrapperTemplate = document.createElement('span');
			wrapperTemplate.className = 'bracketed-text';

			// get all text nodes
			var textNodes = getTextNodes(document.body);
			console.log('textNodes: ' + textNodes.length);

			// only include nodes with [ or ]
			var relevantTextNodes = textNodes.filter(function(node) {
				return node.textContent.indexOf('[') >= 0 ||
					node.textContent.indexOf(']') >= 0;
			});
			console.log('relevantTextNodes: ' + relevantTextNodes.length);

			// find their nearest parent
			var textContainer = getNearestAnscestor.apply(null, relevantTextNodes);

			return function replace() {
				// configure findAndReplaceDOMText to exclude <sup> from search
				findAndReplaceDOMText.NON_PROSE_ELEMENTS.sup = 1;

				// wrap bracketed text with space before or after
				findAndReplaceDOMText(textContainer, {
					preset: 'prose',
					find: /( \[[^\[]+\]|\[[^\[]+\] )/g,
					wrap: wrapperTemplate
				});
			};
		})();

		// load Github script and start replace: padolsey/findAndReplaceDOMText
		loadScripts([
			// 'https://cdn.rawgit.com/padolsey/findAndReplaceDOMText/master/src/findAndReplaceDOMText.js'
			'https://daniel-hug.github.io/toggle-brackets/node_modules/findandreplacedomtext/src/findAndReplaceDOMText.js'
		], replace);

		// CSS will go in <style>
		(function() {
			/*
			.bracketed-text {
				display: none;
			}

			.display-brackets .bracketed-text {
				display: inline;
			}
			*/
			var css = '.bracketed-text {display: none;}.display-brackets .bracketed-text {display: inline;}';

			var style = document.createElement('style');
			style.innerHTML = css;
			document.head.appendChild(style);
		})();
	}
})();
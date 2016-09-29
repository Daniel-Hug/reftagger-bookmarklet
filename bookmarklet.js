/* global window */

// javascript:
(function(){
	'use strict';

	//javascript:
	window.refTagger = {
		settings: {
			noSearchTagNames: [],
			bibleVersion: "ESV"
		}
	};

	(function(d) {
		var s = d.createElement('script');
		s.src = "//api.reftagger.com/v2/RefTagger.js";
		d.body.appendChild(s);
	}(document));
})();
(function() {
	'use strict';

	var uglify = (function() {
		var compressor = UglifyJS.Compressor({
			negate_iife: false,
			unsafe: true,
			warnings: false
		});
	
		return function uglify(js) {
			var ast = UglifyJS.parse(js);

			// compress
			ast.figure_out_scope();
			ast = ast.transform(compressor);

			// mangle
			ast.figure_out_scope();
			ast.mangle_names();

			// convert parse tree to string:
			return ast.print_to_string();
		};
	})();

	var bookmarklet = (function() {
		var versionSelect = document.getElementById('version');
		var bookmarklet = {
			translation: versionSelect.value,
			src: null,
			generate: (function() {
				// grab elements
				var link = document.getElementById('bookmarklet');
				var textarea = document.getElementById('src-preview');

				return function generateBm() {
					// replace {{version}} with selected version
					var href = this.src.split('{{version}}').join(this.translation);

					link.href = href;
					link.textContent = link.textContent.split(' ')[0] + ' ' + this.translation;
					textarea.value = href;
				};
			})()
		};

		// update bookmarklet when selected translation changes
		versionSelect.addEventListener('change', function() {
			bookmarklet.translation = versionSelect.value;
			bookmarklet.generate();
		}, false);

		return bookmarklet;
	})();

	// get bookmarklet src with ajax
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'bookmarklet.js', true);

	// check for reply
	function handleSrc(src) {
		// compress bookmarklet script
		var compressedJS = uglify(src);

		// make it a URL:
		bookmarklet.src = "javascript:" + compressedJS.split('%').join('%25');

		bookmarklet.generate();
	}
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {
			handleSrc(xhr.responseText);
		}
	};

	// send request
	xhr.send();
})();
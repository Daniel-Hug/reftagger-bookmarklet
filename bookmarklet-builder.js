(function() {
	// compress JS from JS panel via closure compiler API
	// and turn it into a "javascript:" link

	var compressor = UglifyJS.Compressor({
		negate_iife: false,
		unsafe: true,
		warnings: false
	});

	function uglify(js) {
		var ast = UglifyJS.parse(js);

		// compress
		ast.figure_out_scope();
		ast = ast.transform(compressor);

		// mangle
		ast.figure_out_scope();
		ast.mangle_names();

		// convert parse tree to string:
		return ast.print_to_string();
	}


	// grab elements
	var bookmarklet = document.getElementById('bookmarklet');
	var textarea = document.getElementById('src-preview');

	// get bookmarklet src with ajax
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'bookmarklet.js', true);

	// check for reply
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {
			handleSrc(xhr.responseText);
		}
	};

	// send request
	xhr.send();


	function handleSrc(bmScript) {
		// compress bookmarklet script
		var compressedJS = uglify(bmScript);

		// add script to link and textarea
		var href = "javascript:" + compressedJS.split('%').join('%25');
		bookmarklet.href = href;
		textarea.value = href;
	}
})();
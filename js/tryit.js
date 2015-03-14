jQuery(function(){
	
	ot = window.ot || {};
	ot.create_tryiteditor = function(id) {
		var opt = {};
		opt.after_toolbar = "<br 'clear:both' />";
		opt.after_toolbar += "<input type='button' class='onethird-button ' value='Quit' onclick='ot.editor.quit("+id+")' />";
		opt.after_toolbar += "<input type='button' class='onethird-button ' value='Update' onclick='ot.editor.save("+id+")' />";
		opt.after_toolbar += "<input type='button' class='onethird-button ' value='Image' onclick='ot.open_uploader()' />";
		ot.editor.sel = '#tryitEditor-content-'+id;
		ot.tryitEditor.create(ot.editor.sel,opt);
	};
	ot.editor = ot.editor || {};
	ot.editor.quit = function() {
		ot.tryitEditor.quit();
	};
	ot.editor.save = function(id) {
		ot.jq.ajax({
			type: 'POST',
			url: ajaxurl,
			data: {
					'action' : 'tryitEditor_post'
					,'post_content' : ot.tryitEditor.html()
					,'ID':id
			},
		})
		.done(function(data) {
			ot.jq(ot.editor.sel).html(ot.tryitEditor.html());
			ot.tryitEditor.quit();
		})
		.fail(function(data) {
			alert('save error');
		});
	};

	if (!ot.uploader) {
		ot.uploader = wp.media({
			title: 'Media'
			, library: {
					type: 'image'
			}
			, button: {
					text: 'Insert'
			}
			, multiple: false
		});

		ot.uploader.on('select', function() {
				var images = ot.uploader.state().get('selection');
				var date = new Date().getTime();
				images.each(function(file){
					ot.tryitEditor.recov_cursor();
					ot.tryitEditor.insert('<img src="'+file.toJSON().url+'" />');
				});
		});
		
		ot.open_uploader = function() {
			ot.tryitEditor.save_cursor()
			ot.uploader.open();
		}

	}
	
	var t = ".tryitEditor-content {";
	t += "cursor:pointer;";
	t += "transition:background linear .2s;";
	t += "}";
	t += ".tryitEditor-content:hover {";
	t += "background-color:#c0c0c0;"
	t += "color:#222;"
	t += "}";
	ot.jq('head').append("<style id='_wp_tryitEditor_style'>"+t+"</style>");
	
});
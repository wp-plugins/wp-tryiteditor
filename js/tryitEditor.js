/*

	tryitEditor - Inline WYSIWYG editor for OneThird CMS
	v0.40
	for IE10+, Chrome, FireFox
	
	Copyright 2013 team1/3
	
	tryitEditor is distributed under the terms of the MIT license
	For more information visit http://onethird.net/
	
	Usage:
	ot.tryitEditor.create('selector' or dom elements,option);	 Dom elements must be DIV
	ot.tryitEditor.insert(HTML);	
	ot.tryitEditor.html();	
	ot.tryitEditor.quit();	
	ot.tryitEditor.close();	
	
	selector:
	ex. '#id'
	
	option:
	width					 ... width
	height				 ... height	 * if value is 0 toolbar will be fix position.
	toolbar				 ... default toolbar array.
	before_toolbar ... insert toolbar html.
	after_toolbar	 ... insert toolbar html.
	table_style		 ... insert html, when press insert table btn.
										 row : default row count, col : default col count
										 table : default style	, td : default td style
										 cell : default cell text
	hide_ind			 ... hide indicator.
	html					 ... default html.
	body_css			 ... editor html body css.
	empty_str			 ... if html is this str, html set empty.
	onedit					... exec it when start edit ( must be function )
	onclose					... exec it when quit edit ( must be function )

 */

	ot = window.ot || {};
	ot.tryitEditor = ot.tryitEditor || {};
	if ($ && $.fn && $.fn.jquery) {
		ot.jq = $;
	} else {
		ot.jq = jQuery;
	}
	ot.tryitEditor.create = function(sel,opt) {

		ot.tryitEditor.navigator = 'ie';
		if (window.navigator && window.navigator.userAgent) {
			var a = window.navigator.userAgent.toLowerCase();
			if (a.indexOf('chrome') != -1) {
				ot.tryitEditor.navigator = 'chrome';

			} else if (a.indexOf('msie') != -1) {
				ot.tryitEditor.navigator = 'ie';
				if (a.indexOf('msie 8.') != -1 || a.indexOf('msie 7.') != -1) {
					ot.tryitEditor.ie8 = true;
				} else {
					ot.tryitEditor.ie9over = true;
				}

			} else if (a.indexOf('firefox') != -1) {
				ot.tryitEditor.navigator = 'firefox';

			} else if (a.indexOf('iphone') != -1 || a.indexOf('android') != -1) {
				ot.tryitEditor.navigator = 'mobile';

			} else {
				if (a.indexOf('trident') != -1) {
					ot.tryitEditor.ie9over = true;
					ot.tryitEditor.ie10over = true;
				}
				ot.tryitEditor.navigator = '';
			}
		}

		if (ot.jq('#_tryitEditor_toolbar_outer, #_tryitEditor_contents, #_tryitEditor_html').length) {
			ot.tryitEditor.quit();
		}
		ot.tryitEditor.sel = sel;
		ot.tryitEditor.opt = opt || {};
		if (typeof(ot.tryitEditor.opt.onedit) == "function") {
			ot.tryitEditor.opt.onedit();
		}
		ot.tryitEditor.opt.before_toolbar = ot.tryitEditor.opt.before_toolbar || '';
		ot.tryitEditor.opt.after_toolbar = ot.tryitEditor.opt.after_toolbar || '';
		ot.tryitEditor.opt.height = ot.tryitEditor.opt.height || 0;
		ot.tryitEditor.opt.table_style = ot.tryitEditor.opt.table_style || { row:2, col:3 };
		ot.tryitEditor.opt.table_style.table = ot.tryitEditor.opt.table_style.table || 'border-collapse: collapse;margin:10px;';
		ot.tryitEditor.opt.table_style.td = ot.tryitEditor.opt.table_style.td || 'border: 1px solid #c0c0c0;padding:5px;';
		ot.tryitEditor.opt.table_style.cell = ot.tryitEditor.opt.table_style.cell || '&nbsp;';
		ot.tryitEditor._switch(!ot.tryitEditor.opt.hide_ind);
		
		var o = ot.jq(sel);
		if (ot.tryitEditor.opt.height > 500) {
			ot.tryitEditor.opt.height = 500;
		}
		ot.tryitEditor.opt.width = ot.tryitEditor.opt.width || o.width()-5*2;	// for padding 5px
		if ( ot.tryitEditor.opt.width < 200 ) { ot.tryitEditor.opt.width = 200; }
		
		o.hide();
		var ar = [ 
				// module name, elem type, ie8, HTML mode, image
				['_tag_edit',0,0,'Tag edit', 0,"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAEXSURBVDjLY/j//z8DJZhhmBpg2POQn2wDDDof8HvOe3osYtXzDzCxuM2vP3gvfn4MJIfXAP22e0Ies58eK9r2+r//3Kf3YOIhq17eK9v95j9ITrv2jhBWA/Ra7kVEr375vXDrq/9+s57eUy+4IY0kJx2w6Nk9kFzE0uffgXIRKAboNtxlC1/+/GPljjdABc9+q+ZcM0Z3qmb5LWOQXOmml/8DZz7+qJB0hQ3FBerFNyNC5z/9nrXqxX+Pvgf35OMuSSPJSXtPfXQPJBc089F3oFwE1jBQTLkiZNtw51jq4qf/XVvuwsPAa9Kjexkrnv8HyclFXxTCGwsyERf4LctvHvPuvAePBf8pDz/Y1N45BpIbKUmZFAwAR3nW32nUrY0AAAAASUVORK5CYII="]
			, ['_attribute',0,0,'attribute', 0,"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAAASAAAAEgARslrPgAAAAl2cEFnAAAAEAAAABAAXMatwwAAA6BJREFUOMtd0vlP03ccx/HX5/v5Hr1bWigiOKJo3eQqZ0nJHCgIDCPJ3CRRq4LJsjB3GBemyVwwW4g/MXdE4pGFZYxkM+BmHBPYDMGYuIPM1XEVOkthZI6Go/ak7fezHxYWs+cf8Hgnr7xJdXU1CKHYvDnrekVFVa0kifz09MzqtWs9/aOjP73JGFsCALM5BXa7HcnJKQAYH43GLH19vZN8OBzSLC2tBGIxOeZwNCnKy4sAwFRZWeE4efKNZ+7eHa4TBN6XkZGOWCwGSumekhJbh8ezkA7gdbS0vDZy5EizS6vVZWXnWHu+uTEgh8JrjDHGenv7mdGY3EkpxzU07EVV1S50d3fPLi0F2bGmEwmOo6+iu7s3MjfnY0ePvjyrVKpSc3ILbt6752TxOGPTM3+y0tLyhxqNiq+r24PW1tOdXV1fsubjJxJarf4WAB0fja7BYEjCqVOtT0mS5FQoVXFJkrC8HEQoGIEsy7zNZovb7Tuv6nTm4+3t5+ZdrvG3AfQD8FOzeYMjN6fQpNGqUFBYqi6wFmklpQKhtQQkUUA4GBSTjKb9Gk1SzcWLF/5wu6fqAdwGEAEA6vHMrOgNyXu3ZFmoSqmGKEkIrPixMPYAhg0pyLJs5YOBcNqlSx8vuN2uIkEUvXIigfVoOBJx/ub8ZXF2zlvm868qXN5ZuG4Pwjz5M/FMu7Ci1qK8rBhanVExOT4REUR+JBQKAQAIASBKAjiBghKyqVQQmjIF8dPWip2R5a4rbLCkiHUdcjB/MMziCcYuX/48kZm55YP164QA9JDMkC0zZDHmt8jyxmON+986/EKD3nerH7+P/gqSuQ3GsmehUilRZrMSoynNNjExsTHwePVmPJ4ArQHAAcgwGi40vnO6o7q+Vhe+0Yee61+zj0T1w/R9jWprdj5di0ZBOIKSYitJTd1U6HTe3+rzLQ7RPAAmc8rVw+fffyWvIJeuXPkEw0M/oD0oT3kCgefGxu57lUp11Y4d+TSRiGN+/hGKC4uJTm/KGx7+nuJdY9K58c4PZTbyHXt8YDcbNCtYgSQ+Aoid4ykAQKPVtpw9ez4yNfUXc88sspE7TvbSAUdMEMQ23HnxeT8b+IolDu5mQ2aRFYv83wCpBwCOpxAl6V9Eo2k+c+a90MDgj6y2bl8UQBsADh2WDK+3xsq+SFOy7ZS4AVK5vvI6wHEEAGDQ6w9ufzr7AUdI23+PoAXK8oFv9YR8BmAbnuhJYB35f/8ALbR0nqyVRHoAAAAldEVYdGNyZWF0ZS1kYXRlADIwMDktMTEtMTVUMTY6MDg6NDEtMDc6MDAkruHgAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDEwLTAyLTIwVDIzOjI2OjE5LTA3OjAwwZs29QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0wMS0xMVQwOToxODowOC0wNzowMNilPeYAAAA1dEVYdExpY2Vuc2UAaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbGljZW5zZXMvTEdQTC8yLjEvO8G0GAAAACV0RVh0bW9kaWZ5LWRhdGUAMjAwOS0xMS0xNVQxNjowODo0MS0wNzowMHsfl9QAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAADXRFWHRTb3VyY2UATnV2b2xhrE818QAAADR0RVh0U291cmNlX1VSTABodHRwOi8vd3d3Lmljb24ta2luZy5jb20vcHJvamVjdHMvbnV2b2xhL3Y9tFIAAAAASUVORK5CYII="]
			, ['_color',0,0,'char color', 0,"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAABjSURBVDjLY/j//z8DJZiBagb8y8/+D8NgsVXF/+EYyP9wNf0/DA9SAygOgwuvN/2HYRA/4EzufxgG8RM2vP4Pw4PUAIrDIKJqw38YBvFvzr77H4bBaso3/ofjwWnAwGcmcjEAc0v+JGPFQvwAAAAASUVORK5CYII="]
			, ['_bold',0,1,'bold', 0,"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAADCSURBVCjPY/jPgB8yUEtBeUL5+ZL/Be+z61PXJ7yPnB8sgGFCcX3m/6z9IFbE/JD/XucxFOTWp/5PBivwr/f77/gfQ0F6ffz/aKACXwG3+27/LeZjKEioj/wffN+n3vW8y3+z/Vh8EVEf/N8LLGEy3+K/2nl5ATQF/vW+/x3BCrQF1P7r/hcvQFPgVg+0GWq0zH/N/wL1aAps6x3+64M9J12g8p//PZcCigKbBJP1uvvV9sv3S/YL7+ft51SgelzghgBKWvx6E5D1XwAAAABJRU5ErkJggg=="]
			, ['_italic',0,1,'italic', 0,"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAABxSURBVCjPY/jPgB8yUFtBdkPqh4T/kR+CD+A0Ie5B5P/ABJwmxBiE//f/gMeKkAlB/90W4FHg88Dzv20ATgVeBq7/bT7g8YXjBJf/RgvwKLB4YPFfKwCnAjMH0/8a/3EGlEmD7gG1A/IHJDfQOC4wIQALYP87Y6unEgAAAABJRU5ErkJggg=="]
			, ['_uline',0,1,'under line', 0,"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAACjSURBVCjPY/jPgB8yEKmgPKH8ffn/0n4IL3F99P+QAjQTyveX/IexIwWCz2NYUbw/7z/CYK/9GApy92cgKXDEVJC+PxFJgQWmgoT9kUgK9DEVROwPRFKghqnAv9/7v2MAhK3iINePocBNwf69xXlDhf8Myg4y58UUsISkmYL+fI39ivul+0UMSA/q/wza/1X+y/0X/y/0n+c/+3/m/6SbgAsCAM8i/W7eee6fAAAAAElFTkSuQmCC"]
			, ['_font_dn',0,0,'font-', 0,"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAAASAAAAEgARslrPgAAAAl2cEFnAAAAEAAAABAAXMatwwAAAkxJREFUOMulU89LVFEYPffd57znODrpOPmj1LEyLS0MYyAiSKwJqoXtlDIiBANblCuXQaH+BUZBlDTUokW0qMUMhSRRUZLPX1SMSZk6mc7YNM95896797Yya+EP8Nue7xwO53wfEUJgMyNtig1AXg2o7/l0lMo47qCS27SExSxBCOBMx61FI56+bqdZUgv6xaoC3BaeGl9Wc4VXKeecw2bAzIJla2YyrP8QTAv6xZoOmCnezsWtiCKRfAhOuQ1pcCTRl4gaV4buHzTWzYDY/Gzxlowjo5Op8NC4/ijXSVV7ySYf7q2QV3VwqGN4R/Xe7PbYohmNfdUfAqgxLQ4IybVuC/52jTrdjh5FJt7xoV/dZtJ8xg2mMibgzJH3VZ0acKwpQCCad5eop6Pz1meW5lFhc5/sIIUEgNtFfdxmyn/7/x5SXeugt6bWPbYtX/FqkaXRxdnUpOCCuvKUnefUJ5Ue7a5Q45NgVHwH0BsI2T1/Mzhw/j1xF6hdpVsVb/j53O03t+ralrHulstj+ws1VF28RJTyaqSGQyXjA+Eb4WMZugQAtS3vnJDQ4K/NaY1MGQv6vBlcJlcE+j17og+KKuvPQJ3oB+lrhvPLY/jKPFQQcVUGgEyXHKyodDX+nDdhpBgRnDfuangxIpgozsxROrP1ZK5aWA6c7Fip71oRKCc+spFnCgXkqcNNF7ZnfXuKdCqKJQC/ExQfJzC9oWdy5hXcGXv90p41MpGgGYjHCCLThAmgd0MOAOBVU2mnHptpo4yUMSqmBXDzRMju+gPzRwiLlMheyQAAACV0RVh0Y3JlYXRlLWRhdGUAMjAwOS0xMS0xNlQyMjoxODoxNy0wNzowMFsA/sEAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTAtMDEtMTFUMDY6NTI6NDgtMDc6MDCtOb3eAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDEwLTAxLTExVDA2OjUyOjQ4LTA3OjAw3GQFYgAAAGJ0RVh0TGljZW5zZQBodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9saWNlbnNlcy9ieS8zLjAvIG9yIGh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL2xpY2Vuc2VzL2J5LzIuNS+LhjxlAAAAJXRFWHRtb2RpZnktZGF0ZQAyMDA2LTAzLTEyVDIxOjUzOjI4LTA3OjAwkP1yNAAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAAbdEVYdFNvdXJjZQBGQU1GQU1GQU0gU2lsayBJY29uc4J6ZPsAAAAzdEVYdFNvdXJjZV9VUkwAaHR0cDovL3d3dy5mYW1mYW1mYW0uY29tL2xhYi9pY29ucy9zaWxrL8LEDQ0AAAAASUVORK5CYII="]
			, ['_font_up',0,0,'font+', 0,"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAAASAAAAEgARslrPgAAAAl2cEFnAAAAEAAAABAAXMatwwAAAk5JREFUOMulU11IU2EYfr5zjjtna3OmzmpZWNMy01wYw6TAGNaFIRF0IVEQCEFTiLrxqhslRxDdlJA3FQ0KuigKvFDMwoiFSZt/VEgSgS1/tqk77uyc831fV/ZzoQ58b5/3eXh43vchnHNsZoRNsQFIawEngl/qRQkNFlFw6gY3qMEJAWyZhJHUEpkOM0NT0ZCPrynATF5QWbKlucwl72GMwaTAzIJhRvVUv/qL02jIx9d1QHX+YTZhTMkCKQRnIjMhjIwtPVqKaVcjj49oG2ZATHbenZdzfHw63R+ZVJ9ttYmKuWKSTw//ktd0cPTa6N6DFY5APKnH4t/VJwAqdYMBXLBveAVfICranJagLBHXZGSxS0/pvUyjCqUctlypqrxxyLKuAAFv3rdLOR2bN77SDItxk5VIFrKdAHDaxRJmUvm//X8fqaZlxFXpdU7sLJRd0amV8eTP9DRnXLTny56a0uH9qjqIjJHE8sricjIVv9XbFe38k8Hhix+Jc5tyc3eR7OofmO0J36+5vIqdu9H52er4hmM+H4rzyzA48cIRHh/qqG115wkA4L0wbIMAv8+b2zL1Q1tQ5/XQKrns5JsCxTrk8ZZXgwoU1TsaQImB2qo6AAgIAGC1S6Eqr7Nvbl6HlqaEM3am1P86z1M/UCEr0p2kOiflEDuaDrQBAK77e+ApOgQACsmmTHVtxemzTacUEwztDQ8Q7LsERZTx9PlLLasyMc5uh0ffwwIJr8a6YSES3kXeAsC9rBwAQG2rOwjgCgAHgGUA3eG7M+2/AYFw/H+FG2bBAAAAJXRFWHRjcmVhdGUtZGF0ZQAyMDA5LTExLTE2VDIyOjE4OjE3LTA3OjAwWwD+wQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxMC0wMS0xMVQwNjo1Mjo1Ny0wNzowMJfbzakAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTAtMDEtMTFUMDY6NTI6NTctMDc6MDDmhnUVAAAAYnRFWHRMaWNlbnNlAGh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL2xpY2Vuc2VzL2J5LzMuMC8gb3IgaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbGljZW5zZXMvYnkvMi41L4uGPGUAAAAldEVYdG1vZGlmeS1kYXRlADIwMDYtMDMtMTJUMjE6NTM6MjYtMDc6MDDAwglpAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABt0RVh0U291cmNlAEZBTUZBTUZBTSBTaWxrIEljb25zgnpk+wAAADN0RVh0U291cmNlX1VSTABodHRwOi8vd3d3LmZhbWZhbWZhbS5jb20vbGFiL2ljb25zL3NpbGsvwsQNDQAAAABJRU5ErkJggg=="]
			//, ['_style',1,0,'font-', 0,"style"]
			, ['_undo',0,1,'undo', 0, "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH1gcaCg4AFiOWIQAAAhdJREFUOMuVk09okmEcx7/P877P1OX+6MYa0ojWwfIQFIRBgxUEQrBDeAiCYkRQXTuMPHgox4wdIrp0qVhBEDTpUCwWwVKMWnaKlLRoDXITXL4654bv6/M8HcKlm5Z9b88Xvp/neX7P9wGaKDoFiRakbjXm7qGXKciiRdHahd/HbExB1u0NtZr/cwK/j9k8TiPn9oaAwtXNa+ikJ8MFzYC2xcPJ7MXxCb1UCyBbw0ZuHCrVAIsXkBVwLgGI8pvZx18ZBXmVKHgCQeNHFaD4fazd4zRW3d4QjJ/XQShFuQyAL0JfT0FbiUHKkjroOtFntii9NuRPD+yrvI5ExTIAKBMXhF4NU6r8pqoMUkoIwSGEgOBrKK+nYLKYyI6uXZ2dYu3Q7v36o0hUGPRlktnnQ16wjpMAAM51LHz7iMXvcaTTX+oGVtTisPe7YG5nB4ad3eHtMxgZw0LiJva4rkDwYl1YFO8ik2Uo6xw9jkv49Ha6dPxs2qoCQCBoaPAxOzCZc4+MAQBiM3fq38tC4DpyGYXMA5jMOgiRal0PAkFDm00y+/yzyc3M0CjI0CgIgIOlvDyVmLv9vm/gHLjoAJHShL/VuFGVw/fheDdN5eryDRF5aJPbmli7cyN/+DyWFGGVG8U4hGrPNwU0g0SnMNjtOCy07BIA3Gr4mf6ho1079858jj2pHDujXftvgGzrt6Y+PH9Bde1p1fsFBRbiJSu+JBQAAAAASUVORK5CYII="]
			, ['_redo',0,1,'redo', 0, "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH1gcaCicVP7jtIQAAAdxJREFUOMudk01rE1EYhZ87X02MpEJMY4MfbTbVdtPSKn5UYw1CqThuRCuCuBpwrTvBv+B+Vt11KUQKhYrFUrpqpKgbwU11ISliTCZNmslkxs0YJ51Bgmf5Xp7Duee+F/qQbmqebmrTUWcS/WtbN7XCfxs8fmAAvNFNbS44FxFxB4A8sAhMAZMBA5aWTYAbRcNeDxnopnYBeD4ntFS2cHVYTY3mEAJVjmHZPyl9W+HK6L0eExGAF4AXj/L58/JQTqrZZbzap550H5s1gK7JuT17VvjwBPDy4bXrN2OZM1iVdSxPI+7aAAw6DTbbzt/ihMSlkbssLZso/uzpnbPjk7F0lvqvdyRaDRI0GG5VeEUCR+rtOj14snsNBWBA1WaPj02n49Z7svtVdqQEmiKoHYkz7kMXFTDrFpljp9lc/dDtQAHouG5GyIJUw2KrVPfWWpXQ60xcPhGCu3vgdJzk0cZXtnd2WWu1LeAZMFU0bFE0bAHwNjkUgoFuB+w3q+5KXUjA/aJhrx5O4MMzRcMuRW6iqsgHgBcF+wrBwQQbzb2yWpC9GKY2f9jkzzWiJAOM3ZbdLwft+q2Z3I/UbvmU0NWtz687dj9/JLiJI8ACUAU2niTd7wK8+UWn8y+D39dLugVezzXeAAAAAElFTkSuQmCC"]
			, ['_ul',0,1,'ul',0,"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAADqSURBVDjLY/j//z8DJZiBKgbkzH9cMHXX6wcgmiwDQJq3nv/4H0SD+OXl5dlA/L+kpOR/QUHB/+zs7P+pqan/ExIS/kdGRv4PDg7+T10XDHwgpsx8VNC56eWDkJ675Hmhbf3zB0uPvP1fuvQpOBDj4uKyIyIi/gcGBv738vL67+zs/N/Gxua/iYnJf11d3f9qamqogRjQcaugZPHjB66V14ZqINrmXyqIn3bvgXXeJfK8ANLcv+3lfxAN4hsZGWVra2v/V1FR+S8nJ/dfXFz8v5CQ0H8eHp7/7Ozs/5mZmVEDEWQzRS6gBAMAYBDQP57x26IAAAAASUVORK5CYII="]
			, ['_ol',0,1,'ol',0,"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAD3SURBVDjLY/j//z8DJRhM5Mx/rLLo8Lv/ZBsA0kyRATBDYOzy8vJsIP5fUlLyv6Cg4H92dvb/1NTU/wkJCf8jIyP/BwcH/8fqgkUHSXcFA1UCce7+t/9n7Xn9P2LiPRWyXRDae0+ld8tL8rwQ1HVHpXPTc7jmuLi47IiIiP+BgYH/vby8/js7O/+3sbH5b2Ji8l9XV/e/mpoaaiC2rX/+v3HN0/81q54OUCCWL3v8v3Tp4//Fix+T7wKQZuu8S+THAkgzzAVGRkbZ2tra/1VUVP7Lycn9FxcX/y8kJPSfh4fnPzs7+39mZmbUQARpBGG7oisddA9EAPd/1bRtLxctAAAAAElFTkSuQmCC"]
			, ['_center_right',0,1,'justify Center,Right,Left', 0,"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAB8SURBVCjPY/zPgB8wMVCqgAVElP//x/AHDH+D4S8w/sWwl5GBgfE/MSYwMORk/54C0w2FOcemgmSIMyH1P7LNCHiLBDcEZ/+agqwXaFbOIxLc4P0f1e7fUPiZGDcw/AdD02z9/5r/Vf7L/Zf8L/Kf/z/3f/ZsiAwjxbEJAKUIVgAswNGVAAAAAElFTkSuQmCC"]
			, ['_link',0,0,'link', 0,"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAADpSURBVCjPY/jPgB8y0EmBHXdWaeu7ef9rHuaY50jU3J33v/VdVqkdN1SBEZtP18T/L/7f/X/wf+O96kM3f9z9f+T/xP8+XUZsYAWGfsUfrr6L2Ob9J/X/pP+V/1P/e/+J2LbiYfEHQz+ICV1N3yen+3PZf977/9z/Q//X/rf/7M81Ob3pu1EXWIFuZvr7aSVBOx1/uf0PBEK3/46/gnZOK0l/r5sJVqCp6Xu99/2qt+v+T/9f+L8CSK77v+pt73vf65qaYAVqzPYGXvdTvmR/z/4ZHhfunP0p+3vKF6/79gZqzPQLSYoUAABKPQ+kpVV/igAAAABJRU5ErkJggg=="]
			, ['_outdent',0,1,'padding-left -1em', 0,"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAADxSURBVDjLY/z//z8DJYCJgUJAsQEsMEZ5efn/f//+Mfz58weOf//+Dce/fv2C0yC8d+9eRpA+RkrDgAWZ07rx3ZVqfyEdEDs2NvY6so3o+MyZM5pwAwL67msqSLCv4WFjgTsHqEgRl2YQhgFG3867mpJirIs0JdlNmBiZGR6++c7QGyXDSKwXwGHgWHldU1KOYy03B8e/2YmSYC94enpegdn28+dPuM0wbz18+FAH7oX97ZrXgZRW9MxnV2Am//jxQwXd2cixgeICqsSCt7f3f3yBhpwmQPjz589UTge2trb/sQUWsq0fPnxgxBoLA5qZANTo8jopO/z6AAAAAElFTkSuQmCC"]
			, ['_indent',0,1,'padding-left +1em', 0,"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAADzSURBVDjLY/z//z8DJYCJgUJAsQEsMEZ5efn/f//+Mfz58weOf//+Dce/fv2C0yC8d+9eRpA+RkrDAO6Czi3vrpT7COnA+LGxsdeRbUTHZ86c0UQx4MfvvwyZi55cvXX7a8jeZvXrQEWKuDSDMAyAvdCy+cV/EW42hk/ffzOcvvP1zMNbX+JOTdW7TowX4GGQs/jFlVfvvzPdvfop+OxM/euenp5XYLb9/PkTbjPMWw8fPtRB8cK3n/8YVuUpasG99OOHCrqzkWMDwwUUx4K3t/d/fIGGnCZA+PPnz1ROB7a2tv+xBRayrR8+fGDEGQsDlpkACSYJhTJIjokAAAAASUVORK5CYII="]
			, ['_switch',0,1,'switch indicator(tag display)', 0, "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAD7SURBVDjLY/z//z8DJYCJgULAgi6gUvvEWEOVY6aqJJsxw79/DAxIDrxw+9ee/blirnhdYKjHtcpKmd1YiZ+JQZKbmeHivV97+j0EGEGaGf4T4QIZPiYlXhZGsM2g4Pn/FyL+/x+I/Ec4DEA2vv32jwEetjAa6B2YYXgNeHD/Z9iOM19XP3j3h+Hbz/9ATRBbwbH19z9hL9zrkn0PpMIUCh4Jaqpz7IZF8/8/DAwMWKIcZzQ+mCD3/tu3v+8Z/sC88h8aDgRcgAzAfoa54C9WB+A3AORnmCYw/ZdEA/4hO/kvAwMDyS74j4j6//+w6ifkBYQmXAmJccBzIwCU7Hm5Y0odkQAAAABJRU5ErkJggg=="]
			, ['_clear',0,1,'remove Format/js-beautifier', 1,"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAKXSURBVDiNlZJLaJRnFIaf75uZ6EwSm9tIQpNIvNWoFCsmiwrSgotKS3aCl4WL0Y2CIvwLBV0YFwYckFIQhI7GhWBLdaEL6Y0WMS20aTQxijGNmnFGSZPJZcw/80/+//uOK0VjIfisz/twzstRR75gczjEBRGixrL31A35kfdAhzTfr22OrdqworwxpLl6dJva+l4CYHFFVLO0KsLHLbFYSHP29H6lU0nVmUqq2gUFVugcfFJ0fSPU15QRXazqqxrpBY4DSxcUiPCN65mLtwbz7kzJp6mdypWtGzfE400vgLqFBEpEAOjap07EV3L8k7bPVXNLOz2nu73pf8Zy7FSTxsglEc4nHBn/X0EqqXZprb79dHNHtK6ugX+//punVx+y/ux2atdVkR7t9+7f/UOM9b4zRo4lHMnOF+zRmmRTfWs5lyRqJl22dG9lUY0GFYVQNX5Qzr3BX/2B/t8N4v9gDCng5usTUkm1KHKOOxXNtas6Lh8Oaf0cQg1gxsBksUEez7bgzdWQyQzI45EBd2oyW9SvVkk4UvJ301V7sLGkI2VgZyEYAZMF8x9e4RmzuevMjJ0jXo3a1P5VhVZKwm81UsHP2UxaW6tQ/ggiPv6ch1eapViYoVCYRkTQ4UrST3oDlPym38wnHHnmz02PpNN3mXFjTEyMksulmcxlcN0pRIRY9TYKRc3Qg/6SMThvCQACI4f6en8p+qzGdT2KxTzWBuhwDZXxHeTdmNy6eSVvTPBlwpHM6xLfpPuM6ln9UXvb8hWtES//J2WxNejIMh4N9wRDQ33j1vJZwpGHAOF30oAxdAw9+Ot25ZKGDz+oatOjo/f84eGfAmu869ZyIOHIxDufOJ9UUi1Tij6lEOCatZxMOPJ4/txLfgdDCCiEEtoAAAAASUVORK5CYII="]
			, ['_html',0,1,'html', 1, "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAHUSURBVDjLxZM7a1RhEIafc3J2z6qJkIuCKChItBNSBQ0iIlZiK4gWItj6HwRbC7FRf4CVnSCIkH9gJVjYiCDximCyZ7/zfXOz2A0I2qVwmmFg3rm870wVEezFavZoey7Q3Hv+/Z87qDsiTlZFBJIGKStZlFSCTpyUlAZgfXXfH9BAPTCberVANBB3RAJRR8wp6jzd/DotALA9UcyZgZxis2QNijpZjSJBVqeIszTfkMY65cAjuHxmgSzGlbUFrp1d5ObGErcuLLNxep5hU3H93AqjYcXti4cZZ2OSDU9CnVURddqmIovTDmoev/5GVcGDF585tjzg1JGWo0tDDgxrThxq6XojieOd0nRZ6dVpBxU3zi/T1BVdViKCcTbcYX11ngB6cca9MSlGlprojHqcglycVJyHL79Q1Jn0TgBdb1gEbz9OeL81IYsRAakYvQSeC/WvVOiLE8GsM4xnvsuGe/Do1RY/dpRenIP753hyZxURJ3JQXbr/Lq6uLfLpZ6aIk9XJssv8VK5dNcQcmcl7fKVl89kHmu0dJRVjYTRHGVSMpELaQLVCtEY8EAvMHHUwn067+0LVybtvok9KSODZiaKEOJENihPm01gD3P+62Oq/f+Nv2d9y2D8jLUEAAAAASUVORK5CYII="]
			, ['_table',0,0,'table add /edit', 0,"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJ6SURBVDjLpZNZSNRRGMV//2XGsjFrMg2z0so2K21xIFpepYUiAsGIICLffI8eWiBBeg3qQV+KwBYKLB8qpHUmrahcKLc0QsxldNSxdPz/79LD1ChBUXTh8sG93POdc75zDa01/7NsgGvPR09rzQmpVZZSCqlAKIWUCqk0QqoZWyKFRir1uvxIbsAGUFqXHQqkpP1L57M3Pm5MMJBKpQHUdF9BKIGQAlcJXOlOVykSdye3leO6MmkGQNyHw+uO/1X3bzGBK+S0B1IqAKqDg3986HeCZPffwvJtoNT7lOZLvUdtAPEDAKBkRzo3QwMUb89InN1uGGD3spdE214xe8MRUnM2MfppNW0Pqy7YAK5UKK2xLbhdP4hlmdxpGMQwwQT8ziNiI534c7cT6WrFazikzF2Eb8HS1IQEDdiWwcHAQmpehTkQSAcgNvSMiYFW5uUUMdV3HW+ywefGNqITJsbUUL75k4FWYJtQ+yaMZcXrk1ANk/33mbdiD7EvlRieETy+FJLkMFcjRRSW3emIAwiF1hqPBfu2LGSWbbA1uZ41SfWkrtxPrPcypsfFiWYzFGzGKTjFV28WEJeIUHETLdOgrmkI1VdHpCdEet5enP4qLK9mKrqMgedv6cyrAP+qxOTiUxAi7oEJi8frELoFoTLpa7nI/HQvscgSRt+0kV1SSW7qYtp7xrBMphm4Mi5h/VIfTcEq1u0oJaknSEdNiMYHET7UvcMpPEN31Ed7zxgASmk1I0g6dK66s8CRak5mVxjnfS05+TsZCw/T9baTx1nnGb47DrQksjE6HrsHYPz6nYt3+Sc3L8+wA2tz0J6pF5OD4WP7Kpq7f5fO79DfSxjdtCtDAAAAAElFTkSuQmCC"]
		];
		if (ot.tryitEditor.opt.toolbar) {
			ar = ot.tryitEditor.opt.toolbar;
		}

		var t = '';
		for (var i in ar) {
			var a = parseInt(ar[i][1]);
			if (ot.tryitEditor.ie8 && !ar[i][2]) {
				continue;
			}
			if (a == 1) {
				t += "<input type='button' onchange='ot.tryitEditor."+ar[i][0]+"(this);' onclick='ot.tryitEditor."+ar[i][0]+"(this);' ";
				t += " class=' button ";
				if (!ar[i][4]) {
					t += " code ";
				}
				t += " ' value='";
				if (ar[i][5]) {
					t += ar[i][5];
				}
				t += "' />";
			} else {
				t += "<button type='button' onclick='ot.tryitEditor."+ar[i][0]+"();' ";
				t += " class=' button ";
				if (!ar[i][4]) {
					t += " code ";
				}
				t += " ' ";
				t += " style='";
				if (ar[i][5]) {
					t += " filter:none; background: url("+ar[i][5]+") no-repeat 3px 3px; ";
				} else {
					t += " filter:none; background-color: #c0c0c0; ";
				}
				t += " width:24px; height:24px;";
				t += " ' ";
				t += " title='"+ar[i][3]+"' ";
				t += " >";
				if (isNaN(parseInt(ar[i][1]))) {
					t += ar[i][1];
				}
				t += " </button>";
			}
		}

		var css = "border: 1px solid #c0c0c0;";
		css += "-moz-box-shadow: 0 1px 0 #fff inset;";
		css += "-webkit-box-shadow: 0 1px 0 #FFF inset;";
		css += "box-shadow: 0 1px 0 #FFF inset;";
		css += "background: #CFD1CF;";
		css += "background-image: -webkit-gradient(linear,left top,left bottom,from(#F5F5F5),to(#CFD1CF));";
		css += "background-image: -moz-linear-gradient(top,#f5f5f5,#cfd1cf);";
		css += "background-image: -webkit-linear-gradient(top,#F5F5F5,#CFD1CF);";
		css += "background-image: -o-linear-gradient(top,#f5f5f5,#cfd1cf);";
		css += "background-image: -ms-linear-gradient(top,#f5f5f5,#cfd1cf);";
		css += "background-image: linear-gradient(top,#f5f5f5,#cfd1cf);";
		if (ot.tryitEditor.navigator == 'ie') {
			css += "-ms-filter: progid:DXImageTransform.Microsoft.gradient(gradientType=0,startColorstr='#F5F5F5',endColorstr='#CFD1CF');";
		}

		o.before("<div id='_tryitEditor_toolbar_outer'><div id='_tryitEditor_toolbar' style='position: relative;padding: 5px 10px 2px 10px;z-index: 159999;"+css+"' >"+ot.tryitEditor.opt.before_toolbar+t+ot.tryitEditor.opt.after_toolbar+"</div></div>");
		ot.jq('#_tryitEditor_toolbar button').css({padding:'2px 1px 2px 1px', display:'inline-block', 'font-size':'14px','line-height':'1em', cursor:'pointer'});
		ot.jq('#_tryitEditor_toolbar select').css({'font-size':'14px',padding:'2px',width:'60px',height:'25px'});
		ot.jq('#_tryitEditor_toolbar select, #_tryitEditor_toolbar .button').css({cursor: 'pointer', margin:'2px 3px 4px 0', 'box-shadow': '#FFECEC 1px 1px 1px', border: '1px solid #ADADAD','background-color':'#fff','-webkit-border-radius':'3px', '-moz-border-radius':'3px', 'border-radius':'3px', 'vertical-align':'middle'});

		var h = ot.tryitEditor.opt.html || ot.tryitEditor.__get_init();
		if (opt.empty_str && h == opt.empty_str) {
			h = '<p><br></p>';
		}
		if (!h) {
			h = '<p><br></p>';
		}
		o.after("<div id='_tryitEditor_contents' contenteditable='true' >"+h+"</div>");
		o.after("<textarea id='_tryitEditor_html' style='display:none;padding:5px;min-height:500px;'></textarea>");
		o = ot.jq('#_tryitEditor_contents');
		o.width(ot.tryitEditor.opt.width)
		.css({'overflow-x':'auto', 'border-color':'#c0c0c0', 'border-style':'solid', 'border-width':'1px', 'padding':'5px', 'min-height':'20px'})
		;
		if (ot.tryitEditor.opt.body_css) {
			ot.jq('#_tryitEditor_contents').addClass(ot.tryitEditor.opt.body_css);
		}
		ot.jq('#_tryitEditor_toolbar').width(ot.tryitEditor.opt.width-10);
		if (ot.tryitEditor.opt.height) {
			ot.jq('#_tryitEditor_contents').height(ot.tryitEditor.opt.height);
		} else {
			ot.jq('#_tryitEditor_toolbar_outer').height(ot.jq('#_tryitEditor_toolbar').height()+10);
			if (ot.tryitEditor.navigator == 'firefox') {
				ot.jq(document).scroll(ot.tryitEditor.__scroll);
			} else {
				ot.jq(window).scroll(ot.tryitEditor.__scroll);
			}
		}
	};

	ot.tryitEditor.quit = function() {
		if (typeof(ot.tryitEditor.opt.onquit) == "function") {
			ot.tryitEditor.opt.onquit();
		}
		ot.jq('#_tryitEditor_toolbar_outer, #_tryitEditor_contents, #_tryitEditor_html').remove();
		ot.jq(ot.tryitEditor.sel).show();
	};
	
	ot.tryitEditor.close = function() {
		ot.jq('#_tryitEditor_toolbar_outer, #_tryitEditor_contents, #_tryitEditor_html').remove();
		ot.jq(ot.tryitEditor.sel).html(ot.tryitEditor.html()).show();
	};
	
	ot.tryitEditor.check_instance = function() {
		return ot.jq('#_tryitEditor_toolbar_outer, #_tryitEditor_contents, #_tryitEditor_html').length;
	};
	
	ot.tryitEditor.__get_init = function () {
		var o = ot.jq(ot.tryitEditor.sel);
		if (o[0] && o[0].tagName=='TEXTAREA') {
			return o.val();
		}
		return o.html();
	};

	ot.tryitEditor.__scroll = function () {
		var b = ot.jq('#_tryitEditor_toolbar');
		if (!b.length) {ot.jq(window).unbind('scroll', ot.tryitEditor.__scroll);return;}
		var a = ot.jq('#_tryitEditor_toolbar_outer');
		if (ot.tryitEditor.navigator == 'mobile' && document.activeElement.id == '_tryitEditor_contents') {
			return;
		}
		if (b.css('position') != 'fixed') {
			if (a.offset().top < ot.jq(window).scrollTop()) {
				b.css({'position':'fixed','top':'2px'});
			}
		} else {
			var h = ot.jq('#_tryitEditor_toolbar').height();
			if (a.offset().top > ot.jq(window).scrollTop()) {
				b.css({'position':'relative'});
			}
		}
	};

	ot.tryitEditor.save_cursor = function () {
		ot.tryitEditor.edit_rng = ot.tryitEditor.edit_obj = ot.tryitEditor.edit_objs = null;
		ot.tryitEditor.edit_sel = document.getSelection();
		if (ot.tryitEditor.edit_sel && ot.tryitEditor.edit_sel.type == 'None') { return; }
		ot.tryitEditor.edit_rng = ot.tryitEditor.edit_sel.getRangeAt(0);
		return ot.tryitEditor.edit_rng;
	};

	ot.tryitEditor.recov_cursor = function () {
		var r = ot.tryitEditor.edit_rng;
		if (r && ot.tryitEditor.edit_sel) {
			ot.tryitEditor.edit_sel.removeAllRanges();
			ot.tryitEditor.edit_sel.addRange(r);
		}
	};

	ot.tryitEditor.__span_range = function () {
		if (!ot.tryitEditor.edit_objs.length) { return; }
		var step1 = function (r,oj) {
			if (ot.tryitEditor.edit_objs.length == 1) {
				var oj = ot.tryitEditor.edit_objs[0];
				if (oj.nodeName=='#text') { 
					ot.tryitEditor.edit_objs[0] = oj.parentNode;
				}
			} else {
				for (var i=0; i < ot.tryitEditor.edit_objs.length; ++i) {
					var oj = ot.tryitEditor.edit_objs[i];
					if (oj.nodeName=='#text') {
						if (oj.nodeValue == oj.parentNode.innerText) { 
							ot.tryitEditor.edit_objs[i] = oj.parentNode;
						}
					}
				}
			}
		};
		var step2 = function (r,oj) {
			var r = ot.tryitEditor.edit_rng;
			if (!ot.tryitEditor.edit_objs.length || r.startContainer.id=='_tryitEditor_contents') { return; }
			if (r.startContainer == r.endContainer) {
				if (!r.startOffset || r.startOffset == r.endOffset) { return; }
				var h = r.startContainer.textContent.substr(r.startOffset,r.endOffset-r.startOffset);
				r.deleteContents();
				var n = document.createElement("span");
				ot.jq(n).text(h);
				r.insertNode(n);
				ot.tryitEditor.edit_objs[0] = n;
				return;
			}
			if (r.startOffset) {
				var h = r.startContainer.textContent.substr(r.startOffset);
				var oj = r.startContainer;
				var of = r.startOffset;
				var ln = r.startContainer.textContent.length;
				var rx = document.createRange();
				rx.setStart(oj,of);
				rx.setEnd(oj,ln);
				ot.tryitEditor.edit_sel.addRange(rx);
				rx.deleteContents();
				var n = document.createElement("span");
				ot.jq(n).text(h);
				rx.insertNode(n);
				ot.tryitEditor.edit_objs[0] = n;
			} else {
				var oj = ot.tryitEditor.edit_objs[0];
				if (oj.nodeName=='#text') { 
					ot.tryitEditor.edit_objs[0] = oj.parentNode;
				}
			}
			if (r.endContainer.nodeName == '#text' && r.endContainer.textContent.length > r.endOffset) {
				var h = r.endContainer.textContent;
				h = h.substr(0,r.endOffset);
				var oj = r.endContainer;
				var of = r.endOffset;
				var rx = document.createRange();
				rx.setStart(oj,0);
				rx.setEnd(oj,of);
				ot.tryitEditor.edit_sel.addRange(rx);
				rx.deleteContents();
				var n = document.createElement("span");
				n.innerHTML = h;
				rx.insertNode(n);
				ot.tryitEditor.edit_objs[ot.tryitEditor.edit_objs.length-1] = n;
			} else {
				var oj = ot.tryitEditor.edit_objs[ot.tryitEditor.edit_objs.length-1];
				if (oj.nodeName=='#text') { 
					if (ot.tryitEditor.edit_objs[0] == oj.parentNode) {
						ot.tryitEditor.edit_objs.pop();
					} else {
						ot.tryitEditor.edit_objs[ot.tryitEditor.edit_objs.length-1] = oj.parentNode;
					}
				}
			}
		};
		step1();
		step2();
		var n = [];
		for (var j=0; j < ot.tryitEditor.edit_objs.length; ++j) {
			var oj = ot.tryitEditor.edit_objs[j];
			for (var i=0; i < n.length; ++i) {
				if (n[i] == oj) { oj=false; break; }
			}
			if (oj && oj.nodeName!='#text') { n.push(oj); }
		}
		ot.tryitEditor.edit_objs = n;

		if (ot.tryitEditor.edit_objs.length) {
			ot.tryitEditor.edit_sel.removeAllRanges();
			var r = ot.tryitEditor.edit_rng;
			r.setStart(ot.tryitEditor.edit_objs[0],0);
			r.setEnd(ot.tryitEditor.edit_objs[ot.tryitEditor.edit_objs.length-1],ot.tryitEditor.edit_objs[ot.tryitEditor.edit_objs.length-1].length);
			ot.tryitEditor.edit_sel.addRange(r);
		}
	};
	ot.tryitEditor.__get_cursor_objs = function (span_part) {
		var r = ot.tryitEditor.save_cursor();
		if (!r) {
			return false;
		}
		var r = ot.tryitEditor.edit_rng;
		var s = ot.tryitEditor.edit_sel;
		var i = 0;
		var x;
		ot.tryitEditor.edit_objs = [];
		var check_end = function (r,oj) {
			var x;
			if (oj == r.endContainer ) {
				return oj;
			}
			if (!oj.childNodes || oj.childNodes.length == 0) {
				if (oj.nextElementSibling) {
					return check_end(r,oj.nextElementSibling);
				}
				return false;
			}
			for (var i=0; i < oj.childNodes.length; ++i) {
				if (x = check_end(r,oj.childNodes[i])) {
					return x;
				}
			}
			return false;
		};
		var store_obj = function (oj) {
			if (!oj) { return; }
			if (oj.nodeName == '#text') {
				var r = ot.tryitEditor.edit_rng;
				if (oj.nodeValue == '') { return; }
				if (r.startContainer == r.endContainer) {
					if (r.startOffset != r.endOffset && r.endOffset!=1) {
						var h = r.startContainer.textContent.substr(r.startOffset,r.endOffset-r.startOffset)
						r.deleteContents();
						ot.tryitEditor.edit_sel.removeAllRanges();
						var n = document.createElement("span");
						ot.jq(n).text(h);
						r.insertNode(n);
						ot.tryitEditor.edit_objs.push(n);
						r.selectNode(n.childNodes[0]);
						ot.tryitEditor.edit_sel.addRange(r);
						return;
					}
				}
			}
			for (var i=0; i < ot.tryitEditor.edit_objs.length; ++i) {
				if (ot.tryitEditor.edit_objs[i] == oj) { return; }
			}
			if (oj.nodeName == '#text' && oj.parentNode.id != '_tryitEditor_contents') {
				oj = oj.parentNode;
			}
			ot.tryitEditor.edit_objs.push(oj);
		};
		if (r.startContainer == r.endContainer) {
			//singe line select
			if (r.startContainer.nodeName == '#text') {
				x = r.startContainer;
				store_obj(x);
			} else {
				if (r.commonAncestorContainer.childNodes && r.commonAncestorContainer.childNodes.length) {
					if (r.commonAncestorContainer.childNodes.length == 1) {
						x = r.commonAncestorContainer.childNodes[0];
						if (x.tagName=='BR') {
							x = x.parentNode;
						}
						store_obj(x);
					} else {
						for (var i=r.startOffset; i<r.endOffset; ++i) {
							x = r.commonAncestorContainer.childNodes[i];
							store_obj(x);
						}
					}
				} else {
					x = r.startContainer;
					store_obj(x);
				}
			}
			if (ot.tryitEditor.edit_objs.length > 0) {
				ot.tryitEditor.__span_range();
				return true;
			}
			return false;
		}
		//mult line select
		var m = false;
		var toj = r.startContainer;
		if (toj.nodeName=='#text') {
			toj = toj.parentNode;
		}
		for (i=0; i < r.commonAncestorContainer.childNodes.length; ++i) {
			var oj = r.commonAncestorContainer.childNodes[i];
			var x;
			if (m == true) {
				store_obj(oj);
				if (x = check_end(r,oj)) {
					store_obj(x);
					return true;
				}
			} else {
				if (oj == toj || oj == toj.parentNode) {
					m = true;
					store_obj(oj);
				}
			}
		}
		return false;
	};
	
	ot.tryitEditor.__open_form = function (h,btn) {
		if (!btn) { btn = ''; }
		ot.jq('#_tryitEditor_toolbar button, #_tryitEditor_toolbar input').attr('disabled','disabled').css('background-color','rgba(54, 52, 52, 0.66)');
		var a = "<div id='_tryitEditor_form' style='z-index:10000;position:absolute;left:0;top:0px;box-shadow: 3px 3px 10px black;background-color: rgba(0, 0, 0, 0.75); padding: 10px;max-width: 100%; '><div style='padding:10px;position: relative;'>"+h+"</div><div class='try_panel' style='padding:10px'>"+btn;
		a += "<div style='position: absolute;right: 15px;bottom: 5px;'><input type='button' class='ok' value='Ok' /> <input type='button' class='_close' value='Close' /></div></div></div>";
		ot.jq('#_tryitEditor_toolbar').append(a);
		ot.jq("#_tryitEditor_form input[type=button]").css({'border-radius':'1em','border':'none','background-color':'#fff','padding':'2px 10px','margin':'3px 5px'});
		ot.jq("#_tryitEditor_form p").css({'margin':'5px'});
		ot.jq('#_tryitEditor_form ._close').click(function(){
			ot.tryitEditor.__close_form();
		});
		var x = ot.jq('#_tryitEditor_form').height() - ot.jq('#_tryitEditor_toolbar_outer').height();
		if (x > ot.jq('#_tryitEditor_contents').height()) {
			ot.jq('#_tryitEditor_contents').height(x+30);
		}
	};

	ot.tryitEditor.__close_form = function (h,btn) {
		ot.jq('#_tryitEditor_form').remove();
		ot.jq('#_tryitEditor_toolbar button, #_tryitEditor_toolbar input').removeAttr('disabled').css('background-color','#fff');
	};

	ot.tryitEditor.__insertHTML = function (html) {
		if (!ot.tryitEditor.__get_cursor_objs(false)) {
			var h = ot.tryitEditor.html() + html;
			if (h) {
				var o = ot.jq('#_tryitEditor_contents');
				if (o) {
					if (ot.tryitEditor.navigator != 'firefox') {
						o.html(h);
					} else {
						document.execCommand('selectAll',false);
						document.execCommand('insertHTML',false,h);
					}
				}
				return;
			}
		}
		if (document.selection) {
			var r = document.selection.createRange();
			if (r.pasteHTML) {
				if (ot.tryitEditor.ie9over) { document.execCommand("ms-beginUndoUnit"); }
				r.pasteHTML(html);
				if (ot.tryitEditor.ie9over) { document.execCommand("ms-endUndoUnit"); }
			}
		} else {
			if (ot.tryitEditor.ie9over) {
				document.execCommand("ms-beginUndoUnit");
				var r = document.getSelection().getRangeAt(0);
				r.deleteContents();
				r.insertNode(r.createContextualFragment(html));
				document.execCommand("ms-endUndoUnit");
			} else {
				document.execCommand('insertHTML',false,html);
			}
		}
	};

	ot.tryitEditor._undo = function ()	{ if (!document.execCommand('undo',false)) { ot.jq('#_tryitEditor_contents').html(ot.tryitEditor.__get_init()); } };
	ot.tryitEditor._redo = function ()	{ document.execCommand('redo',false); };
	ot.tryitEditor._ol = function ()	{ 
		//document.execCommand('insertOrderedList',false); for chrome, ie bug
		if (!ot.tryitEditor.__get_cursor_objs(true)) { return; }
		if (ot.tryitEditor.ie9over) {document.execCommand("ms-beginUndoUnit");}
		if (ot.tryitEditor.edit_objs.length) {
			ot.tryitEditor.edit_sel.removeAllRanges();
			var h = '';
			for (var i=0; i<ot.tryitEditor.edit_objs.length;++i) {
				h += "<li>"+ot.tryitEditor.edit_objs[i].innerText+"</li>";
			}
			for (var i=0; i<ot.tryitEditor.edit_objs.length;++i) {
				ot.tryitEditor.edit_objs[i].parentNode.removeChild(ot.tryitEditor.edit_objs[i]);
			}
			var r = ot.tryitEditor.edit_rng;
			var n = document.createElement("ol");
			n.innerHTML = h;
			r.insertNode(n);
		}
		if (ot.tryitEditor.ie9over) {document.execCommand("ms-endUndoUnit");}
	};
	
	ot.tryitEditor._ul = function ()	{
		// document.execCommand('insertUnorderedList',false); for chrome, ie bug
		if (!ot.tryitEditor.__get_cursor_objs(true)) { return; }
		if (ot.tryitEditor.ie9over) {document.execCommand("ms-beginUndoUnit");}
		if (ot.tryitEditor.edit_objs.length) {
			ot.tryitEditor.edit_sel.removeAllRanges();
			var h = '';
			for (var i=0; i<ot.tryitEditor.edit_objs.length;++i) {
				h += "<li>"+ot.tryitEditor.edit_objs[i].innerText+"</li>";
			}
			for (var i=0; i<ot.tryitEditor.edit_objs.length;++i) {
				ot.tryitEditor.edit_objs[i].parentNode.removeChild(ot.tryitEditor.edit_objs[i]);
			}
			var r = ot.tryitEditor.edit_rng;
			var n = document.createElement("ul");
			n.innerHTML = h;
			r.insertNode(n);
		}
		if (ot.tryitEditor.ie9over) {document.execCommand("ms-endUndoUnit");}
	};

	ot.tryitEditor._center_right = function (){
		if (!ot.tryitEditor.__get_cursor_objs(true)) { return; }
		if (ot.tryitEditor.ie9over) {
			document.execCommand("ms-beginUndoUnit");
		}
		if (ot.tryitEditor.edit_objs.length) {
			var x = ot.tryitEditor.edit_objs[0].style.textAlign;
			if (!x) {
				x = 'center';
			} else if (x == 'center') {
				x = 'right';
			} else {
				x = '';
			}
			for (var i=0; i<ot.tryitEditor.edit_objs.length; ++i) {
				var o = ot.tryitEditor.edit_objs[i];
				if (o.style) { o.style.textAlign = x; }
			}
		}
		if (ot.tryitEditor.ie9over) {
			document.execCommand("ms-endUndoUnit");
		}
	};
	
	ot.tryitEditor._bold = function ()	{
		if (!ot.tryitEditor.__get_cursor_objs(true)) { return; }
		if (ot.tryitEditor.ie9over) {
			document.execCommand("ms-beginUndoUnit");
		}
		if (ot.tryitEditor.edit_objs.length) {
			var x = (ot.tryitEditor.edit_objs[0].style.fontWeight == 'bold') ? '' : 'bold' ;
			for (var i=0; i<ot.tryitEditor.edit_objs.length; ++i) {
				var o = ot.tryitEditor.edit_objs[i];
				if (o.style) { o.style.fontWeight = x; }
			}
		}
		if (ot.tryitEditor.ie9over) {
			document.execCommand("ms-endUndoUnit");
		}
	};
	ot.tryitEditor._italic = function (){ 
		if (!ot.tryitEditor.__get_cursor_objs(true)) { return; }
		if (ot.tryitEditor.ie9over) {
			document.execCommand("ms-beginUndoUnit");
		}
		if (ot.tryitEditor.edit_objs.length) {
			var x = (ot.tryitEditor.edit_objs[0].style.fontStyle == 'italic') ? '' : 'italic' ;
			for (var i=0; i<ot.tryitEditor.edit_objs.length; ++i) {
				var o = ot.tryitEditor.edit_objs[i];
				if (o.style) { o.style.fontStyle = x; }
			}
		}
		if (ot.tryitEditor.ie9over) {
			document.execCommand("ms-endUndoUnit");
		}
	};
	ot.tryitEditor._uline = function ()	{ 
		if (!ot.tryitEditor.__get_cursor_objs(true)) { return; }
		if (ot.tryitEditor.ie9over) {
			document.execCommand("ms-beginUndoUnit");
		}
		if (ot.tryitEditor.edit_objs.length) {
			var x = (ot.tryitEditor.edit_objs[0].style.textDecoration == 'underline') ? '' : 'underline' ;
			for (var i=0; i<ot.tryitEditor.edit_objs.length; ++i) {
				var o = ot.tryitEditor.edit_objs[i];
				if (o.style) { o.style.textDecoration = x; }
			}
		}
		if (ot.tryitEditor.ie9over) {
			document.execCommand("ms-endUndoUnit");
		}
	};
	ot.tryitEditor._indent = function () {
		if (!ot.tryitEditor.__get_cursor_objs(true)) { return; }
		var node_ar = ot.tryitEditor.edit_objs;
		for (i = 0; i < node_ar.length; ++i) {
			var a = 0;
			var n = node_ar[i];
			if (n.style.paddingLeft) {
				a = parseInt(n.style.paddingLeft);
			}
			if (ot.tryitEditor.ie9over) { document.execCommand("ms-beginUndoUnit"); }
			n.style.paddingLeft = (a+1)+'em';
			if (ot.tryitEditor.ie9over) { document.execCommand("ms-endUndoUnit"); }
		}
	};
	ot.tryitEditor._outdent = function () {
		if (!ot.tryitEditor.__get_cursor_objs(true)) { return; }
		var node_ar = ot.tryitEditor.edit_objs;
		for (i = 0; i < node_ar.length; ++i) {
			var a = 0;
			var n = node_ar[i];
			if (n.style.paddingLeft) {
				a = parseInt(n.style.paddingLeft);
				a = a - 1;
				if (a < 0) { a = 0; }
			}
			if (ot.tryitEditor.ie9over) { document.execCommand("ms-beginUndoUnit"); }
			n.style.paddingLeft = a+'em';
			if (ot.tryitEditor.ie9over) { document.execCommand("ms-endUndoUnit"); }
		}
	};
	
	ot.tryitEditor._link = function () {
	
		if (!ot.tryitEditor.__get_cursor_objs(false)) { return; }
		var a = ot.tryitEditor.edit_obj = ot.tryitEditor.edit_objs[0];
		var h = '';
		if (a) {
			if (a.tagName != 'A' && a.parentNode.tagName == 'A') {
				ot.tryitEditor.edit_obj = a = a.parentNode;
			}
			if (ot.tryitEditor.navigator == 'ie') {
				h = a.nameProp;
			} else {
				h = a.href;
			}
		}
		var btn = '';
		if (h) {
			btn = "<input type='button' class='remove' value='Remove' />";
		}
		ot.tryitEditor.__open_form("<input type='text' style='width:300px' />", btn);
		if (h) {
			h = unescape(h);	// for onethird tag
			ot.jq('#_tryitEditor_form input[type=text]').val(h);
		}
		
		ot.jq('#_tryitEditor_form .ok').click(function(){
			var a = ot.jq('#_tryitEditor_form input[type=text]').val();
			ot.tryitEditor.__close_form();

			if (ot.tryitEditor.edit_obj.tagName=='A') {
				var h = a;
				h = h.replace(/\"/g,"'");	// 'for onethird
				ot.tryitEditor.edit_obj.href = h;
			} else {
				ot.tryitEditor.edit_obj.outerHTML = "<a href='"+a+"'>"+ot.tryitEditor.edit_obj.textContent+"</a>";
			}
		});
		ot.jq('#_tryitEditor_form .remove').click(function(){
			ot.tryitEditor.__close_form();

			var r = ot.tryitEditor.edit_rng;
			r.selectNode(ot.tryitEditor.edit_obj);
			ot.tryitEditor.edit_sel.removeAllRanges();
			ot.tryitEditor.edit_sel.addRange(r);
			
			document.execCommand('unlink',false);

		});
	};

	ot.tryitEditor._color = function() {
		if (!ot.tryitEditor.__get_cursor_objs(true)) { return; }
		var colours = [
			 "#ff8080"
			,"#ffff80"
			,"#80ff80"
			,"#00ff80"
			,"#80ffff"
			,"#0080ff"
			,"#ff80c0"
			,"#ff80ff"
			
			,"#ff0000"
			,"#ffff00"
			,"#80ff00"
			,"#00ff40"
			,"#00ffff"
			,"#0080c0"
			,"#8080c0"
			,"#ff00ff"

			,"#804040"
			,"#ff8040"
			,"#00ff00"
			,"#008080"
			,"#7292b2"
			,"#8080ff"
			,"#800040"
			,"#ff0080"

			,"#800000"
			,"#ff8000"
			,"#008000"
			,"#008040"
			,"#0000ff"
			,"#0000a0"
			,"#800080"
			,"#8000ff"

			,"#400000"
			,"#804000"
			,"#004000"
			,"#004040"
			,"#7272b2"
			,"#000040"
			,"#400040"
			,"#9272b2"

			,"#f0f0f0"
			,"#808000"
			,"#808040"
			,"#808080"
			,"#408080"
			,"#c0c0c0"
			,"#400040"
			,"#ffffff"

		];
		
		var h = "";
		for (var i=0; i < colours.length; ++i) {
			h += "<span data-x='"+colours[i]+"' style='background-color:"+colours[i]+";width:20px;height:20px;margin:2px;display:inline-block' title='"+colours[i]+"' > </span>";
		}
		ot.tryitEditor.__open_form("<div style='width:200px'>"+h+"</div>");
		ot.jq('#_tryitEditor_form .ok').hide();
		ot.jq('#_tryitEditor_form span').click(function(){

			if (ot.tryitEditor.ie9over) {
				document.execCommand("ms-beginUndoUnit");
			}
			if (ot.tryitEditor.edit_objs.length) {
				for (var i=0; i<ot.tryitEditor.edit_objs.length; ++i) {
					var o = ot.tryitEditor.edit_objs[i];
					if (o.style) { o.style.color = ot.jq(this).attr('data-x'); }
				}
			}
			if (ot.tryitEditor.ie9over) {
				document.execCommand("ms-endUndoUnit");
			}
			ot.tryitEditor.__close_form();
		});
	};
	
	ot.tryitEditor._style = function (obj) {
		if (!ot.tryitEditor.__get_cursor_objs(true)) { return; }
		var h = "<select><option value=''>-size-</option><option>10px</option><option>12px</option><option>16px</option><option>23px</option><option>25px</option><option>30px</option></select>";
		h += " <input type='button' class='_close' value='Close' />";
		ot.tryitEditor.__open_form("<div>"+h+"</div>");
		ot.jq('#_tryitEditor_form .try_panel').hide();
		ot.jq('#_tryitEditor_form select').change(function(){

			var a = ot.jq(this);
			if (!a.length) { return; }
			var v = a.val();
			if (!v) { return; }

			if (ot.tryitEditor.ie9over) { document.execCommand("ms-beginUndoUnit"); }
			if (ot.tryitEditor.edit_objs.length) {
				for (var i=0; i<ot.tryitEditor.edit_objs.length; ++i) {
					var o = ot.tryitEditor.edit_objs[i];
					if (o.style) {
						if (v.substr(0,1) == 'h') {
							o.tagName = v;
						} else {
							o.style.fontSize = v;
						}
					}
				}
			}
			if (ot.tryitEditor.ie9over) { document.execCommand("ms-endUndoUnit"); }
			ot.tryitEditor.edit_sel.removeAllRanges();
		});
	};

	ot.tryitEditor._font_up = function (obj) {
		ot.tryitEditor._font_up_dn(10);
	};

	ot.tryitEditor._font_dn = function (obj) {
		ot.tryitEditor._font_up_dn(-10);
	};

	ot.tryitEditor._font_up_dn = function (dx) {
		if (!ot.tryitEditor.__get_cursor_objs(true)) { return; }
		if (ot.tryitEditor.ie9over) { document.execCommand("ms-beginUndoUnit"); }
		if (ot.tryitEditor.edit_objs.length) {
			for (var i=0; i<ot.tryitEditor.edit_objs.length; ++i) {
				var o = ot.tryitEditor.edit_objs[i];
				if (o.style) {
					var s = parseInt(o.style.fontSize);
					if (!s) { s = 100; }
					o.style.fontSize = (s+dx)+'%';
				}
			}
		}
		if (ot.tryitEditor.ie9over) { document.execCommand("ms-endUndoUnit"); }
	};

	ot.tryitEditor._clear = function () {
		var o = ot.jq('#_tryitEditor_contents');
		if (o.is(':visible')) {
			document.execCommand('removeFormat',false);
			if (ot.tryitEditor.ie9over) {
			}
		} else {
			var h = ot.jq('#_tryitEditor_html').val();
			ot.jq('#_tryitEditor_html').val(style_html(h));
		}
	};

	ot.tryitEditor._html = function () {
		var o = ot.jq('#_tryitEditor_contents');
		if (o.is(':visible')) {
			var a = o.html();
			ot.jq('#_tryitEditor_html').val(a).width(o.width()).show();
			o.hide();
			ot.jq('#_tryitEditor_toolbar .code ').attr('disabled','disabled').css('background-color','rgba(54, 52, 52, 0.66)');
		} else {
			var x = ot.jq('#_tryitEditor_html');
			x.hide();
			o.show();
			o[0].focus();
			if (o.html() != x.val()) {
				if (ot.tryitEditor.navigator != 'firefox') {
					o.html(x.val());
				} else {
					document.execCommand('selectAll',false);
					document.execCommand('insertHTML',false,x.val());
				}
			}
			ot.jq('#_tryitEditor_toolbar .code ').removeAttr('disabled').css('background-color','#fff');
		}
	};

	ot.tryitEditor._switch = function (sw) {
		var a = ot.jq('#_tryitEditor_style');
		var f = ot.tryitEditor._switch_mode;
		a.remove();
		if (sw === true) { ot.tryitEditor._switch_mode = true; 
		} else if (sw === false) { ot.tryitEditor._switch_mode = false; return; 
		} else { ot.tryitEditor._switch_mode = !ot.tryitEditor._switch_mode; }
		var t = "#_tryitEditor_toolbar .onethird-button {";
		t += "box-shadow: 0px 0px 2px #3A3A3A;border: 2px solid #FFF !important;font-family: 'Muli','ヒラギノ角ゴ Pro W3','Meiryo', 'Helvetica', 'Verdana';background-color: #D6D3D3;color: #222 !important;font-size: 11px;border-radius: 4px;padding: 3px 7px 4px 7px;margin: 3px 6px 8px 0;text-transform: none;font-weight: normal;line-height: 100%;";
		t += "background: #CFD1CF;";
		t += "background-image: -webkit-gradient(linear,left top,left bottom,from(#F5F5F5),to(#CFD1CF));";
		t += "background-image: -moz-linear-gradient(top,#f5f5f5,#cfd1cf);";
		t += "background-image: -webkit-linear-gradient(top,#F5F5F5,#CFD1CF);";
		t += "background-image: -o-linear-gradient(top,#f5f5f5,#cfd1cf);";
		t += "background-image: -ms-linear-gradient(top,#f5f5f5,#cfd1cf);";
		t += "background-image: linear-gradient(top,#f5f5f5,#cfd1cf);";
		t += "}";
		if (ot.tryitEditor._switch_mode) {
			t += "#_tryitEditor_contents{position:relative}#_tryitEditor_contents p,#_tryitEditor_contents pre,#_tryitEditor_contents div,#_tryitEditor_contents ul,#_tryitEditor_contents ol{position:relative;border: 1px dotted #949494;margin-right:20px;";
			if (ot.tryitEditor.ie9over) {
				t += "padding:1px;}";
				t += "#_tryitEditor_contents div { padding-top:3px; padding-bottom:3px; }";
			} else {
				t += "min-height:1em;}";
			}
			t += "#_tryitEditor_contents span{border: 1px dotted #949494;border-width:0 1px 0 1px;}";
			t += "#_tryitEditor_contents div + div { border-top:none;}";
			if (ot.tryitEditor.navigator != 'ie') {
				t += "#_tryitEditor_contents p:after{content:'p';position:absolute;top:0;right:0;background-color:rgba(34,34,34,0.7);color:#FFF;font-size:8px;height:13px;line-height:9px;margin:0;padding:2px}";
			}
			t += "#_tryitEditor_contents div:after{content:'div';position:absolute;top:0;right:0;background-color:rgba(34,34,34,0.7);color:#FFF;font-size:8px;height:13px;line-height:9px;margin:0;padding:2px}#_tryitEditor_contents ul:after{content:'ul';position:absolute;top:0;right:0;background-color:rgba(34,34,34,0.7);color:#FFF;font-size:8px;height:13px;line-height:9px;margin:0;padding:2px}#_tryitEditor_contents ol:after{content:'ol';position:absolute;top:0;right:0;background-color:rgba(34,34,34,0.7);color:#FFF;font-size:8px;height:13px;line-height:9px;margin:0;padding:2px}#_tryitEditor_tbl{background-color: #FFF;color: #000;padding: 5px 30px 5px 5px;overflow: scroll;}#_tryitEditor_contents p{margin-top:2px;}";
			t += "#_tryitEditor_contents pre:after{content:'pre';position:absolute;top:0;right:0;background-color:rgba(34,34,34,0.7);color:#FFF;font-size:8px;height:13px;line-height:9px;margin:0;padding:2px}";
		}
		ot.jq('head').append("<style id='_tryitEditor_style'>"+t+"</style>");
	};

	ot.tryitEditor._tag_edit = function () {
		if (!ot.tryitEditor.__get_cursor_objs(false)) { return; }
		ot.tryitEditor.edit_obj = ot.tryitEditor.edit_objs[0];
		if (ot.tryitEditor.edit_obj.nodeName == '#text' && ot.tryitEditor.edit_obj.parentNode.id == '_tryitEditor_contents') {
			return;
		}
		var h = '';
		h = ot.tryitEditor.edit_obj.outerHTML.replace(/(^\s+)|(\s+$)|(\t)/g, "");
		var t = "<textarea style='width:"+(ot.jq('#_tryitEditor_contents').width()-50)+"px;overflow: scroll;height:150px;color:#000;background-color: #FFF;'></textarea>";
		var d = "<input type='button' value='upper' class='upper' />";
		d += "<input type='button' value='prev' class='prev' />";
		d += "<input type='button' value='next' class='next' />";
		d += "<input type='button' value='js-beautifier' class='style_html' />";
		d += "<input type='button' value='remove tag' class='remove_tag' />";
		d += "<input type='button' value='remove style' class='remove_style' />";
		d += "<br />";
		d += "<select style='padding:0 5px;margin:5px 0 10px 0;width:120px' class='chg_block'><option>change</option><option>p</option><option>div</option><option>h1</option><option>h2</option><option>h3</option><option>h4</option><option>h5</option><option>pre</option><option>backquote</option><option>-esc-</option></select>";
		var opt = "<option>p</option><option>div</option><option>h1</option><option>h2</option><option>h3</option>";
		d += "<select style='padding:0 5px;margin:0 0 10px 5px;width:120px' class='add_block'><option>append end</option>"+opt+"</select>";
		d += "<select style='padding:0 5px;margin:0 0 10px 5px;width:120px' class='ins_block'><option>insert top</option>"+opt+"</select>";
		ot.tryitEditor.__open_form(t,d);
		ot.jq('#_tryitEditor_form textarea').val(h);
		ot.jq('#_tryitEditor_form .upper').click(function(){
			if (ot.tryitEditor.edit_objs[0].parentNode.id != '_tryitEditor_contents') {
				ot.tryitEditor.edit_sel.removeAllRanges();
				var r = ot.tryitEditor.edit_rng;
				var n = ot.tryitEditor.edit_objs[0].parentNode;
				r.selectNode(n);
				ot.tryitEditor.edit_sel.addRange(r);
				if (!ot.tryitEditor.__get_cursor_objs(false)) { return; }
				var a = n.outerHTML;
				ot.tryitEditor.edit_obj = n;
				a = a.replace(/(^\s+)|(\s+$)|(\t)/g, "");
				ot.jq('#_tryitEditor_form textarea').val(a);
			}
		});
		
		ot.jq('#_tryitEditor_form .next').click(function(){
			if (ot.tryitEditor.edit_objs[0].nextElementSibling) {
				ot.tryitEditor.edit_sel.removeAllRanges();
				var r = ot.tryitEditor.edit_rng;
				var n = ot.tryitEditor.edit_objs[0].nextElementSibling;
				//if (n.nodeName =='#text') {
				//		n = n.nextElementSibling;
				//}
				r.selectNode(n);
				ot.tryitEditor.edit_sel.addRange(r);
				if (!ot.tryitEditor.__get_cursor_objs(false)) { return; }
				var a = n.outerHTML;
				ot.tryitEditor.edit_obj = n;
				a = a.replace(/(^\s+)|(\s+$)|(\t)/g, "");
				ot.jq('#_tryitEditor_form textarea').val(a);
			}
		});
		
		ot.jq('#_tryitEditor_form .prev').click(function(){
			if (ot.tryitEditor.edit_objs[0].previousElementSibling) {
				ot.tryitEditor.edit_sel.removeAllRanges();
				var r = ot.tryitEditor.edit_rng;
				var n = ot.tryitEditor.edit_objs[0].previousElementSibling;
				r.selectNode(n);
				ot.tryitEditor.edit_sel.addRange(r);
				if (!ot.tryitEditor.__get_cursor_objs(false)) { return; }
				var a = n.outerHTML;
				ot.tryitEditor.edit_obj = n;
				a = a.replace(/(^\s+)|(\s+$)|(\t)/g, "");
				ot.jq('#_tryitEditor_form textarea').val(a);
			}
		});
		
		ot.jq('#_tryitEditor_form .chg_block').change(function(){
			var a = ot.jq(this).val();
			var h = ot.jq('#_tryitEditor_form textarea').val();
			if (a == '-esc-') {
				ot.jq('#_tryitEditor_form textarea').val(ot.tryitEditor._esc(h));
			} else {
				var m1 = h.match(/<([A-z0-9]*)/i);
				var m2 = h.match(/<\/([A-z0-9]*)>$/i);
				if (m1 && m2) {
					if (m1[0][0] == '<' && m2[0].substr(0,2) == '</' && m1[1] == m2[1]) {
						h = h.replace(/<([A-z0-9]*)/i,'<'+a);
						h = h.replace(/<\/([A-z0-9]*)>$/i,'</'+a+'>');
						ot.jq('#_tryitEditor_form textarea').val(h);
					}
				} else {
					ot.jq('#_tryitEditor_form textarea').val('<'+a+'>'+h+'</'+a+'>');
				}
			}
		});
		
		ot.jq('#_tryitEditor_form .add_block').change(function(){
			var a = ot.jq(this).val();
			var h = ot.jq('#_tryitEditor_form textarea').val();
			var b = (a=='p' || a=='div') ? '<br />':' ';
			h += '<'+a+'>'+b+'</'+a+'>'
			ot.jq('#_tryitEditor_form textarea').val(h);
		});
		
		ot.jq('#_tryitEditor_form .ins_block').change(function(){
			var a = ot.jq(this).val();
			var h = ot.jq('#_tryitEditor_form textarea').val();
			var b = (a=='p' || a=='div') ? '<br />':' ';
			h = '<'+a+'>'+b+'</'+a+'>' + h;
			ot.jq('#_tryitEditor_form textarea').val(h);
		});

		ot.jq('#_tryitEditor_form .remove_tag').click(function(){
			var h = ot.jq('#_tryitEditor_form textarea').val();
			h = h.replace(/<\/*[A-z0-9]*?>|<[A-z0-9]*? .*?[^-]>/gm,'');
			ot.jq('#_tryitEditor_form textarea').val(h);
		});

		ot.jq('#_tryitEditor_form .remove_style').click(function(){
			var h = ot.jq('#_tryitEditor_form textarea').val();
			h = h.replace(/style\s*='.*?'/g,'');
			h = h.replace(/style\s*=".*?"/g,'');
			ot.jq('#_tryitEditor_form textarea').val(h);
		});
		
		ot.jq('#_tryitEditor_form .ok').click(function(){
			var h = ot.jq('#_tryitEditor_form textarea').val();
			ot.tryitEditor.edit_sel.removeAllRanges();
			if (ot.tryitEditor.ie9over) {document.execCommand("ms-beginUndoUnit");}
			ot.tryitEditor.edit_obj.outerHTML = h;
			if (ot.tryitEditor.ie9over) {document.execCommand("ms-endUndoUnit");}
			ot.tryitEditor.__close_form();
		});
		
		ot.jq('#_tryitEditor_form .style_html').click(function(){
			var h = ot.jq('#_tryitEditor_form textarea').val();
			ot.jq('#_tryitEditor_form textarea').val(style_html(h));
		});
		
	};

	ot.tryitEditor._attribute = function (obj) {
		if (!ot.tryitEditor.__get_cursor_objs(true)) { return; }
		ot.tryitEditor.edit_obj = ot.tryitEditor.edit_objs[0];
		var h = "";
		h += "<div style='background-color: #B2B2B2;padding: 5px;width: 500px;overflow: hidden;height:1.5em;line-height:1.5em' class='text'>"+ot.tryitEditor.edit_obj.innerHTML+"</div>";
		h += "<div style='padding:10px 0'>";
		h += "<span style='color:#fff;width:50px;display: inline-block;margin-bottom:5px;'>tag</span><input type='text' readonly class='tagName' value='"+ot.tryitEditor.edit_obj.tagName+"' style='width:452px;padding:2px;background-color: #B2B2B2;'/><br />";
		h += "<span style='color:#fff;width:50px;display: inline-block;margin-bottom:5px;'>class</span><input type='text' class='className' value='"+ot.tryitEditor.edit_obj.className+"' style='width:452px;padding:2px'/><br />";
		h += "<span style='color:#fff;width:50px;display: inline-block;vertical-align: top;margin-bottom:3px;'>css</span>";
		h += "<textarea style='width:454px;height:3em;padding:2px' class='cssText'>"+ot.tryitEditor.edit_obj.style.cssText+"</textarea><br />";
		h += "</div>";
		h += "<p><input type='button' value='upper' class='upper' />";
		h += "<input type='button' value='duplicate' class='duplicate' />";
		h += "<input type='button' value='append P tag' class='appendP' />";
		h += "<input type='button' value='remove tag' class='removeTag' /></p>";
		ot.tryitEditor.__open_form("<div>"+h+"</div>");
		
		ot.jq('#_tryitEditor_form .ok').click(function(){
			var cssText = ot.jq('#_tryitEditor_form .cssText').val();
			var className = ot.jq('#_tryitEditor_form .className').val();
			for (var i=0; i<ot.tryitEditor.edit_objs.length;++i) {
				var o = ot.tryitEditor.edit_objs[i];
				if (o.style != undefined && o.className != undefined) {
					o.style.cssText = cssText;
					o.className = className;
				}
			}
			ot.tryitEditor.edit_sel.removeAllRanges();
			ot.tryitEditor.__close_form();
		});
		
		ot.jq('#_tryitEditor_form .removeTag').click(function(){
			for (var i=0; i<ot.tryitEditor.edit_objs.length;++i) {
				var o = ot.tryitEditor.edit_objs[i];
				o.outerHTML = o.innerHTML;
			}
			ot.tryitEditor.edit_sel.removeAllRanges();
			ot.tryitEditor.__close_form();
		});

		ot.jq('#_tryitEditor_form .duplicate').click(function(){
			var h = '';
			for (var i=0; i<ot.tryitEditor.edit_objs.length;++i) {
				h += ot.tryitEditor.edit_objs[i].outerHTML;
			}
			var o = ot.tryitEditor.edit_objs[ot.tryitEditor.edit_objs.length-1];
			if (ot.tryitEditor.ie9over) {document.execCommand("ms-beginUndoUnit");}
			ot.jq(o).after(h);
			if (ot.tryitEditor.ie9over) {document.execCommand("ms-endUndoUnit");}
			ot.tryitEditor.edit_sel.removeAllRanges();
			ot.tryitEditor.__close_form();
		});

		ot.jq('#_tryitEditor_form .appendP').click(function(){
			var o = ot.tryitEditor.edit_objs[ot.tryitEditor.edit_objs.length-1];
			if (ot.tryitEditor.ie9over) {document.execCommand("ms-beginUndoUnit");}
			ot.jq(o).after('<p>&nbsp</p>');
			if (ot.tryitEditor.ie9over) {document.execCommand("ms-endUndoUnit");}
			ot.tryitEditor.edit_sel.removeAllRanges();
			ot.tryitEditor.__close_form();
		});

		ot.jq('#_tryitEditor_form .upper').click(function(){
			if (ot.tryitEditor.edit_objs[0].parentNode.id != '_tryitEditor_contents') {
				ot.tryitEditor.edit_sel.removeAllRanges();
				var r = ot.tryitEditor.edit_rng;
				var n = ot.tryitEditor.edit_objs[0].parentNode;
				r.selectNode(n);
				ot.tryitEditor.edit_sel.addRange(r);
				if (!ot.tryitEditor.__get_cursor_objs(false)) { return; }
				ot.jq('#_tryitEditor_form .text').html(n.innerHTML);
				ot.jq('#_tryitEditor_form .tagName').val(n.tagName);
				ot.jq('#_tryitEditor_form .className').val(n.className);
				ot.jq('#_tryitEditor_form .cssText').val(n.style.cssText);
			}
		});
	};

	ot.tryitEditor._esc = function (v) {
		return String(v).replace( /</g, "&amp;lt;" ).replace( />/g, "&amp;gt;" ).replace( /"/g, "&amp;quot;" ).replace( /'/g, "&amp;#39;" ).replace( /\$/g, "&amp;#36;" );
	}; //"

	ot.tryitEditor._table = function () {
		var r = ot.tryitEditor.save_cursor();
		if (!r) { return; }
		x = r.toString();
		var o = r.commonAncestorContainer;
		var i = 0;
		ot.tryitEditor.table_new_html = false;
		while (o.tagName != 'TABLE') {
			if (++i > 5) {
				var ar = ot.tryitEditor.opt.table_style;
				var h = "<table style='"+((ar.table)?ar.table:'')+"'>";
				for (var j=ar.row; j > 0; --j) {
					h += "<tr style='"+((ar.tr)?ar.tr:'')+"'>";
					for (var i=ar.col; i >0; --i) {
						h += "<td style='"+((ar.td)?ar.td:'')+"'>"+((ar.cell)?ar.cell:'')+"</td>";
					}
					h += "</tr>";
				}
				h += "</table>";
				ot.tryitEditor.table_new_html = h;
				break;
			}
			o = o.parentNode;
		}
		ot.tryitEditor.edit_obj = o;
		ot.tryitEditor.edit_sel.removeAllRanges();

		var h = "<div id='_tryitEditor_tbl' style='height:200px;width:"+(ot.tryitEditor.opt.width-50)+"px;' contenteditable='true'></div>";
		var d = "";

		d += "<div style='text-align: right;'>";
		d += "<span style='display:inlne-block'><input type='button' value='+ col' class='ins_col'	/></span>";
		d += "<span style='display:inlne-block'><input type='button' value='- col' class='del_col'	/></span>";
		d += "<span style='display:inlne-block'><input type='button' value='&rArr;' class='add_col' /></span>";
		d += "</div>";

		d += "<div style='padding-bottom:10px'>";
		d += "<span style='display:inlne-block'><input type='button' value='+ row' class='ins_row' /></span>";
		d += "<span style='display:inlne-block'><input type='button' value='- row' class='del_row' /></span>";
		d += "<span style='display:inlne-block'><input type='button' value='&dArr;' class='add_row' /></span>";
		d += "<span style='display:inlne-block'><input type='button' value='td &hArr; th' class='chg_td' /></span>";
		d += "</div>";


		ot.tryitEditor.__open_form(h,d);
		if (!ot.tryitEditor.table_new_html) {
			ot.jq('#_tryitEditor_tbl').html(ot.tryitEditor.edit_obj.outerHTML);
		} else {
			ot.jq('#_tryitEditor_tbl').html(ot.tryitEditor.table_new_html);
		}

		ot.jq('#_tryitEditor_form .ok').click(function(){
			var h = ot.jq('#_tryitEditor_tbl').html();
			ot.tryitEditor.__close_form();
			ot.tryitEditor.edit_sel.removeAllRanges();
			var r = ot.tryitEditor.edit_rng;
			if (ot.tryitEditor.table_new_html) {
				ot.tryitEditor.edit_sel.addRange(r);
			} else {
				r.selectNode(ot.tryitEditor.edit_obj);
				ot.tryitEditor.edit_sel.addRange(r);
			}
			ot.tryitEditor.__insertHTML(h);
			ot.tryitEditor.table_new_html = false;
		});

		ot.jq('#_tryitEditor_form .add_row').click(function(){
			var s = document.getSelection();
			if (s.type == 'None') { return ; }
			var r = s.getRangeAt(0);
			var n = r.commonAncestorContainer.parentNode;
			if (n.tagName != 'TR') { n = n.parentNode; }
			if (n.tagName != 'TR') {
				return;
			}
			var a = n.outerHTML;
			if (!a) { return; }
			a = a.replace(/>.*?</gm,'>&nbsp;<');
			if (!a) { return; }
			ot.jq('#_tryitEditor_tbl tbody').append(a);
		});

		ot.jq('#_tryitEditor_form .ins_row').click(function(){
			var s = document.getSelection();
			if (s.type == 'None') { return ; }
			var r = s.getRangeAt(0);
			var n = r.commonAncestorContainer.parentNode;
			if (n.tagName != 'TR') { n = n.parentNode; }
			if (n.tagName != 'TR') {
				return;
			}
			var a = n.outerHTML;
			if (!a) { return; }
			a = a.replace(/>.*?</gm,'>&nbsp;<');
			if (!a) { return; }

			var s = document.getSelection();
			if (s.type == 'None') { return ; }
			var r = s.getRangeAt(0);
			var n = r.commonAncestorContainer.parentNode;
			if (n.tagName != 'TR') { n = n.parentNode; }
			if (n.tagName != 'TR') {
				return;
			}

			ot.jq(n).before(a);
		});

		ot.jq('#_tryitEditor_form .chg_td').click(function(){
			var s = document.getSelection();
			if (s.type == 'None') { return ; }
			var r = s.getRangeAt(0);
			var n = r.commonAncestorContainer.parentNode;
			var x = false;
			if (n.tagName == 'TD') {
				var o = n.outerHTML;
				var a = o.replace(/<td/mi,'<th');
				a.replace(/<\/td>/mi,'<\/th>');
				n.outerHTML = a;
			} else if (n.tagName == 'TH') {
				var o = n.outerHTML;
				var a = o.replace(/<th/mi,'<td');
				a.replace(/<\/th>/mi,'<\/td>');
				n.outerHTML = a;
			}
		});

		ot.jq('#_tryitEditor_form .del_row').click(function(){
			var s = document.getSelection();
			if (s.type == 'None') { return ; }
			var r = s.getRangeAt(0);
			var n = r.commonAncestorContainer.parentNode;
			if (n.tagName != 'TR') { n = n.parentNode; }
			if (n.tagName != 'TR') {
				return;
			}
			ot.jq(n).remove();
		});

		ot.jq('#_tryitEditor_form .del_col').click(function(){
			var r = false;
			var s = document.getSelection();
			if (s.type == 'None') { return ; }
			r = s.getRangeAt(0);
			var n = r.commonAncestorContainer.parentNode;
			if (n.tagName != 'TD' && n.tagName != 'TH') { return; }
			var i = -1;
			var tmp = n;
			while (++i < 20) {
				if (!(tmp = tmp.previousElementSibling)) { break; }
			}
			ot.jq('#_tryitEditor_tbl tr').each(function(){
				ot.jq(this).children('td:nth('+i+'),th:nth('+i+')').remove();
			});
			
		});

		ot.jq('#_tryitEditor_form .ins_col').click(function(){
			var r = false;
			var s = document.getSelection();
			if (s.type == 'None') { return ; }
			r = s.getRangeAt(0);
			var n = r.commonAncestorContainer.parentNode;
			if (n.tagName != 'TD' && n.tagName != 'TH') { return; }
			var i = 0;
			var tmp = n;
			while (i < 50) {
				if (!(tmp = tmp.previousElementSibling)) { break; }
				if (tmp.tagName != 'TD' && tmp.tagName != 'TH') { continue; }
				++i;
			}

			ot.jq('#_tryitEditor_tbl tr').each(function(){
				var o = ot.jq(this).children('td:nth('+i+'), th:nth('+i+')');
				var a = o[0].outerHTML;
				a = a.replace(/>.*?</gm,'>&nbsp;<');
				if (a) {
					a = a.replace(/>.*?</gm,'>&nbsp;<');
					o.before(a);
				}
			});
			

		});

		ot.jq('#_tryitEditor_form .add_col').click(function(){
			ot.jq('#_tryitEditor_tbl tbody tr').each(function(){
				var o = ot.jq(this).children('td:last, th:last');
				var a = o[0].outerHTML;
				a = a.replace(/>.*?</gm,'>&nbsp;<');
				if (a) {
					ot.jq(this).append(a);
				}
			});
		});

	};
	
	ot.tryitEditor.html = function (a) {
		var o = ot.jq('#_tryitEditor_contents');
		if (o.is(':visible')) {
			if (a !== undefined) {
				return o.html(a);
			} else {
				return o.html();
			}
		} else {
			if (a !== undefined) {
				ot.jq('#_tryitEditor_html').val(a);
			} else {
				return ot.jq('#_tryitEditor_html').val();
			}
		}
	};
	
	ot.tryitEditor.insert = function (html) {
		var r = ot.tryitEditor.save_cursor();
		if (ot.tryitEditor.navigator == 'ie') {
			var a = ot.jq('#_tryitEditor_contents')[0];
			ot.jq(a).focus();
		}
		ot.tryitEditor.__insertHTML(html);
	};

/* jshint curly:true, eqeqeq:true, laxbreak:true, noempty:false */
/*

 Style HTML
---------------

	Written by Nochum Sossonko, (nsossonko@hotmail.com)

	Based on code initially developed by: Einar Lielmanis, <elfz@laacz.lv>
		http://jsbeautifier.org/


	You are free to use this in any way you want, in case you find this useful or working for you.

	Usage:
		style_html(html_source);

		style_html(html_source, options);

	The options are:
		indent_size (default 4)					  indentation size,
		indent_char (default space)			  character to indent with,
		max_char (default 250)						-	 maximum amount of characters per line (0 = disable)
		brace_style (default "collapse") - "collapse" | "expand" | "end-expand"
						put braces on the same line as control statements (default), or put braces on own line (Allman / ANSI style), or just put end braces on own line.
		unformatted (defaults to inline tags) - list of tags, that shouldn't be reformatted
		indent_scripts (default normal)	 - "keep"|"separate"|"normal"

		e.g.

		style_html(html_source, {
			'indent_size': 2,
			'indent_char': ' ',
			'max_char': 78,
			'brace_style': 'expand',
			'unformatted': ['a', 'sub', 'sup', 'b', 'i', 'u']
		});
*/

function style_html(html_source, options) {
//Wrapper function to invoke all the necessary constructors and deal with the output.

	var multi_parser,
			indent_size,
			indent_character,
			max_char,
			brace_style,
			unformatted;

	options = options || {};
	indent_size = options.indent_size || 4;
	indent_character = options.indent_char || ' ';
	brace_style = options.brace_style || 'collapse';
	max_char = options.max_char === 0 ? Infinity : options.max_char || 250;
	unformatted = options.unformatted || ['a', 'span', 'bdo', 'em', 'strong', 'dfn', 'code', 'samp', 'kbd', 'var', 'cite', 'abbr', 'acronym', 'q', 'sub', 'sup', 'tt', 'i', 'b', 'big', 'small', 'u', 's', 'strike', 'font', 'ins', 'del', 'pre', 'address', 'dt', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

	function Parser() {

		this.pos = 0; //Parser position
		this.token = '';
		this.current_mode = 'CONTENT'; //reflects the current Parser mode: TAG/CONTENT
		this.tags = { //An object to hold tags, their position, and their parent-tags, initiated with default values
			parent: 'parent1',
			parentcount: 1,
			parent1: ''
		};
		this.tag_type = '';
		this.token_text = this.last_token = this.last_text = this.token_type = '';

		this.Utils = { //Uilities made available to the various functions
			whitespace: "\n\r\t ".split(''),
			single_token: 'br,input,link,meta,!doctype,basefont,base,area,hr,wbr,param,img,isindex,?xml,embed,?php,?,?='.split(','), //all the single tags for HTML
			extra_liners: 'head,body,/html'.split(','), //for tags that need a line of whitespace before them
			in_array: function (what, arr) {
				for (var i=0; i<arr.length; i++) {
					if (what === arr[i]) {
						return true;
					}
				}
				return false;
			}
		};

		this.get_content = function () { //function to capture regular content between tags

			var input_char = '',
					content = [],
					space = false; //if a space is needed

			while (this.input.charAt(this.pos) !== '<') {
				if (this.pos >= this.input.length) {
					return content.length?content.join(''):['', 'TK_EOF'];
				}

				input_char = this.input.charAt(this.pos);
				this.pos++;
				this.line_char_count++;

				if (this.Utils.in_array(input_char, this.Utils.whitespace)) {
					if (content.length) {
						space = true;
					}
					this.line_char_count--;
					continue; //don't want to insert unnecessary space
				}
				else if (space) {
					if (this.line_char_count >= this.max_char) { //insert a line when the max_char is reached
						content.push('\n');
						for (var i=0; i<this.indent_level; i++) {
							content.push(this.indent_string);
						}
						this.line_char_count = 0;
					}
					else{
						content.push(' ');
						this.line_char_count++;
					}
					space = false;
				}
				content.push(input_char); //letter at-a-time (or string) inserted to an array
			}
			return content.length?content.join(''):'';
		};

		this.get_contents_to = function (name) { //get the full content of a script or style to pass to js_beautify
			if (this.pos === this.input.length) {
				return ['', 'TK_EOF'];
			}
			var input_char = '';
			var content = '';
			var reg_match = new RegExp('</' + name + '\\s*>', 'igm');
			reg_match.lastIndex = this.pos;
			var reg_array = reg_match.exec(this.input);
			var end_script = reg_array?reg_array.index:this.input.length; //absolute end of script
			if(this.pos < end_script) { //get everything in between the script tags
				content = this.input.substring(this.pos, end_script);
				this.pos = end_script;
			}
			return content;
		};

		this.record_tag = function (tag){ //function to record a tag and its parent in this.tags Object
			if (this.tags[tag + 'count']) { //check for the existence of this tag type
				this.tags[tag + 'count']++;
				this.tags[tag + this.tags[tag + 'count']] = this.indent_level; //and record the present indent level
			}
			else { //otherwise initialize this tag type
				this.tags[tag + 'count'] = 1;
				this.tags[tag + this.tags[tag + 'count']] = this.indent_level; //and record the present indent level
			}
			this.tags[tag + this.tags[tag + 'count'] + 'parent'] = this.tags.parent; //set the parent (i.e. in the case of a div this.tags.div1parent)
			this.tags.parent = tag + this.tags[tag + 'count']; //and make this the current parent (i.e. in the case of a div 'div1')
		};

		this.retrieve_tag = function (tag) { //function to retrieve the opening tag to the corresponding closer
			if (this.tags[tag + 'count']) { //if the openener is not in the Object we ignore it
				var temp_parent = this.tags.parent; //check to see if it's a closable tag.
				while (temp_parent) { //till we reach '' (the initial value);
					if (tag + this.tags[tag + 'count'] === temp_parent) { //if this is it use it
						break;
					}
					temp_parent = this.tags[temp_parent + 'parent']; //otherwise keep on climbing up the DOM Tree
				}
				if (temp_parent) { //if we caught something
					this.indent_level = this.tags[tag + this.tags[tag + 'count']]; //set the indent_level accordingly
					this.tags.parent = this.tags[temp_parent + 'parent']; //and set the current parent
				}
				delete this.tags[tag + this.tags[tag + 'count'] + 'parent']; //delete the closed tags parent reference...
				delete this.tags[tag + this.tags[tag + 'count']]; //...and the tag itself
				if (this.tags[tag + 'count'] === 1) {
					delete this.tags[tag + 'count'];
				}
				else {
					this.tags[tag + 'count']--;
				}
			}
		};

		this.get_tag = function (peek) { //function to get a full tag and parse its type
			var input_char = '',
					content = [],
					comment = '',
					space = false,
					tag_start, tag_end,
					orig_pos = this.pos,
					orig_line_char_count = this.line_char_count;

			peek = peek !== undefined ? peek : false;

			do {
				if (this.pos >= this.input.length) {
					if (peek) {
						this.pos = orig_pos;
						this.line_char_count = orig_line_char_count;
					}
					return content.length?content.join(''):['', 'TK_EOF'];
				}

				input_char = this.input.charAt(this.pos);
				this.pos++;
				this.line_char_count++;

				if (this.Utils.in_array(input_char, this.Utils.whitespace)) { //don't want to insert unnecessary space
					space = true;
					this.line_char_count--;
					continue;
				}

				if (input_char === "'" || input_char === '"') {
					if (!content[1] || content[1] !== '!') { //if we're in a comment strings don't get treated specially
						input_char += this.get_unformatted(input_char);
						space = true;
					}
				}

				if (input_char === '=') { //no space before =
					space = false;
				}

				if (content.length && content[content.length-1] !== '=' && input_char !== '>' && space) { 
						//no space after = or before >
					if (this.line_char_count >= this.max_char) {
						this.print_newline(false, content);
						this.line_char_count = 0;
					}
					else {
						content.push(' ');
						this.line_char_count++;
					}
					space = false;
				}
				if (input_char === '<') {
					tag_start = this.pos - 1;
				}
				content.push(input_char); //inserts character at-a-time (or string)
			} while (input_char !== '>');

			var tag_complete = content.join('');
			var tag_index;
			if (tag_complete.indexOf(' ') !== -1) { //if there's whitespace, thats where the tag name ends
				tag_index = tag_complete.indexOf(' ');
			}
			else { //otherwise go with the tag ending
				tag_index = tag_complete.indexOf('>');
			}
			var tag_check = tag_complete.substring(1, tag_index).toLowerCase();
			if (tag_complete.charAt(tag_complete.length-2) === '/' ||
				this.Utils.in_array(tag_check, this.Utils.single_token)) { //if this tag name is a single tag type (either in the list or has a closing /)
				if ( ! peek) {
					this.tag_type = 'SINGLE';
				}
			}
			else if (tag_check === 'script') { //for later script handling
				if ( ! peek) {
					this.record_tag(tag_check);
					this.tag_type = 'SCRIPT';
				}
			}
			else if (tag_check === 'style') { //for future style handling (for now it justs uses get_content)
				if ( ! peek) {
					this.record_tag(tag_check);
					this.tag_type = 'STYLE';
				}
			}
			else if (this.is_unformatted(tag_check, unformatted)) { // do not reformat the "unformatted" tags
				comment = this.get_unformatted('</'+tag_check+'>', tag_complete); //...delegate to get_unformatted function
				content.push(comment);
				// Preserve collapsed whitespace either before or after this tag.
				if (tag_start > 0 && this.Utils.in_array(this.input.charAt(tag_start - 1), this.Utils.whitespace)){
						content.splice(0, 0, this.input.charAt(tag_start - 1));
				}
				tag_end = this.pos - 1;
				if (this.Utils.in_array(this.input.charAt(tag_end + 1), this.Utils.whitespace)){
						content.push(this.input.charAt(tag_end + 1));
				}
				this.tag_type = 'SINGLE';
			}
			else if (tag_check.charAt(0) === '!') { //peek for <!-- comment
				if (tag_check.indexOf('[if') !== -1) { //peek for <!--[if conditional comment
					if (tag_complete.indexOf('!IE') !== -1) { //this type needs a closing --> so...
						comment = this.get_unformatted('-->', tag_complete); //...delegate to get_unformatted
						content.push(comment);
					}
					if ( ! peek) {
						this.tag_type = 'START';
					}
				}
				else if (tag_check.indexOf('[endif') !== -1) {//peek for <!--[endif end conditional comment
					this.tag_type = 'END';
					this.unindent();
				}
				else if (tag_check.indexOf('[cdata[') !== -1) { //if it's a <[cdata[ comment...
					comment = this.get_unformatted(']]>', tag_complete); //...delegate to get_unformatted function
					content.push(comment);
					if ( ! peek) {
						this.tag_type = 'SINGLE'; //<![CDATA[ comments are treated like single tags
					}
				}
				else {
					comment = this.get_unformatted('-->', tag_complete);
					content.push(comment);
					this.tag_type = 'SINGLE';
				}
			}
			else if ( ! peek) {
				if (tag_check.charAt(0) === '/') { //this tag is a double tag so check for tag-ending
					this.retrieve_tag(tag_check.substring(1)); //remove it and all ancestors
					this.tag_type = 'END';
				}
				else { //otherwise it's a start-tag
					this.record_tag(tag_check); //push it on the tag stack
					this.tag_type = 'START';
				}
				if (this.Utils.in_array(tag_check, this.Utils.extra_liners)) { //check if this double needs an extra line
					this.print_newline(true, this.output);
				}
			}

			if (peek) {
				this.pos = orig_pos;
				this.line_char_count = orig_line_char_count;
			}

			return content.join(''); //returns fully formatted tag
		};

		this.get_unformatted = function (delimiter, orig_tag) { //function to return unformatted content in its entirety

			if (orig_tag && orig_tag.toLowerCase().indexOf(delimiter) !== -1) {
				return '';
			}
			var input_char = '';
			var content = '';
			var space = true;
			do {

				if (this.pos >= this.input.length) {
					return content;
				}

				input_char = this.input.charAt(this.pos);
				this.pos++;

				if (this.Utils.in_array(input_char, this.Utils.whitespace)) {
					if (!space) {
						this.line_char_count--;
						continue;
					}
					if (input_char === '\n' || input_char === '\r') {
						content += '\n';
						/*	Don't change tab indention for unformatted blocks.	If using code for html editing, this will greatly affect <pre> tags if they are specified in the 'unformatted array'
						for (var i=0; i<this.indent_level; i++) {
							content += this.indent_string;
						}
						space = false; //...and make sure other indentation is erased
						*/
						this.line_char_count = 0;
						continue;
					}
				}
				content += input_char;
				this.line_char_count++;
				space = true;


			} while (content.toLowerCase().indexOf(delimiter) === -1);
			return content;
		};

		this.get_token = function () { //initial handler for token-retrieval
			var token;

			if (this.last_token === 'TK_TAG_SCRIPT' || this.last_token === 'TK_TAG_STYLE') { //check if we need to format javascript
			 var type = this.last_token.substr(7);
			 token = this.get_contents_to(type);
				if (typeof token !== 'string') {
					return token;
				}
				return [token, 'TK_' + type];
			}
			if (this.current_mode === 'CONTENT') {
				token = this.get_content();
				if (typeof token !== 'string') {
					return token;
				}
				else {
					return [token, 'TK_CONTENT'];
				}
			}

			if (this.current_mode === 'TAG') {
				token = this.get_tag();
				if (typeof token !== 'string') {
					return token;
				}
				else {
					var tag_name_type = 'TK_TAG_' + this.tag_type;
					return [token, tag_name_type];
				}
			}
		};

		this.get_full_indent = function (level) {
			level = this.indent_level + level || 0;
			if (level < 1) {
				return '';
			}

			return Array(level + 1).join(this.indent_string);
		};

		this.is_unformatted = function(tag_check, unformatted) {
				//is this an HTML5 block-level link?
				if (!this.Utils.in_array(tag_check, unformatted)){
						return false;
				}

				if (tag_check.toLowerCase() !== 'a' || !this.Utils.in_array('a', unformatted)){
						return true;
				}

				//at this point we have an	tag; is its first child something we want to remain
				//unformatted?
				var next_tag = this.get_tag(true /* peek. */);
				if (next_tag && this.Utils.in_array(next_tag, unformatted)){
						return true;
				} else {
						return false;
				}
		};

		this.printer = function (js_source, indent_character, indent_size, max_char, brace_style) { //handles input/output and some other printing functions

			this.input = js_source || ''; //gets the input for the Parser
			this.output = [];
			this.indent_character = indent_character;
			this.indent_string = '';
			this.indent_size = indent_size;
			this.brace_style = brace_style;
			this.indent_level = 0;
			this.max_char = max_char;
			this.line_char_count = 0; //count to see if max_char was exceeded

			for (var i=0; i<this.indent_size; i++) {
				this.indent_string += this.indent_character;
			}

			this.print_newline = function (ignore, arr) {
				this.line_char_count = 0;
				if (!arr || !arr.length) {
					return;
				}
				if (!ignore) { //we might want the extra line
					while (this.Utils.in_array(arr[arr.length-1], this.Utils.whitespace)) {
						arr.pop();
					}
				}
				arr.push('\n');
				for (var i=0; i<this.indent_level; i++) {
					arr.push(this.indent_string);
				}
			};

			this.print_token = function (text) {
				this.output.push(text);
			};

			this.indent = function () {
				this.indent_level++;
			};

			this.unindent = function () {
				if (this.indent_level > 0) {
					this.indent_level--;
				}
			};
		};
		return this;
	}

	/*_____________________--------------------_____________________*/

	multi_parser = new Parser(); //wrapping functions Parser
	multi_parser.printer(html_source, indent_character, indent_size, max_char, brace_style); //initialize starting values

	while (true) {
			var t = multi_parser.get_token();
			multi_parser.token_text = t[0];
			multi_parser.token_type = t[1];

		if (multi_parser.token_type === 'TK_EOF') {
			break;
		}

		switch (multi_parser.token_type) {
			case 'TK_TAG_START':
				multi_parser.print_newline(false, multi_parser.output);
				multi_parser.print_token(multi_parser.token_text);
				multi_parser.indent();
				multi_parser.current_mode = 'CONTENT';
				break;
			case 'TK_TAG_STYLE':
			case 'TK_TAG_SCRIPT':
				multi_parser.print_newline(false, multi_parser.output);
				multi_parser.print_token(multi_parser.token_text);
				multi_parser.current_mode = 'CONTENT';
				break;
			case 'TK_TAG_END':
				//Print new line only if the tag has no content and has child
				if (multi_parser.last_token === 'TK_CONTENT' && multi_parser.last_text === '') {
						var tag_name = multi_parser.token_text.match(/\w+/)[0];
						var tag_extracted_from_last_output = multi_parser.output[multi_parser.output.length -1].match(/<\s*(\w+)/);
						if (tag_extracted_from_last_output === null || tag_extracted_from_last_output[1] !== tag_name) {
								multi_parser.print_newline(true, multi_parser.output);
						}
				}
				multi_parser.print_token(multi_parser.token_text);
				multi_parser.current_mode = 'CONTENT';
				break;
			case 'TK_TAG_SINGLE':
				// Don't add a newline before elements that should remain unformatted.
				var tag_check = multi_parser.token_text.match(/^\s*<([a-z]+)/i);
				if (!tag_check || !multi_parser.Utils.in_array(tag_check[1], unformatted)){
						multi_parser.print_newline(false, multi_parser.output);
				}
				multi_parser.print_token(multi_parser.token_text);
				multi_parser.current_mode = 'CONTENT';
				break;
			case 'TK_CONTENT':
				if (multi_parser.token_text !== '') {
					multi_parser.print_token(multi_parser.token_text);
				}
				multi_parser.current_mode = 'TAG';
				break;
			case 'TK_STYLE':
			case 'TK_SCRIPT':
				if (multi_parser.token_text !== '') {
					multi_parser.output.push('\n');
					var text = multi_parser.token_text,
							_beautifier,
							script_indent_level = 1;
					if (multi_parser.token_type === 'TK_SCRIPT') {
						_beautifier = typeof js_beautify === 'function' && js_beautify;
					} else if (multi_parser.token_type === 'TK_STYLE') {
						_beautifier = typeof css_beautify === 'function' && css_beautify;
					}

					if (options.indent_scripts === "keep") {
						script_indent_level = 0;
					} else if (options.indent_scripts === "separate") {
						script_indent_level = -multi_parser.indent_level;
					}

					var indentation = multi_parser.get_full_indent(script_indent_level);
					if (_beautifier) {
						// call the Beautifier if avaliable
						text = _beautifier(text.replace(/^\s*/, indentation), options);
					} else {
						// simply indent the string otherwise
						var white = text.match(/^\s*/)[0];
						var _level = white.match(/[^\n\r]*$/)[0].split(multi_parser.indent_string).length - 1;
						var reindent = multi_parser.get_full_indent(script_indent_level -_level);
						text = text.replace(/^\s*/, indentation)
									 .replace(/\r\n|\r|\n/g, '\n' + reindent)
									 .replace(/\s*$/, '');
					}
					if (text) {
						multi_parser.print_token(text);
						multi_parser.print_newline(true, multi_parser.output);
					}
				}
				multi_parser.current_mode = 'TAG';
				break;
		}
		multi_parser.last_token = multi_parser.token_type;
		multi_parser.last_text = multi_parser.token_text;
	}
	return multi_parser.output.join('');
}



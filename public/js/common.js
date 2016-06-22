var Ajax = new Class({
	Extends: Request.JSON,

	options:{
		attach: null,
		disableElements: [],
		loadingTarget: null,	// shortcut of 'loading.target'
		loading:{
			target: null,
			text: ' ',
			theme: ''
		},
		noticeTarget: null,		// shortcut of 'notice.target'
		notice:{
			target: null,
			type: 'error',
			options: {
				stick: {
					position: 'center',
					edge: 'center'
				}
			}
		}
	},

	initialize: function(url, options){
		options.url = url;
		this.parent(options);
		if(typeOf(this.options.attach) === 'element')
			this.options.attach.addEvent('click', function(evt){
				this.fireEvent('send');
				if(!this.isRunning()) this.send();
			}.bind(this));

		var d = this.options.disableElements;
		if(d && d.length > 0)
			this.addEvents({
				'request': function(){ d.each(function(ele){ele.disable();});},
				'complete': function(){ d.each(function(ele){ele.enable();});}
			});

		var l = this.options.loading;
		if(!l.target) l.target = this.options.loadingTarget;
		if(l.target)
			this.addEvents({
				'request': function(){l.target.loading(l.text, l.theme)},
				'complete': function(){l.target.unloading()}
			});

		var n = this.options.notice;
		if(!n.target) n.target = this.options.noticeTarget || document.body;
		if(n.options) n.target.set('notice', n.options);
		this.notice = {
			success: n.target.success.bind(n.target),
			info: n.target.info.bind(n.target),
			warning: n.target.warning.bind(n.target),
			error: n.target.error.bind(n.target),
			clear: n.target.clearNotices.bind(n.target)
		};
		if(n.target) this.addEvent('request', this.notice.clear.bind(this.notice));
	},

	success: function(text){
		try {
			json = this.response.json = JSON.decode(text, this.options.secure);
		} catch (error){
			this.fireEvent('error', [text, error]);
			return;
		}
		if(json == null) this.onFailure();
		else{
			var code = json.code.toInt();
			if(code >= 400){
				var n = this.options.notice;
				n.target[n.type](json.message);
				this.onFailure();
			}
			else this.onSuccess(code, json.message, json.data);
		}
	}
});

var Constants = {J104: {}};
/********************************************************************************************************************************
 * J104: 104 JavaScript Library, Component and Framework (2.x)
 * Requires: 
 * - mootools core/more 1.5.1
 * - mbox0.2.6
 */
var J104 = (function(){
	/* -- private & static properties ----------------------------------------- */
	var __profile = {
		name: 'J104 (104 JavaScript Library, Component and Framework)',
		version: '2.0.0',
		base: 'mootools 1.5.1',
		description: '104 JavaScript Library, Component and Framework'
	};

	$(window).addEvent('keydown', function(evt){
		if(evt.key == 'backspace' && evt.target === document.body){
			evt.preventDefault();
			if(J104.debug) console.log('press "backspace" on document');
		}
	});

	return {
		debug: true,
		profile: function(){
			return Object.clone(__profile);
		}
	};
}());

/********************************************************************************************************************************
 * J104.Object
 */
J104.Object = (function(){
	/* -- private & static properties ----------------------------------------- */
	var __profile = {
		name: 'J104.Object',
		version: '2.0.0',
		lastModify: '2016/1/27'
	};
	var __name = __profile.name;

	/* -- private & static methods -------------------------------------------- */
	var _PROPERTIES = {__proto__: null};
	var _FLAGS = {__proto__: null};

	/*** -- Class ---------------------------------------------------------------------------------------------------------- ***/
	var obj = {
		Implements: [Options],
		profile: function(){ return Object.clone(__profile); },
		options: {},

		/** -- constructor -------------------------------------------------------------------------------------------------- **/
		initialize: function(options) {
			this.uid = String.uniqueID();
			_PROPERTIES[this.uid] = {};
			_FLAGS[this.uid] = {};
			this.setOptions(options);
		},

		/** -- protected methods -------------------------------------------------------------------------------------------- **/
		$P: function(){ return _PROPERTIES[this.uid]; }.protect(),
		$F: function(){ return _FLAGS[this.uid]; }.protect()

		/** -- public methods ----------------------------------------------------------------------------------------------- **/
	};

	if(J104.debug){	// for debug, $$ means allow access 'private member' from 'OUTSIDE' in debug mode
		obj.$$P = function(){ return _PROPERTIES[this.uid]; };
		obj.$$F = function(){ return _FLAGS[this.uid]; };
	}
	return new Class(obj);
}());



/********************************************************************************************************************************
 * J104.UIComponent
 */
J104.UIComponent = (function(){
	/* -- private & static properties ----------------------------------------- */
	var __profile = {
		name: 'J104.UIComponent',
		version: '2.0.0',
		lastModify: '2016/1/27'
	};
	var __name = __profile.name;

	/* -- private & static methods -------------------------------------------- */
	var _ID = {__proto__: null};
	var _DOM = {__proto__: null};

	/*** -- Class ---------------------------------------------------------------------------------------------------------- ***/
	var uicomponent = {
		Extends: J104.Object,
		Implements: [Events],
		profile: function(){ return Object.clone(__profile); },
		options: {
			onDestroy: function(_this){}
		},

		/** -- constructor -------------------------------------------------------------------------------------------------- **/
		initialize: function(options){
			this.parent(options);
			_ID[this.uid] = '';
			_DOM[this.uid] = {};
			var F = this.$F();
			F.available = true;
			F.destroy = false;
		},

		/** -- protected methods -------------------------------------------------------------------------------------------- **/
		$setId: function(id){
			if(typeOf(id) === 'string' || typeOf(id) === 'number')
				_ID[this.uid] = id + '';
		}.protect(),
		$D: function(){ return _DOM[this.uid]; }.protect(),

		/** -- public methods ----------------------------------------------------------------------------------------------- **/
		id: function(){
			return _ID[this.uid];
		},

		DOM: function(key){
			return _DOM[this.uid][key];
		},

		enable: function(){
			this.$F().available = true;
			return this;
		},

		disable: function(){
			this.$F().available = false;
			return this;
		},

		destroy: function(){
			Object.each(_DOM[this.uid], function(dom){
				dom.destroy();
			});
			_DOM[this.uid] = {};
			this.$F().destroy = true;
			this.fireEvent('destroy', [this]);
			return this;
		}
	};

	if(J104.debug){	// for debug, $$ means allow access 'private member' from 'OUTSIDE' in debug mode
		uicomponent.$$D = function(){ return _DOM[this.uid]; };
	}
	return new Class(uicomponent);
}());

/********************************************************************************************************************************
 * J104.ContextMenu
 */
J104.ContextMenu = (function(){
	/* -- private & static properties ----------------------------------------- */
	var __profile = {
		name: 'J104.ContextMenu',
		extends: 'J104.UIComponent',
		version: '2.0.0',
		lastModify: '2016/2/14'
	};
	var __name = __profile.name;
	var _x, _y;

	/* -- private & static methods -------------------------------------------- */
	var _buildMenu = function(D, options, content){
		D.wrapper = new Element('div.wrapper.an-250ms').addClass(options.css + (options.theme ?  ('-' + options.theme) : '')).hide();
		if(options.additionClass && typeOf(options.additionClass) === 'string') D.wrapper.addClass(options.additionClass);
		D.wrapper.inject(options.inject && typeOf(options.inject) === 'element' ? options.inject : document.body);
		if(typeOf(content) === 'element') content.inject(D.wrapper);
	};
	var _initEvents = function(_this, P){
		var F = _this.$F();
		var D = _this.$D()
		P.event = {};
		P.event.mouseDown = function(ev){
			if(ev.rightClick) return;
			var ext = (!_this.options.eventExt.mouseDown || typeOf(_this.options.eventExt.mouseDown) !== 'function') ?
				(function(){ return true }) : _this.options.eventExt.mouseDown;
			if(F.open && ev.target != D.wrapper && !D.wrapper.contains(ev.target) && ext(_this, ev) !== false){
				ev.preventDefault();
				_this.close();
			}
		}.bind(_this);
		P.event.keyDown = function(ev){
			if(ev.key === 'esc'){
				ev.preventDefault();
				_this.close();
			}
		}.bind(_this);
		P.event.resize = function(ev){ _this.position(); }.bind(_this);
	};
	var _attachEvents = function(P){
		$(document).addEvent('mousedown', P.event.mouseDown);
		$(document).addEvent('keydown', P.event.keyDown);
		if(P.stickTarget !== 'mouse')
			$(window).addEvent('resize', P.event.resize);
	};
	var _detachEvents = function(P){
		$(document).removeEvent('mousedown', P.event.mouseDown);
		$(document).removeEvent('keydown', P.event.keyDown);
		if(P.stickTarget !== 'mouse') $(window).removeEvent('resize', P.event.resize);
	};

	/*** -- Class ---------------------------------------------------------------------------------------------------------- ***/
	return new Class({
		Extends: J104.UIComponent,
		profile: function(){ return Object.clone(__profile); },
		options: {
			css: 'J104ContextMenu',
			theme: '',
			additionClass: '',
			inject: document.body,
			attach: null,					// DOM element
			stick: {
				target: 'mouse',			// 'mouse'(default), 'body'(html body) or DOM element
				direction: 'auto',			// 'auto'(default), 'center', 'ver(vertical)', 'hor(horizontal)', 'top', 'bottom', 'left', 'right'
				align: {
					ver: 'center',			// 'center'(default), 'top', 'bottom'
					hor: 'center'			// 'center'(default), 'left', 'right'
				},
				offset: {
					x: 0,
					y: 0
				}
			},
			eventExt: {
				mouseDown: function(_this, evt){ return true; }
			},
			onBeforeOpen: function(_this){},
			onOpen: function(_this){},
			onBeforeClose: function(_this){},
			onClose: function(_this){}
		},

		/** -- constructor -------------------------------------------------------------------------------------------------- **/
		initialize: function(content, options){
			content = $(content);
			if(typeOf(content) !== 'element') throw new Error('[' + __name + '] can not find element: ' + content);

			this.parent(options);
			var D = this.$D(), P = this.$P();
			P.content = content;
			_buildMenu(D, this.options, content);
			_initEvents(this, P);
			P.stickTarget = this.options.stick.target === 'body' ? document.body : typeOf(this.options.stick.target) === 'element' ? this.options.stick.target : 'mouse';
			if(P.stickTarget === 'mouse'){
				$(document).addEvent('mousemove', function(ev){
					_x = ev.page.x;
					_y = ev.page.y;
				});
			}
			else P.stickTarget.addEvent('click', this.open.bind(this));
		},

		/** -- protected methods -------------------------------------------------------------------------------------------- **/

		/** -- public methods ----------------------------------------------------------------------------------------------- **/
		open: function(){
			var F = this.$F();
			if(F.open) return this;

			this.fireEvent('beforeOpen', [this]);
			var D = this.$D(), P = this.$P();
			P.content.inject(D.wrapper);
			D.wrapper.show().addClass('an-zoomInEnlarge');
			F.open = true;

			_attachEvents(P);

			// position ...
			if(P.stickTarget === 'mouse') D.wrapper.setStyles({position: 'absolute', top: _y, left: _x});
			else this.position();

			this.fireEvent('open', [this]);
			return this;
		},

		position: function(){
			var F = this.$F(), D = this.$D(), P = this.$P();
			if(!F.open) return this;

			var position = 'center', edge = 'center';
			var winSize = window.getSize(), wrapperSize = D.wrapper.getSize(), space = P.stickTarget.getDirectionSpace();
			var stick = this.options.stick;
			if(stick.direction === 'center'){
				position = 'center';
				edge = 'center';
			}
			else if(stick.direction === 'top'){
				position = 'top' + stick.align.hor;
				edge = 'bottom' + stick.align.hor;
			}
			else if(stick.direction === 'bottom'){
				position = 'bottom' + stick.align.hor;
				edge = 'top' + stick.align.hor;
			}
			else if(stick.direction === 'left'){
				position = stick.align.ver + 'left';
				edge = stick.align.ver + 'right';
			}
			else if(stick.direction === 'right'){
				position = stick.align.ver + 'right';
				edge = stick.align.ver + 'left';
			}
			else if(stick.direction === 'ver' || stick.direction === 'vertical'){
				position = (space.top > space.bottom ? 'top' : 'bottom') + stick.align.hor;
				edge = (space.top > space.bottom ? 'bottom' : 'top') + stick.align.hor;
			}
			else if(stick.direction === 'hor' || stick.direction === 'horizontal'){
				position = stick.align.ver + (space.right > space.left ? 'right' : 'left');
				edge = stick.align.ver + (space.right > space.left ? 'left' : 'right');
			}
			else if(stick.direction === 'auto'){
				var x = wrapperSize.x, y = wrapperSize.y;
				if(y > space.top && y > space.bottom && x > space.left && x > space.right){
					position = 'center';
					edge = 'center';
				}
				else{
					var ver = space.top > space.bottom ? space.top : space.bottom;
					var hor = space.left > space.right ? space.left : space.right;
					if((ver / y) > (hor / x)){
						position = (space.top > space.bottom ? 'top' : 'bottom') + stick.align.hor;
						edge = (space.top > space.bottom ? 'bottom' : 'top') + stick.align.hor;
					}
					else{
						position = stick.align.ver + (space.right > space.left ? 'right' : 'left');
						edge = stick.align.ver + (space.right > space.left ? 'left' : 'right');
					}
				}
			}
			D.wrapper.position({
				relativeTo: P.stickTarget,
				position: position,
				edge: edge,
				allowNegative: false,
				maximum: {
					x: winSize.x > wrapperSize.x ? winSize.x - wrapperSize.x : winSize.x,
					y: winSize.y > wrapperSize.y ? winSize.y - wrapperSize.y : winSize.y
				},
				offset: this.options.stick.offset
			});

			// fix positions
			/*(function(){
				w = D.wrapper.getSize();
				if(w.x !== wrapperSize.x || w.y !== wrapperSize.y)
					D.wrapper.position({
						relativeTo: P.stickTarget,
						position: position,
						edge: edge,
						allowNegative: false,
						maximum: {
							x: winSize.x > w.x ? winSize.x - w.x : winSize.x,
							y: winSize.y > w.y ? winSize.y - w.y : winSize.y
						},
						offset: this.options.stick.offset
					});
			}).delay(251, this);*/
			return this;
		},

		close: function(){
			var F = this.$F();
			if(!F.open) return this;

			this.fireEvent('beforeClose', [this]);
			var D = this.$D(), P = this.$P();
			D.wrapper.hide();

			_detachEvents(P);

			F.open = false;
			this.fireEvent('close', [this]);
			return this;
		}
	});
}());

/********************************************************************************************************************************
 * J104.Utils
 */
J104.Utils = {
	htmlEncode: function (html) { return typeOf(html) == 'string' ? html.htmlEncode() : html; },
	htmlDecode: function (text) { return typeOf(text) == 'string' ? text.htmlDecode() : text; },

	/** comparator
	 * callback function for native JavaScript array sorting method ([].sort()) to sort object
	 * binds object with 'prop' & 'isAsc' properties, ex: {prop:'xxx', isAsc:true}
	 */
	comparator: function(o1, o2){
		if(typeOf(o1) == 'number' || typeOf(o1) == 'date'){
			var v = this.isAsc ? o1 - o2 : o2 - o1;
			return v == 0 ? 0 : v > 0 ? 1 : -1;
		}
		else if(typeOf(o1) == 'boolean'){
			return o1 == o2 ? 0 : this.isAsc ? (o1 ? 1 : -1) : (!o1 ? 1 : -1);
		}
		else if(typeOf(o1) == 'string'){
			var a = o1.toLowerCase();
			var b = o2.toLowerCase();
			if(!isNaN(Number(a)) && !isNaN(Number(b))){
				var v =  this.isAsc ? (a.toFloat() - b.toFloat()) : (b.toFloat() - a.toFloat());
				return v == 0 ? 0 : v > 0 ? 1 : -1;
			}
			else return this.isAsc ? (a < b ? -1 : a > b ? 1 : 0) : (a < b ? 1 : a > b ? -1 : 0);
		}
		else if(typeOf(o1) == 'array'){
			var value1 = o1[this.prop];
			var value2 = o2[this.prop];
			if(typeOf(value1) == 'number' || typeOf(value1) == 'date'){
				v = this.isAsc ? value1 - value2 : value2 - value1;
				return v == 0 ? 0 : v > 0 ? 1 : -1;
			}
			else if(typeOf(value1) == 'boolean'){
				return value1 == value2 ? 0 : this.isAsc ? (value1 ? 1 : -1) : (!value1 ? 1 : -1);
			}
			else {
				var a = value1 == null ? '' : value1.toLowerCase();
				var b = value2 == null ? '' : value2.toLowerCase();
				if(!isNaN(Number(a)) && !isNaN(Number(b))){
					var v =  this.isAsc ? (a.toFloat() - b.toFloat()) : (b.toFloat() - a.toFloat());
					return v == 0 ? 0 : v > 0 ? 1 : -1;
				}
				else return this.isAsc ? (a < b ? -1 : a > b ? 1 : 0) : (a < b ? 1 : a > b ? -1 : 0);
			}
		}
		else if(typeOf(o1) == 'object'){
			if(!this.prop) return 0;
			var value1 = o1[this.prop];
			var value2 = o2[this.prop];
			if(typeOf(value1) == 'number' || typeOf(value1) == 'date'){
				var v = this.isAsc ? value1 - value2 : value2 - value1;
				return v == 0 ? 0 : v > 0 ? 1 : -1;
			}
			else if(typeOf(value1) == 'boolean'){
				return value1 == value2 ? 0 : this.isAsc ? (value1 ? 1 : -1) : (!value1 ? 1 : -1);
			}
			else {
				var a = value1 == null ? '' : value1.toLowerCase();
				var b = value2 == null ? '' : value2.toLowerCase();
				if(!isNaN(Number(a)) && !isNaN(Number(b))){
					var v =  this.isAsc ? (a.toFloat() - b.toFloat()) : (b.toFloat() - a.toFloat());
					return v == 0 ? 0 : v > 0 ? 1 : -1;
				}
				else return this.isAsc ? (a < b ? -1 : a > b ? 1 : 0) : (a < b ? 1 : a > b ? -1 : 0);
			}
		}
		else return 0;
	},

	setDOMText: function(data, target, prefix){
		if(typeOf(prefix) == 'string') prefix += '.';
		else prefix = '';
		if(!target || !$(target)) target = document.body;
		for(var prop in data){
			var type = typeOf(data[prop]);
			if(type == 'string' || type == 'number' || type == 'date' || type == 'boolean'){
				$(target).getElements('[id=' + prefix + prop + ']').each(function(ele){
					ele.empty();
					var options = ele.get('e104domtext');		// 以後擴充功能寫這
					if(options == 'html') ele.set('html', data[prop]);
					else ele.set('text', data[prop]);
				});
			}
			else if(type == 'object') J104.Utils.setDOMText(data[prop], target, prop);
		}
	},

	/** partialEqual
	 * var a = {x:1, y:2}; var b = {x:1, y:2, z:3}
	 * J104.Utils.partialEqual(a, b) ==> return true!
	 * J104.Utils.partialEqual(b, a) ==> return false!
	 */
	partialEqual: function(a, b, properties){
		if(a === b) return true;
		else if(typeOf(a) != 'object' || typeOf(b) != 'object') return false;

		var compareKeys = Object.keys(a);
		if(typeOf(properties) == 'string') compareKeys = compareKeys.contains(properties) ? [properties] : null;
		else if(typeOf(properties) == 'array') compareKeys = properties.filter(function(prop){ return compareKeys.contains(prop); });

		return compareKeys.every(function(key){ return b[key] != null && J104.Utils.partialEqual(a[key], b[key]); });
	}
};



/*** mootools extension ***********************************************************************************************/
JSON.secure = false;

Element.Properties.notiece

Element.implement({
	$: function(str){
		return $(this).getElement('[id=' + str + ']') || ($(this).getElements(str) && $(this).getElements(str)[0]);
	},

	destroyChildren: function(){
		var ele = $(this);
		ele.getChildren().each(function(child){ child.destroy(); });
		return ele.empty();
	},

	enable: function(){
		var ele = $(this);
		if(['button', 'textarea'].contains(ele.get('tag'))) ele.disabled = false;
		return ele.removeClass('disable');
	},

	disable: function(){
		var ele = $(this);
		if(['button', 'textarea'].contains(ele.get('tag'))) ele.disabled = true;
		return ele.addClass('disable');
	},

	mask: function(theme){
		if(!theme || typeOf(theme) !== 'string' || theme === '') theme = 'light';
		var mask = this.retrieve('J104.MASK');
		if(!mask){
			mask = new Mask(this, {
				'class': 'J104Mask-' + theme,
				inject: {where: 'inside'}
			});
			this.store('J104.MASK', mask);
		}
		else if(!mask.element.hasClass('J104Mask-' + theme)){
			mask.element.removeProperty('class').addClass('J104Mask-' + theme);
		}
		mask.show();
		return this;
	},

	unmask: function(){
		var mask = this.retrieve('J104.MASK');
		if(mask) mask.hide();
		return this;
	},

	loading: function(message, theme){
		if(!message || typeOf(message) !== 'string' || message === '') message = 'loading...';
		if(!theme || typeOf(theme) !== 'string' || theme === '') theme = 'light';
		var loading = this.retrieve('J104.LOADING');
		if(!loading){
			loading = new Spinner(this, {
				'class': 'J104Loading-' + theme,
				content: new Element('div'),
				message: new Element('div', {'class': 'msg'}),
				img: false,
				inject: {where: 'inside'},
				fxOptions: {duration:10},
			});
			this.store('J104.LOADING', loading);
		}
		else if(!loading.element.hasClass('J104Mask-' + theme)){
			loading.element.removeProperty('class').addClass('J104Loading-' + theme);
		}
		loading.msg.set('text', message);
		loading.show();
		return this;
	},

	unloading: function(){
		var loading = this.retrieve('J104.LOADING');
		if(loading) loading.hide();
		return this;
	},
	
	getDirectionSpace: function(){		// return ex:{10, 20, 30, 40}
		var spaces = {};
		var winSize = window.getSize();
		var coor = $(this).getCoordinates();
		var docScroll = document.getScroll();
		spaces.top = coor.top - docScroll.y;
		spaces.right = docScroll.x + winSize.x - coor.left - coor.width;
		spaces.bottom = docScroll.y + winSize.y - coor.top - coor.height;
		spaces.left = coor.left - docScroll.x;
		return spaces;
	}
});

String.implement({
	replaceAll: function(find, replace){
		return this.replace(new RegExp(find, 'g'), replace);
	},

	escapeHtml: function(){
		return this.replaceAll('<', '&lt;').replaceAll('>', '&gt;');
	},

	htmlEncode: function(){
		var temp = document.createElement("div");
		(temp.textContent != null) ? (temp.textContent = this) : (temp.innerText = this);
		var output = temp.innerHTML;
		temp.destroy();
		return output;
	},

	htmlDecode: function(){
		var temp = document.createElement("div");
		temp.innerHTML = this;
		var output = temp.innerText || temp.textContent;
		temp.destroy();
		return output;
	}
});

Request.File = new Class({
	Extends: Request,
	options: {
		emulation: false,
		urlEncoded: false
	},

	initialize: function(options){
		this.xhr = new Browser.Request();
		this.formData = new FormData();
		this.setOptions(options);
		this.headers = this.options.headers;
	},

	append: function(key, value){
		this.formData.append(key, value);
		return this.formData;
	},

	reset: function(){
		this.formData = new FormData();
	},

	send: function(options){
		if(!this.check(options)) return this;

		this.options.isSuccess = this.options.isSuccess || this.isSuccess;
		this.running = true;

		var xhr = this.xhr;
		if('onprogress' in new Browser.Request){
			xhr.onloadstart = this.loadstart.bind(this);
			xhr.onprogress = this.progress.bind(this);
			xhr.upload.onprogress = this.progress.bind(this);
		}

		xhr.open('POST', this.options.url, true);
		xhr.onreadystatechange = this.onStateChange.bind(this);

		Object.each(this.headers, function(value, key){
			try{
				xhr.setRequestHeader(key, value);
			}
			catch(e){
				this.fireEvent('exception', [key, value]);
			}
		}, this);

		this.fireEvent('request');
		xhr.send(this.formData);

		if(!this.options.async) this.onStateChange();
		if(this.options.timeout) this.timer = this.timeout.delay(this.options.timeout, this);
		return this;
	}
});

// others ...................................................................
var ScrollSpy = new Class({
	Implements: [Options,Events],

	options: {
		container: window,
		max: 0,
		min: 0,
		mode: 'vertical'/*,
		 onEnter: $empty,
		 onLeave: $empty,
		 onScroll: $empty,
		 onTick: $empty
		 */
	},

	initialize: function(options) {
		this.setOptions(options);
		this.container = document.id(this.options.container);
		this.enters = this.leaves = 0;
		this.inside = false;

		this.listener = function(e) {
			var position = this.container.getScroll(), xy = position[this.options.mode == 'vertical' ? 'y' : 'x'];
			if(xy >= this.options.min && (this.options.max == 0 || xy <= this.options.max)) {
				if(!this.inside) {
					this.inside = true;
					this.enters++;
					this.fireEvent('enter', [position, this.enters, e]);
				}
				this.fireEvent('tick', [position, this.inside, this.enters, this.leaves, e]);
			}
			else if(this.inside){
				this.inside = false;
				this.leaves++;
				this.fireEvent('leave', [position, this.leaves, e]);
			}
			this.fireEvent('scroll', [position, this.inside, this.enters, this.leaves, e]);
		}.bind(this);

		this.start();
	},

	start: function() {
		this.container.addEvent('scroll', this.listener);
	},

	stop: function() {
		this.container.removeEvent('scroll', this.listener);
	}
});

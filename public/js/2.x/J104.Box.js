/********************************************************************************************************************************
 * J104.Box
 */
Constants.J104.Box = {};
J104.Box = (function(){
	/* -- private & static properties ----------------------------------------- */
	var __profile = {
		name: 'J104.Box',
		extends: 'J104.UIComponent',
		version: '2.0.1',
		lastModify: '2016/4/28'
	};
	var __name = __profile.name;
	var _x, _y;

	/* -- private & static methods -------------------------------------------- */
	var _build = function(_this){
		var D = _this.$D();
		var P = _this.$P();
		var options = _this.options;

		// wrapper ...
		if(![100, 250, 500, 750, 1000].contains(options.fxDuration.toInt())) options.fxDuration = 250;
		var wrapper = D.wrapper = new Element('div.wrapper.an-' + options.fxDuration + 'ms').addClass(options.css + (options.theme ?  ('-' + options.theme) : '')).hide();
		if(options.additionClass && typeOf(options.additionClass) === 'string') D.wrapper.addClass(options.additionClass);
		wrapper.setStyle('zIndex', P.level * 1000).inject(P.parent);

		// container & pointer ...
		var container = D.container = new Element('div.container').inject(wrapper);
		if(options.pointer) D.pointer = new Element('div.pointer').inject(wrapper);

		// header(optional) ...
		if(options.header) _this.$setHeader(options.header);

		// body ...
		var body = D.body = new Element('div.body').inject(container);
		_this.$setBody(options.content);

		// footer(optional) ...
		if(options.footer) _this.$setFooter(options.footer);

		return _this;
	};
	var _updateBoxDimension = function(_this){
		var D = _this.$D();
		var P = _this.$P();
		return _updateBoxDimension1(D, P, _this);
	};
	var _updateBoxDimension1 = function(D, P, _this){
		var w = _this.options.width;
		var h = _this.options.height;
		if(!D.wrapper.isVisible()){
			D.wrapper.show();
			var needHide = true;
		}
		var parent = P.parent;
		if(w && w !== 'auto'){
			if(typeOf(w) === 'array' || (typeOf(w) === 'string' && w.lastIndexOf('%') === w.length - 1)){
				var w0, min = -1, max = -1;
				if(typeOf(w) === 'array'){
					w0 = w[0].toInt();
					min = w[1].toInt();
					max = w[2].toInt();
				}
				else w0 = w.toInt();
				w = (parent.getSize().x * w0 / 100).toInt();
				if(min && min > 0 && w < min) w = min;
				if(max && max > 0 && w > max) w = max;
			}
			var cs = D.container.getComputedSize();
			D.body.setStyle('width', w - cs.computedLeft - cs.computedRight);
		}
		if(h && h !== 'auto'){
			if(typeOf(h) === 'array' || (typeOf(h) === 'string' && h.lastIndexOf('%') === h.length - 1)){
				var h0, min = -1, max = -1;
				if(typeOf(h) === 'array'){
					h0 = h[0].toInt();
					min = h[1].toInt();
					max = h[2].toInt();
				}
				else h0 = h.toInt();
				h = (parent.getSize().y * h0 / 100).toInt();
				if(min && min > 0 && h < min) h = min;
				if(max && max > 0 && h > max) h = max;
			}
			var h1 = D.header ? D.header.getSize().y : 0;
			var h2 = D.footer ? D.footer.getSize().y : 0;
			var cs = D.container.getComputedSize();
			D.body.setStyle('height', h - h1 - h2 - cs.computedTop - cs.computedBottom);
		}
		P.size = D.wrapper.getSize();
		if(needHide) D.wrapper.hide();
	};
	var _initEvents = function(_this){
		var F = _this.$F();
		var D = _this.$D();
		var P = _this.$P();
		var closeOn = _this.options.closeOn;
		P.event = {};
		P.event.keyUp = function(ev){
			if(closeOn.esc && ev.key === 'esc'){
				ev.preventDefault();
				_this.close();
			}
		};
		P.event.mouseUp = function(ev){
			if(!F.open || ev.rightClick) return;
			if(P.level < J104.Box.topLevel()) return;
			var t = ev.target;
			if(closeOn.click === true && t !== P.attach){
				ev.preventDefault();
				return _this.close();
			}
			else{
				var click = closeOn.click;
				if(typeOf(click) !== 'object') return;
				if(click.box && t !== P.attach && (t === D.wrapper || D.wrapper.contains(t))){
					ev.preventDefault();
					return _this.close();
				}
				if(click.body && t !== P.attach && t !== D.wrapper && !D.wrapper.contains(t)){
					ev.preventDefault();
					return _this.close();
				}
			}
		};
		P.event.mouseMove = function(ev){
			_x = ev.page.x;
			_y = ev.page.y;
			if(P.stickTarget === 'mouse') _this.position();
		};
		P.event.resize = function(ev){
			_this.position();
		};
	};
	var _attachEvents = function(P){
		$(document).addEvent('keyup', P.event.keyUp);
		$(document).addEvent('mouseup', P.event.mouseUp);
		if(P.stickTarget !== 'mouse') $(window).addEvent('resize', P.event.resize);
		else $(document).addEvent('mousemove', P.event.mouseMove);
		if(P.scrollListening) P.scrollListening.addEvent('scroll', P.event.resize);
	};
	var _detachEvents = function(P){
		$(document).removeEvent('keyup', P.event.keyUp);
		$(document).removeEvent('mouseup', P.event.mouseUp);
		if(P.stickTarget !== 'mouse') $(window).removeEvent('resize', P.event.resize);
		else $(document).removeEvent('mousemove', P.event.mouseMove);
		if(P.scrollListening) P.scrollListening.removeEvent('scroll', P.event.resize);
	};
	var _setContent = function(_this, part, content){
		var D = _this.$D();
		var part = D[part];
		if(typeOf(content) === 'string') part.set('text', content);
		else if(typeOf(content) === 'element'){
			part.destroyChildren().empty();
			content.inject(part);
		}
		_updateBoxDimension(_this);
		return _this;
	};
	var _normalizePosition = function(str){
		if(typeOf(str) === 'string'){
			str = str.toLowerCase();
			if(str === 'top') return {x:'center', y:'top'};
			else if(str === 'bottom') return {x:'center', y:'bottom'};
			else if(str === 'left') return {x:'left', y:'center'};
			else if(str === 'right') return {x:'right', y:'center'};
			else if(str === 'topleft') return {x:'left', y:'top'};
			else if(str === 'topright') return {x:'right', y:'top'};
			else if(str === 'bottomleft') return {x:'left', y:'bottom'};
			else if(str === 'bottomright') return {x:'right', y:'bottom'};
			else return {x:'center', y:'center'};
		}
		else if(typeOf(str) !== 'object') return {x:'center', y:'bottom'};		// stickTarget === 'mouse'
	};
	var _calPointer = function(pos, edge, pointer){
		var x = pos.x === 'center' || edge.x === 'center' || pos.x === edge.x;
		var y = pos.y === 'center' || edge.y === 'center' || pos.y === edge.y;
		if((x && y) || (!x && !y)) return false;

		var align = pointer === true ? 0 : pointer[0];
		var offset = pointer === true ? 0 : pointer[1];
		return {
			direct: x ? (pos.y === 'top' ? 'bottom' : 'top') : (pos.x === 'left' ? 'right' : 'left'),
			position: x ?
				{x: align === 0 ? 'center' : align === '+' ? 'right' : 'left', y: edge.y} :
				{x: edge.x, y: align == 0 ? 'center' : align === '+' ? 'bottom' : 'top'},
			edge: x ?
				{x: align === 0 ? 'center' : align === '+' ? 'right' : 'left', y: pos.y} :
				{x: pos.x, y: align == 0 ? 'center' : align === '+' ? 'bottom' : 'top'},
			offset: x ? {x: offset} : {y: offset}
		};
	};

	/*** -- Class ---------------------------------------------------------------------------------------------------------- ***/
	return new Class({
		Extends: J104.UIComponent,
		profile: function(){ return Object.clone(__profile); },
		options: {
			css: 'J104Box',
			theme: '',
			additionClass: '',
			inject: document.body,			// Element; the box's parent.
			scrollListening: null,			// Element; (monitor scrolling like handle 'resize' event)
			boundary: true,					// Boolean; limit box display region(parent)
			content: '',					// String or Element;
			header: null,					// null, String or Element;
			footer: null,					// null, String or Element;
			load: {							// false or Object; load content by ajax.
				url: '',					// the url to load the content.
				reload: false				// reloads the content each time the box is opened.
			},
			width: 'auto',					// 'auto'(default), numeric, or array: [percentage, min, max];
			height: 'auto',					// the same as 'width'
			attach: null,
			event: 'click',					// {'click', 'mouseover', 'mouseenter'}
			stick: {						// 'mouse', Element or Object;
				target: $(window),			// 'mouse' or Element;
				position: 'center',
				edge: 'center',
				offset: {
					x: 0,
					y: 0
				}
			},
			closeOn: {
				esc: true,					// true
				click: {					// false or object
					box: false,
					body: true
				}
			},
			level: 1,						// box layer level, (>=1)
			modal: false,					// if true or string(mask theme: ['light', 'dark', 'gray', 'transparent']), will put a overlay(mask) between Box and it's parent ...
			pointer: false,					// false(default), true, or array: [position, offset] (position:['-', 0, '+'], offset:numeric)
			fx: 'zoom',						// effect of open/close the box, {'zoom'(default), 'fade', 'tada'}
			fxDuration: 250,				// duration of effect (ms), {100, 250, 500, 750, 1000}
			audio: true,					// Boolean or string(...)
			onBeforeOpen: function(_this){},
			onOpen: function(_this){},
			onBeforeClose: function(_this){},
			onClose: function(_this){}
		},

		/** -- constructor -------------------------------------------------------------------------------------------------- **/
		initialize: function(options) {
			this.parent(options);
			var P = this.$P();
			var D = this.$D();
			P.parent = typeOf(this.options.inject) === 'element' ? this.options.inject : document.body;
			if(this.options.scrollListening && typeOf(this.options.scrollListening) === 'element')
				P.scrollListening = this.options.scrollListening;
			var level = this.options.level.toInt();
			P.level = typeOf(level) === 'number' && level > 0 ? level : 1;
			if(this.options.modal){
				P.mask = new Mask(P.parent, {
					'class': 'J104Mask-' + (this.options.modal === true ? 'light' : this.options.modal),
					inject: {where: 'inside'}
				});
				P.mask.element.setStyle('zIndex', P.level * 1000 - 1);
			}
			if(typeOf(this.options.stick) !== 'object'){
				var s = {target: this.options.stick};
				this.options.stick = s;
			}
			P.stickTarget = this.options.stick.target === 'mouse' ? 'mouse' : typeOf(this.options.stick.target) === 'element' ? this.options.stick.target : document.body;
			this.options.stick.position = _normalizePosition(this.options.stick.position);
			this.options.stick.edge = _normalizePosition(this.options.stick.edge);
			if(this.options.attach && typeOf(this.options.attach) === 'element'){
				var event = ['click', 'mouseover', 'mouseenter'].contains(this.options.event) ? this.options.event : 'click';
				P.attach = this.options.attach.addEvent(event, function(ev){
					_x = ev.page.x;
					_y = ev.page.y;
					this.open();
				}.bind(this));
				if(event === 'mouseover' || event === 'mouseenter')
					P.attach.addEvent(event === 'mouseover' ? 'mouseout' : 'mouseleave', function(ev){
						if(!D.wrapper.contains(ev.event.relatedTarget)) this.close();
					}.bind(this));
			}
			if(this.options.load && this.options.load.url) this.$F().loadContentByAjax = true;
			// FX ....
			if(this.options.fx === 'fade'){
				P.openFX = 'an-fadeInDown';
				P.closeFX = 'an-fadeOutDown';
			}
			else if(this.options.fx === 'tada'){
				P.openFX = 'an-tada';
				P.closeFX = 'an-zoomOutShrink';
			}
			else{
				P.openFX = 'an-zoomInEnlarge';
				P.closeFX = 'an-zoomOutShrink';
			}
			P.audio = {};
			if(this.options.audio){
				P.audio.opening = new Audio('/js/2.x/asset/jump12.mp3');		// TODO: temp ...
				P.audio.opening.volume = .3;
			}
			_build(this);
			_initEvents(this);
			J104.Box.instances.push(this);
		},

		/** -- protected methods -------------------------------------------------------------------------------------------- **/
		$setHeader: function(header){
			var D = this.$D();
			if(!D.header) D.header = new Element('div.header').inject(D.container, 'top');
			return _setContent(this, 'header', header);
		}.protect(),

		$setBody: function(body){ return _setContent(this, 'body', body); }.protect(),

		$setFooter: function(footer){
			var D = this.$D();
			if(!D.footer) D.footer = new Element('div.footer').inject(D.container, 'bottom');
			return _setContent(this, 'footer', footer);
		}.protect(),

		/** -- public methods ----------------------------------------------------------------------------------------------- **/
		enable: function(){
			this.$F().available = true;
			return this;
		},
		disable: function(){
			this.$F().available = false;
			return this;
		},
		getDimensions: function(){
			return this.$D().wrapper.getDimensions();
		},
		getLevel: function(){ return this.$P().level; },
		isOpen: function(){ return this.$F().open; },

		setContent: function(content){		// string or element
			var F = this.$F();
			if(F.destroy) return this;
			_setContent(this, 'body', content);
			if(F.open) this.position();
			return this;
		},

		setHtml: function(html){
			if(this.$F().destroy) return this;
			if(html && typeOf(html) === 'string'){
				var D = this.$D();
				D.body.set('html', html.stripScripts());
				_updateBoxDimension(this);
				this.position();
			}
			return this;
		},

		// load content by ajax
		loadContent: function(url, options){
			var P = this.$P();
			var D = this.$D();
			if(!P.xhr) {
				P.xhr = new Request.HTML({
					method: 'get',
					link: 'cancel',
					update: D.body,
					onRequest: function(){
						var loading = D.body.retrieve('J104.LOADING');
						if(loading) loading.element.inject(D.body, 'after');
						D.body.destroyChildren();
						if(loading) loading.element.inject(D.body);
						D.body.loading('loading ...', 'light');
					},
					onComplete: function(){
						_updateBoxDimension1(D, P, this);
						this.position();
						D.body.unloading();
					}.bind(this),
					onFailure: function(xhr){
						D.body.unloading();
						// TODO: notice failure ...
					},
					onTimeout: function(){
						D.body.unloading();
						// TODO: notice timeout ...
					}
				});
			}
			P.xhr.send(Object.merge({}, options, {url: url}));
		},

		open: function(){
			var F = this.$F();
			if(!F.available || F.destroy || F.open) return this;

			this.fireEvent('beforeOpen', [this]);
			var D = this.$D(), P = this.$P();
			if(P.mask){
				P.mask.show();
				P.parent.addClass('J104BoxLockScroll');
			}

			D.wrapper.removeClass(P.closeFX).show();
			if(P.audio.opening) P.audio.opening.play();
			this.position();
			D.wrapper.addClass(P.openFX);
			F.open = true;
			_attachEvents(P);

			(function(){
				if(!F.open) return;
				if(F.loadContentByAjax && (!F.ajaxLoaded || this.options.load.reload)){
					this.loadContent(this.options.load.url);
					F.ajaxLoaded = true;
				}
				this.fireEvent('open', [this]);
			}).delay(this.options.fxDuration, this);
			return this;
		},

		position: function(){
			var F = this.$F(), D = this.$D(), P = this.$P();
			if(F.destroy) return this;

			// pointer handle ...
			if(this.options.pointer && !D.pointer.retrieve('positionOk')){
				var pointer = _calPointer(this.options.stick.position, this.options.stick.edge, this.options.pointer);
				if(pointer){
					D.pointer.addClass(pointer.direct);
					D.wrapper.setStyle('margin-' + pointer.direct, D.pointer.getSize()[['left', 'right'].contains(pointer.direct) ? 'x' : 'y']);
					D.pointer.position({
						relativeTo: D.container,
						position: pointer.position,
						edge: pointer.edge,
						offset: pointer.offset
					}).store('positionOk', true);
				}
				else D.pointer.hide();
			}

			if(P.stickTarget === 'mouse'){
				var edge = this.options.stick.edge;
				if(edge.x === 'center' && ['top', 'center', 'bottom'].contains(edge.y)) _x -= P.size.x / 2;
				else if(edge.x === 'right' && ['top', 'center', 'bottom'].contains(edge.y)) _x -= P.size.x;
				if(edge.y === 'center' && ['left', 'center', 'right'].contains(edge.x)) _y -= P.size.y / 2;
				else if(edge.y === 'bottom' && ['left', 'center', 'right'].contains(edge.x)) _y -= P.size.y;
				if(!this.options.stick.offset)
					this.options.stick.offset = {
						x: edge.x === 'left' ? 8 : edge.x === 'right' ? -8 : 0,
						y: edge.y === 'top' ? 8 : edge.y === 'bottom' ? -8 : 0
					}
				if(this.options.stick.offset && this.options.stick.offset.x) _x += this.options.stick.offset.x;
				if(this.options.stick.offset && this.options.stick.offset.y) _y += this.options.stick.offset.y;
				D.wrapper.setStyles({position: 'absolute', top: _y, left: _x});
			}
			else{
				var opt = {
					relativeTo: P.stickTarget,
					position: this.options.stick.position,
					edge: this.options.stick.edge,
					allowNegative: false,
					offset: this.options.stick.offset
				};
				if(this.options.boundary){
					var boundary = P.parent.getSize();
					Object.merge(opt, {
						maximum: {
							x: boundary.x > P.size.x ? boundary.x - P.size.x : boundary.x,
							y: boundary.y > P.size.y ? boundary.y - P.size.y : boundary.y
						}
					})
				}
				D.wrapper.position(opt);
			}
			return this;
		},
		
		close: function(){
			var F = this.$F();
			if(F.destroy || !F.open) return this;

			this.fireEvent('beforeClose', [this]);
			var D = this.$D(), P = this.$P();
			D.wrapper.removeClass(P.openFX).addClass(P.closeFX);
			F.open = false;
			_detachEvents(P);

			(function(){
				if(F.open) return;
				D.wrapper.hide();
				if(P.mask){
					P.mask.hide.delay(250, P.mask);
					P.parent.removeClass('J104BoxLockScroll');
				}
				this.fireEvent('close', [this]);
			}).delay(this.options.fxDuration, this);
			return this;
		},

		destroy: function(){
			_detachEvents(this.$P());
			J104.Box.instances.erase(this);
			return this.parent();
		}
	});
})();

J104.Box.instances = [];
J104.Box.topLevel = function(){
	var top = 0;
	J104.Box.instances.each(function(box){
		var level = box.getLevel();
		if(box.isOpen() && level > top) top = level;
	});
	return top;
};



/********************************************************************************************************************************
 * J104.Box.Tip
 */
//Constants.J104.Box.Tip = {};
J104.Box.Tip = (function(){
	/* -- private & static properties ----------------------------------------- */
	var __profile = {
		name: 'J104.Box.Tip',
		extends: 'J104.Box',
		version: '2.0.0',
		lastModify: '2016/4/3'
	};
	var __name = __profile.name;

	/* -- private & static methods -------------------------------------------- */

	/*** -- Class ---------------------------------------------------------------------------------------------------------- ***/
	return new Class({
		Extends: J104.Box,
		profile: function(){ return Object.clone(__profile); },
		options: {
			css: 'J104BoxTip',
			theme: '',
			additionClass: '',
			event: 'mouseenter',
			boundary: false,
			level: 9,
			pointer: true,
			stick: {
				direction: 'ver',	// 'auto', 'ver(vertical) (default)', 'hor(horizontal)', 'top', 'bottom', 'left', 'right'
				align: 0			// {'-', 0, '+'}
			},
			closeOn: {
				esc: false
			}
		},

		/** -- constructor -------------------------------------------------------------------------------------------------- **/
		initialize: function(ele, options){
			if(!options) options = {};
			if(!options.attach) options.attach = ele;
			if(!options.stick) options.stick = {};
			if(!options.stick.target) options.stick.target = ele;
			this.parent(options);

			var D = this.$D(), P = this.$P();
			if(['mouseover', 'mouseenter'].contains(this.options.event))
				D.wrapper.addEvent('mouseleave', function(ev){
					if(!P.attach.contains(ev.event.relatedTarget)) this.close();
				}.bind(this));
		},

		/** -- protected methods -------------------------------------------------------------------------------------------- **/

		/** -- public methods ----------------------------------------------------------------------------------------------- **/
		open: function(){
			var P = this.$P(), D = this.$D();
			if(P.stickTarget === 'mouse'){
				P.openFX = 'an-zoomInEnlarge';
				P.closeFX = 'an-zoomOutShrink';
			}
			else {
				['Up', 'Down', 'Left', 'Right'].each(function(dir){D.wrapper.removeClass('an-fadeOut' + dir + '-10');});
				var s = this.options.stick;
				if(s.direction === 'top') P.openFX = 'an-fadeInDown-10';
				else if(s.direction === 'bottom') P.openFX = 'an-fadeInUp-10';
				else if(s.direction === 'left') P.openFX = 'an-fadeInRight-10';
				else if(s.direction === 'right') P.openFX = 'an-fadeInLeft-10';
				else{
					var space = P.stickTarget.getDirectionSpace();
					if(s.direction === 'vertical' || s.direction === 'ver') P.openFX = 'an-fadeIn' + (space.top > space.bottom ? 'Down' : 'Up') + '-10';
					else if(s.direction === 'horizontal' || s.direction === 'hor') P.openFX = 'an-fadeIn' + (space.left > space.right ? 'Right' : 'Left') + '-10';
					else{
						var ver = space.top > space.bottom ? space.top : space.bottom;
						var hor = space.left > space.right ? space.left : space.right;
						P.openFX = 'an-fadeIn' + ((ver / P.size.y) > (hor / P.size.x) ?
							(space.top > space.bottom ? 'Down' : 'Up') : (space.left > space.right ? 'Right' : 'Left')) + '-10';
					}
				}
			}
			return this.parent();
		},

		position: function(){
			var P = this.$P();
			if(P.stickTarget !== 'mouse'){
				var s = this.options.stick, space = P.stickTarget.getDirectionSpace();
				if(s.direction === 'top'){
					s.position = {y: 'top', x: s.align === '+' ? 'right' : s.align === '-' ? 'left' : 'center'};
					s.edge = {y: 'bottom', x: s.align === '+' ? 'right' : s.align === '-' ? 'left' : 'center'};
				}
				else if(s.direction === 'bottom'){
					s.position = {y: 'bottom', x: s.align === '+' ? 'right' : s.align === '-' ? 'left' : 'center'};
					s.edge = {y: 'top', x: s.align === '+' ? 'right' : s.align === '-' ? 'left' : 'center'};
				}
				else if(s.direction === 'left'){
					s.position = {x: 'left', y: s.align === '+' ? 'bottom' : s.align === '-' ? 'top' : 'center'};
					s.edge = {x: 'right', y: s.align === '+' ? 'bottom' : s.align === '-' ? 'top' : 'center'};
				}
				else if(s.direction === 'right'){
					s.position = {x: 'right', y: s.align === '+' ? 'bottom' : s.align === '-' ? 'top' : 'center'};
					s.edge = {x: 'left', y: s.align === '+' ? 'bottom' : s.align === '-' ? 'top' : 'center'};
				}
				else{
					var D = this.$D();
					D.pointer.eliminate('positionOk');
					['top', 'bottom', 'right', 'left'].each(function(css){
						D.pointer.removeClass(css);
						D.wrapper.setStyle('margin-' + css, '');
					});
					if(['ver', 'vertical'].contains(s.direction)){
						s.position = {y: space.top > space.bottom ? 'top' : 'bottom', x: s.align === '+' ? 'right' : s.align === '-' ? 'left' : 'center'};
						s.edge = {y: space.top > space.bottom ? 'bottom' : 'top', x: s.align === '+' ? 'right' : s.align === '-' ? 'left' : 'center'};
					}
					else if(['hor', 'horizontal'].contains(s.direction)){
						s.position = {x: space.right > space.left ? 'right' : 'left', y: s.align === '+' ? 'bottom' : s.align === '-' ? 'top' : 'center'};
						s.edge = {x: space.right > space.left ? 'left' : 'right', y: s.align === '+' ? 'bottom' : s.align === '-' ? 'tops' : 'center'};
					}
					else{	// 'auto'
						//var wrapper = this.$D().wrapper.getSize();
						var ver = space.top > space.bottom ? space.top : space.bottom;
						var hor = space.left > space.right ? space.left : space.right;
						if((ver / P.size.y) > (hor / P.size.x)){
							s.position = {y: space.top > space.bottom ? 'top' : 'bottom', x: s.align === '+' ? 'right' : s.align === '-' ? 'left' : 'center'};
							s.edge = {y: space.top > space.bottom ? 'bottom' : 'top', x: s.align === '+' ? 'right' : s.align === '-' ? 'left' : 'center'};
						}
						else{
							s.position = {x: space.right > space.left ? 'right' : 'left', y: s.align === '+' ? 'bottom' : s.align === '-' ? 'top' : 'center'};
							s.edge = {x: space.right > space.left ? 'left' : 'right', y: s.align === '+' ? 'bottom' : s.align === '-' ? 'tops' : 'center'};
						}
					}
				}
			}
			return this.parent();
		},

		close: function(){
			var P = this.$P(), D = this.$D();
			if(P.stickTarget !== 'mouse'){
				['Up', 'Down', 'Left', 'Right'].each(function(dir){D.wrapper.removeClass('an-fadeIn' + dir + '-10');});
				var s = this.options.stick;
				if(s.direction === 'top') P.closeFX = 'an-fadeOutUp-10';
				else if(s.direction === 'bottom') P.closeFX = 'an-fadeOutDown-10';
				else if(s.direction === 'left') P.closeFX = 'an-fadeOutLeft-10';
				else if(s.direction === 'right') P.closeFX = 'an-fadeOutRight-10';
				else{
					var space = P.stickTarget.getDirectionSpace();
					if(s.direction === 'vertical' || s.direction === 'ver') P.closeFX = 'an-fadeOut' + (space.top < space.bottom ? 'Down' : 'Up') + '-10';
					else if(s.direction === 'horizontal' || s.direction === 'hor') P.closeFX = 'an-fadeOut' + (space.left < space.right ? 'Right' : 'Left') + '-10';
					else{
						var ver = space.top > space.bottom ? space.top : space.bottom;
						var hor = space.left > space.right ? space.left : space.right;
						P.closeFX = 'an-fadeOut' + ((ver / P.size.y) > (hor / P.size.x) ?
							(space.top < space.bottom ? 'Down' : 'Up') : (space.left < space.right ? 'Right' : 'Left')) + '-10';
					}
				}
			}
			return this.parent();
		}
	});
})();

Element.Properties.tip = {
	set: function(options){
		var tip = this.retrieve('J104.TIP');
		if(tip) tip.destroy();
		return this.eliminate('J104.TIP').store('tip:options', options);
	},

	get: function(){
		var tip = this.retrieve('J104.TIP');
		if (!tip){
			tip = new J104.Box.Tip(this, this.retrieve('tip:options'));
			this.store('J104.TIP', tip);
		}
		return tip;
	}
};
Element.implement({
	tip: function(message, options){
		if(options) this.set('tip', options);
		tip = this.get('tip').enable();
		if(!tip.options.content) tip.setContent(message || this.getProperty('tip'));
		return this;
	},

	untip: function(){
		tip = this.get('tip').disable();
		return this;
	}
});



/********************************************************************************************************************************
 * J104.Box.Notice
 */
//Constants.J104.Box.Notice = {};
J104.Box.Notice = (function(){
	/* -- private & static properties ----------------------------------------- */
	var __profile = {
		name: 'J104.Box.Notice',
		extends: 'J104.Box',
		version: '2.0.0',
		lastModify: '2016/4/15'
	};
	var __name = __profile.name;

	/* -- private & static methods -------------------------------------------- */
	var _buildCounter = function(_this){
		var D = _this.$D();
		var counterWrapper = new Element('div.counterWrapper');
		var counter = D.counter = new Element('div.counter').inject(counterWrapper);

		return counterWrapper;
	};

	/*** -- Class ---------------------------------------------------------------------------------------------------------- ***/
	return new Class({
		Extends: J104.Box,
		profile: function(){ return Object.clone(__profile); },
		options: {
			css: 'J104BoxNotice',
			theme: '',
			additionClass: '',
			boundary: false,
			stick: {
				position: 'top',
				edge: 'top'
			},
			closeOn: {
				esc: false,
				click: {
					box: true,
					body: false
				}
			},
			delayClose: 5000,			// if > 0, wait n milliseconds and the notice auto close
			countDown: true
		},

		/** -- constructor -------------------------------------------------------------------------------------------------- **/
		initialize: function(message, options){
			if(!options) options = {};
			options.content = message;
			this.parent(options);
			var P = this.$P(), D = this.$D();
			D.wrapper.set('tween', {duration: 80});
			P.delayClose = this.options.delayClose !== null && typeOf(this.options.delayClose.toInt()) === 'number' ? this.options.delayClose.toInt() : 5000;
			if(P.delayClose > 0){
				D.wrapper.addEvents({
					mouseenter: function(evt){
						if(this.options.countDown) D.counter.get('tween').pause();
						clearInterval(P.timerId);
						P.remain -= (new Date().getTime() - P.timestamp);
					}.bind(this),
					mouseleave: function(evt){
						if(this.options.countDown) D.counter.get('tween').resume();
						P.timerId = this.close.delay(P.remain, this);
						P.timestamp = new Date().getTime();
					}.bind(this)
				});
				if(this.options.countDown) this.$setFooter(_buildCounter(this));
			}
		},

		/** -- protected methods -------------------------------------------------------------------------------------------- **/

		/** -- public methods ----------------------------------------------------------------------------------------------- **/
		move: function(offset){
			var wrapper = this.$D().wrapper;
			wrapper.tween('top', wrapper.getStyle('top').toInt() + offset);
			this.options.stick.offset.y += offset;
			return this;
		},

		open: function(){
			var P = this.$P(), D = this.$D();
			if(P.delayClose > 0){
				P.remain = P.delayClose + this.options.fxDuration;
				this.addEvent('open', function(){
					P.timerId = this.close.delay(P.remain, this);
				}.bind(this));
				if(this.options.countDown){
					D.counter.set('tween', {duration: P.remain});
					D.counter.tween.delay(P.fxDuration, D.counter, ['width', 0]);
				}
				P.timestamp = new Date().getTime();
			}
			this.addEvent('close', this.destroy.bind(this));

			return this.parent();
		}
	});
})();

Element.Properties.notice = {
	set: function(options){
		if(!options.stick) options.stick = {};
		options.stick.target = this;
		return this.store('notice:options', options);
	},

	get: function(){
		var notices = this.retrieve('J104.NOTICE');
		if(!notices){
			notices = new Array();
			this.store('J104.NOTICE', notices);
		}
		return notices;
	}
};
Element.implement({
	notice: function(message, options){
		options = Object.merge({stick:{target:this, offset:{y:10}}}, this.retrieve('notice:options'), options);
		if(options.single) options.fx = 'tada';
		var notice = new J104.Box.Notice(message, options);
		notice.addEvent('destroy', function(){ this.get('notice').erase(notice); }.bind(this));

		var notices = this.get('notice');
		if(options.single){
			while(notices.length > 0) notices.pop().destroy();
			notices.push(notice.open());
		}
		else{
			var move = notice.getDimensions().height + 10;
			if(notice.options.stick.position.y === 'bottom') move *= -1;
			notices.each(function(n){
				n.move(move);
			}).push(notice.open());
		}
		return this;
	},

	clearNotices: function(){
		var notices = this.get('notice');
		while(notices.length > 0) notices.pop().destroy();
	},

	success: function(message, options){
		options = Object.merge({delayClose: 5000}, options, {theme: 'success'});
		return this.notice(message, options);
	},

	info: function(message, options){
		options = Object.merge({delayClose: 10000}, options, {theme: 'info'});
		return this.notice(message, options);
	},

	warning: function(message, options){
		options = Object.merge({delayClose: 15000}, options, {theme: 'warning'});
		return this.notice(message, options);
	},

	error: function(message, options){
		options = Object.merge({delayClose: 0}, options, {theme: 'error'});
		return this.notice(message, options);
	}
});



/********************************************************************************************************************************
 * J104.Box.Dialog
 */
Constants.J104.Box.Dialog = {
	yesButton: 'OK',
	noButton: 'Cancel'
}
J104.Box.Dialog = (function(){
	/* -- private & static properties ----------------------------------------- */
	var __profile = {
		name: 'J104.Box.Dialog',
		extends: 'J104.Box',
		version: '2.0.0',
		lastModify: '2016/4/20'
	};
	var __name = __profile.name;

	/* -- private & static methods -------------------------------------------- */
	var _buildHeader = function(_this){
		var options = _this.options;
		var title = new Element('div.title');
		if(typeOf(options.title) === 'string') title.set('text', options.title);
		else if(typeOf(options.title) === 'element') options.title.inject(title);

		_this.$setHeader(title);

		var P = _this.$P(), D = _this.$D();
		if(options.draggable){
			title.addClass('draggable');
			new Drag.Move(D.wrapper, {
				handle: title,
				container: P.parent
			});
		}
		new Element('div.close').addEvent('click', _this.close.bind(_this)).inject(D.header);
	};
	var _buildFooter = function(_this){
		var options = _this.options;
		if(!options.yesButton && !options.noButton) return;

		var D = _this.$D();
		var buttons = new Element('div');
		if(options.yesButton)
			D.yesButton = new Element('button.btn.btn-primary.okBtn')
				.set('text', (typeOf(options.yesButton) === 'string' && options.yesButton) || Constants.J104.Box.Dialog.yesButton)
				.addEvent('click', function(evt){
				_this.fireEvent('ok', [_this]);
			}).inject(buttons);
		if(options.noButton)
			D.noButton = new Element('button.btn.btn-default.cancelBtn')
				.set('text', (typeOf(options.noButton) === 'string' && options.noButton) || Constants.J104.Box.Dialog.noButton)
				.addEvent('click', function(evt){
				_this.close();
				_this.fireEvent('cancel', [_this]);
			}).inject(buttons);

		_this.$setFooter(buttons);
	};

	/*** -- Class ---------------------------------------------------------------------------------------------------------- ***/
	return new Class({
		Extends: J104.Box,
		profile: function(){ return Object.clone(__profile); },
		options: {
			css: 'J104BoxDialog',
			theme: '',
			additionClass: '',
			modal: 'gray',
			closeOn: {
				esc: false,
				click: false
			},
			title: 'J104 Dialog',
			draggable: true,
			yesButton: true,					// boolean or String(button label)
			noButton: true,				// boolean or String(button label)
			onOk: function(_this){},
			onCancel: function(_this){},
			noticeOptions: {
				stick: {
					offset: {y: 10}
				}
			}
		},

		/** -- constructor -------------------------------------------------------------------------------------------------- **/
		initialize: function(content, options){
			if(!['element', 'string'].contains(typeOf(content)))
				throw new Error('[' + __name + '] can not find element: ' + content);
			if(!options) options = {};
			options.content = content;
			this.parent(options);
			_buildHeader(this);
			_buildFooter(this);
		},

		/** -- protected methods -------------------------------------------------------------------------------------------- **/

		/** -- public methods ----------------------------------------------------------------------------------------------- **/
		close: function(){
			this.parent();
			this.$D().body.clearNotices();
		},

		notice: function(message, options){
			this.$D().body.notice(message, Object.merge(this.options.noticeOptions, options));
			return this;
		},
		success: function(message, options){
			this.$D().body.success(message, Object.merge(this.options.noticeOptions, options));
			return this;
		},
		info: function(message, options){
			this.$D().body.info(message, Object.merge(this.options.noticeOptions, options));
			return this;
		},
		warning: function(message, options){
			this.$D().body.warning(message, Object.merge(this.options.noticeOptions, options));
			return this;
		},
		error: function(message, options){
			this.$D().body.error(message, Object.merge(this.options.noticeOptions, options));
			return this;
		}
	});
})();

Element.implement({
	makeDialog: function(options){
		return new J104.Box.Dialog(this, options);
	}
});



/********************************************************************************************************************************
 * J104.Box.Confirm
 */
Constants.J104.Box.Confirm = {
	yesButton: 'Yes',
	noButton: 'No'
};
J104.Box.Confirm = (function(){
	/* -- private & static properties ----------------------------------------- */
	var __profile = {
		name: 'J104.Box.Confirm',
		extends: 'J104.Box',
		version: '2.0.0',
		lastModify: '2016/4/21'
	};
	var __name = __profile.name;

	/* -- private & static methods -------------------------------------------- */
	var _build = function(_this){
		var options = _this.options;

		var D = _this.$D();
		var buttons = new Element('div');
		D.yesButton = new Element('button.btn.btn-primary.yesBtn')
			.set('text', (typeOf(options.yesButton) === 'string' && options.yesButton) || Constants.J104.Box.Confirm.yesButton)
			.addEvent('click', function(evt){
				_this.close();
				_this.fireEvent('yes', [_this]);
			}).inject(buttons);
		D.noButton = new Element('button.btn.btn-default.noBtn')
			.set('text', (typeOf(options.noButton) === 'string' && options.noButton) || Constants.J104.Box.Confirm.noButton)
			.addEvent('click', function(evt){
				_this.close();
				_this.fireEvent('no', [_this]);
			}).inject(buttons);

		_this.$setFooter(buttons);
	};

	/*** -- Class ---------------------------------------------------------------------------------------------------------- ***/
	return new Class({
		Extends: J104.Box,
		profile: function(){ return Object.clone(__profile); },
		options: {
			css: 'J104BoxConfirm',
			theme: '',
			additionClass: '',
			closeOn: {
				esc: false,
				click: false
			},
			yesButton: '',
			noButton: '',
			onYes: function(_this){},
			onNo: function(_this){}
		},

		/** -- constructor -------------------------------------------------------------------------------------------------- **/
		initialize: function(message, options){
			if(typeOf(message) !== 'string') throw new Error('[' + __name + '] argument #0(message) required a \'String\' type');
			if(!options) options = {};
			options.content = message;
			options.modal = 'transparent';
			this.parent(options);
			_build(this);
		}

		/** -- protected methods -------------------------------------------------------------------------------------------- **/

		/** -- public methods ----------------------------------------------------------------------------------------------- **/
	});
})();

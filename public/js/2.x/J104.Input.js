/********************************************************************************************************************************
 * J104.Input
 */
J104.Input = (function(){
	/* -- private & static properties ----------------------------------------- */
	var __profile = {
		name: 'J104.Input',
		extends: 'J104.UIComponent',
		version: '2.0.0',
		lastModify: '2016/4/22'
	};
	var __name = __profile.name;

	/* -- private & static methods -------------------------------------------- */

	/*** -- Class ---------------------------------------------------------------------------------------------------------- ***/
	return new Class({
		Extends: J104.UIComponent,
		profile: function(){ return Object.clone(__profile); },
		options: {
			initValue: '',
			available: true,
			editable: true,
			errorTipOptions: {
				theme: 'validate',
				stick: {
					direction: 'ver',
					align: '+'
				}
			}
		},

		/** -- constructor -------------------------------------------------------------------------------------------------- **/
		initialize: function(options) {
			this.parent(options);
			var P = this.$P(), F = this.$F();
			P.initValue = P.value = this.options.initValue;
			F.available = this.options.available === true;
			F.editable = this.options.editable === true;
		},

		/** -- protected methods -------------------------------------------------------------------------------------------- **/

		/** -- public methods ----------------------------------------------------------------------------------------------- **/
		getValue: function(){
			return this.$P().value;
		},

		setValue: function(value){
			if(this.validate()) this.$P().value = value;
			return this;
		},

		editable: function(){
			this.$F().ediable = true;
			return this;
		},

		readOnly: function(){
			this.$F().ediable = false;
			return this;
		},

		enable: function(){
			this.$F().available = true;
			return this;
		},

		disable: function(){
			this.$F().available = false;
			return this;
		},

		validate: function(){ return this; },

		reset: function(){
			var P = this.$P();
			P.value = P.initValue;
			return this;
		}
	});
})();


/********************************************************************************************************************************
 * J104.Input.Text
 */
J104.Input.Text = (function(){
	/* -- private & static properties ----------------------------------------- */
	var __profile = {
		name: 'J104.Input.Text',
		extends: 'J104.Input',
		version: '2.0.0',
		lastModify: '2016/4/22'
	};
	var __name = __profile.name;

	/* -- private & static methods -------------------------------------------- */
	var _build = function(_this, src){
		var options = _this.options;
		var D = _this.$D();
		D.wrapper = new Element('div.wrapper').addClass(options.css + (options.theme ?  ('-' + options.theme) : '')).inject(src, 'after');
		if(options.additionClass && typeOf(options.additionClass) === 'string') D.wrapper.addClass(options.additionClass);

		D.field = new Element('input.field.form-control', {type: 'text'}).inject(D.wrapper).set('tip', options.errorTipOptions);
		src.destroy();

		if(options.validate){
			var P = _this.$P();
			P.validateRules = Object.clone(options.validate);
			D.field.addEvent('blur', function(evt){
				_this.validate();
			}.bind(_this));
		}
	};

	/*** -- Class ---------------------------------------------------------------------------------------------------------- ***/
	return new Class({
		Extends: J104.Input,
		profile: function(){ return Object.clone(__profile); },
		options: {
			css: 'J104Text',
			theme: '',
			additionClass: '',
			line: 1,
			charIndicator: '{length} / {max}', 	// boolean or String(variable:length,max)
			validate: {
				required: true,
				max: -1,
				min: -1
			},
			//mask: ...
		},

		/** -- constructor -------------------------------------------------------------------------------------------------- **/
		initialize: function(ele, options){
			var src = $(ele);
			if(!src) throw new Error('[' + __name + '] can not find element: ' + ele);

			this.parent(options);
			_build(this, src);


		},

		/** -- protected methods -------------------------------------------------------------------------------------------- **/

		/** -- public methods ----------------------------------------------------------------------------------------------- **/
		validate: function(){
			var D = this.$D(), rules = this.$P().validateRules;
			if(!rules) return this.parent();

			var value = D.field.get('value').trim();
			if(rules.required && value.length == 0) {
				//this.setError();
				D.field.tip('Required!');
				return this.parent();
			}

			D.field.untip();

console.log(value)
			return this.parent();
		}
	});
})();



/********************************************************************************************************************************
 * J104.Input.XXX
 */
J104.Input.XXX = (function(){
	/* -- private & static properties ----------------------------------------- */
	var __profile = {
		name: 'J104.Input.XXX',
		extends: 'J104.Input',
		version: '2.0.0',
		lastModify: '2016/4/22'
	};
	var __name = __profile.name;

	/* -- private & static methods -------------------------------------------- */

	/*** -- Class ---------------------------------------------------------------------------------------------------------- ***/
	return new Class({
		Extends: J104.Input,
		profile: function(){ return Object.clone(__profile); },
		options: {
			css: 'J104InputXXX',
			theme: '',
			additionClass: ''
		},

		/** -- constructor -------------------------------------------------------------------------------------------------- **/
		initialize: function(options){
		}

		/** -- protected methods -------------------------------------------------------------------------------------------- **/

		/** -- public methods ----------------------------------------------------------------------------------------------- **/

	});
})();
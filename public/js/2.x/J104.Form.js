/********************************************************************************************************************************
 * J104.Form
 */
J104.Form = (function(){
	/* -- private & static properties ----------------------------------------- */
	var __profile = {
		name: 'J104.Form',
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
			css: 'J104Form',
			theme: '',
			additionClass: ''
		},

		/** -- constructor -------------------------------------------------------------------------------------------------- **/
		initialize: function(options) {
		},

		/** -- protected methods -------------------------------------------------------------------------------------------- **/

		/** -- public methods ----------------------------------------------------------------------------------------------- **/
		reset: function(){

		},

		getValues: function(options){

		},

		setValues: function(values){

		},

		getInputs: function(options){

		},

		getInput: function(id){

		},

		addInput: function(input){

		},

		removeInput: function(id){

		}
	});
})();
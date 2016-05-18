var ThisPage = {
	members: [],

	init: function(){
		this.members.each(function(m){
			m.init();
		});
	},
	
	register: function(member){
		this.members.push(member);
	}
};

window.addEvent('domready', ThisPage.init.bind(ThisPage));
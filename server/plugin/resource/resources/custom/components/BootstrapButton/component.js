var BootstrapButtonComponent = BaseComponent.extend({
	update: function(){
		var myself = this,
			$htmlObject = $("#"+this.htmlObject);

		$htmlObject.text($htmlObject.attr("content"));

		$htmlObject.unbind("click").bind("click", function(){
        	return myself.expression.apply(myself,arguments);
    	});
	}

});
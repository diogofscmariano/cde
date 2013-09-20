var BootstrapMultiButtonComponent = InputBaseComponent.extend({
	defaultTemplate: "<button type='button' class='btn btn-default'></button>",

	// NOTE: The query type detection code should be kept in sync with 
  	// CDF's Dashboards.js Query constructor code.
	  detectQueryType: function(qd) {
	    if(!qd) { qd = this.chartDefinition; }
	    if(qd) {
	      var qt = qd.queryType                 ? qd.queryType : // cpk goes here
	               qd.query                     ? 'legacy'     :
	               (qd.path && qd.dataAccessId) ? 'cda'        : 
	               undefined;
	      
	      qd.queryType = qt;

	      return qt;
	    }
	  },

	update: function(){
	    var qd = this.queryDefinition;
	    if(this.valuesArray && this.valuesArray.length > 0) {
	      var handler = _.bind(function() {
	        this.draw(this.valuesArray);
	      },this);
	      this.synchronous(handler);
	    } else if(BootstrapMultiButtonComponent.prototype.detectQueryType(qd) != undefined){
	      var handler = _.bind(function(data){
	        var filtered;
	        if(this.valueAsId) {
	          filtered = data.resultset.map(function(e){
	            return [e[0],e[0]];
	          });
	        } else {
	          filtered = data.resultset;
	        }
	        this.draw(filtered);
	      },this);
	      this.triggerQuery(qd,handler);
	    } else {
	    	var handler = _.bind(function() {
		        this.draw();
	      	},this);
	    	this.synchronous(handler);
	    }
	  },

	draw: function(myArray){
		var myself = this,
			$htmlObject = $("#"+this.htmlObject);

		if(this.isMultiple == undefined) this.isMultiple = false;

		var valIdx = this.valueAsId ? 1 : 0;
    	var lblIdx = 1;

		var $buttons;
		if(myArray != undefined){ //using the current html content and just bing the needed events
			//check if it has any template to use
			$buttons = $htmlObject.find("> button.btn[type=button]");
			var $buttonTemplate;
			if($buttons.length >= 1){ //it has something 
				$buttonTemplate = $($buttons[0]).detach();
			} else { //use template
				$buttonTemplate = $(this.defaultTemplate);
			}

			$htmlObject.empty();
			$buttons.empty(); 

			for (var i = 0, len = myArray.length; i < len; i++){
      			var value = myArray[i][valIdx],
      				label = myArray[i][lblIdx];

      			value = (value == null ? null : value.replace('"','&quot;' ));
      			label = (label == null ? null : label.replace('"','&quot;' ));

      			if(i == 0){
		        	firstVal = value;
		      	}

		      	var $newObj = $buttonTemplate.clone();
		      	$newObj.text(label);
		      	$newObj.attr("value",value);
		      	$newObj.attr("content",value);

		      	$buttons.push($newObj);

		      	$htmlObject.append($newObj);
      		}

		} else { //check if have content to use as template, if not create using the default
			$buttons = $htmlObject.find("> button.btn[type=button]");
		} 

		$buttons.each(function(){
			$(this).bind("click", function(){
				BootstrapMultiButtonComponent.prototype.clickHandler(myself, this ,myself.isMultiple);
			});	
		})

	},

	clickHandler: function(myself, element, isMultiple){
		if(!isMultiple){ //unselect everything
			var isActive = $(element).hasClass("active");

			var $buttons = $("#"+myself.htmlObject + "> button.btn[type=button]");
			$buttons.each(function(){
				$(this).removeClass("active");
			});

			if(!isActive) $(element).addClass("active");
		} else { //add class
			$(element).toggleClass("active");
		}
		myself.dashboard.processChange(myself.name); 
	},

	getValue: function(){
		var myself = this;
		var $buttons = $("#"+this.htmlObject + "> button.btn.active[type=button]");

		var returnValue = [];
		if(!this.isMultiple && $buttons.length == 1){
			return this.getValueFromElement($buttons);
		} else {
			$buttons.each(function(){
				returnValue.push(myself.getValueFromElement(this));
			});
		}

		return returnValue;
	},

	getValueFromElement: function(element){
		var $element = $(element);
		if(this.valueAsId){
			return $element.attr("content");
		} else {
			if($element.attr("content") != "") return $element.attr("content");
			else return $element.attr("value");
		}
	}
});
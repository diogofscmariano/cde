var BootstrapInputComponent = BaseComponent.extend({
  update: function() {
    var myself = this,
        $htmlObject = $("#"+this.htmlObject),
        id = $htmlObject.attr("id");

    $htmlObject
    .change(function() { 
      myself.dashboard.processChange(myself.name); 
    })
    .keyup(function(ev) { 
      if (ev.keyCode == 13) { 
        myself.dashboard.processChange(myself.name); 
      } 
    });
  },

  getValue: function() {
    var $htmlObject = $("#"+this.htmlObject)
        type = $htmlObject.attr("type");

    if(type == "text"){
      return $htmlObject.val();
    } else {
      return $htmlObject.prop("checked");
    }    
  }
});
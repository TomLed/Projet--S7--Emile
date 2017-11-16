$(document).ready(function(){

  $('form').on('submit', function() {
      // get all the inputs into an array.
      var inputs = $('form input');
      var checkboxes = [inputs[0].checked, inputs[1].checked, inputs[2].checked, inputs[3].checked, inputs[4].checked];
      var numbers = [0, 0, 0, 0, 0];

      for (var i = 0; i < checkboxes.length; i++) {
        if (!checkboxes[i]) {
          numbers[i] = parseInt(document.getElementById('value'+i).innerHTML);
        }
      };

      var readyToBeSent = {dice0: numbers[0], dice1: numbers[1], dice2: numbers[2], dice3: numbers[3], dice4: numbers[4]};

      $.ajax({
        type: 'POST',
        url: '/',
        data: readyToBeSent,
        success: function(data){
          //do something with the data via front-end framework
          location.reload();
        }
      });

      return false;

});
});

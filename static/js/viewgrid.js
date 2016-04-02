$(document).ready(function() {
  $searchinput = $('#searchinput');
  $searchinput.keyup(search);
  $('#fieldtosearchon').change(search);
  $.editable.addInputType('autogrow', {
    element: function(settings, original){
      var textarea = $('<textarea>');
      textarea.height("100%");
      textarea.width("100%");
      $(this).append(textarea);
      return(textarea);
    },
    plugin : function(){
      $('textarea', this).autogrow(settings, original);
    }
  });
  curentityjson = $('#curentityjson').text();
  curentityinfo = JSON.parse(curentityjson);
  fieldinfo = JSON.parse(curentityinfo['fields']);
  spliturl = window.location.href.split('/');
  ename = spliturl[spliturl.length-1];
  console.log(fieldinfo);
  $('.entityinstancebox').each( function () {
    $(this).find('div').each( function() {
      if (fieldinfo['actionname' + $(this).attr('fieldnum') + '-1'] == 'edit') {
        $(this).editable('/editendpoint', {
          type : "autogrow",
          tooltip: "Double click to Edit",
          event : "dblclick",
          submitdata : {uuid: $(this).closest('.entityinstancebox').attr('uuid'),
        fieldnumber: $(this).attr('fieldnum'),
        entityname: ename}
        });
      }
    });

  });

  console.log(curentityjson);
  $('.editform').on('submit', function(event){

    var fieldnamenum = $(this).find("#fieldnameid").val();
    var fieldnum = fieldnamenum.substr(9);
    $(document).find('div[fieldnum="'+fieldnum+'"]').dblclick();
    console.log(fieldnum);
    event.preventDefault();
  })
});

function search() {
  var searchterm = $searchinput.val();
  fieldtosearchon = $('#fieldtosearchon').val().split('-')[1];
  entitytosearchon = $('#fieldtosearchon').val().split('-')[0];
  if (fieldtosearchon == 'All') {
  $(document).find('.entityinstancebox').each( function() {
    hidethisguy = true;
    $(this).find('.fielddiv').each( function() {
      if ($(this).text().indexOf(searchterm) > -1) {
        hidethisguy = false;
        console.log($(this).text());
      }
    });
    if (hidethisguy == true) {
        console.log('HIDE!');
        // $(this).addClass('hideboy');
        $(this).css('display', 'none');
      }
      else {
        console.log('KEEP!');
        $(this).css('display', 'block');
      }
    });
  }
  else {
    console.log('notall');
    $(document).find('.entityinstancebox').each( function() {
      hidethisguy = true;
      var fieldnumbertosearchon = fieldtosearchon.substr(9);
      $(this).find('.fielddiv[fieldnum="' + fieldnumbertosearchon + '"][entityname="' + entitytosearchon + '"]').each( function() {
        if ($(this).text().indexOf(searchterm) > -1) {
          hidethisguy = false;
          console.log($(this).text());
        }
      });
      if (hidethisguy == true) {
          console.log('HIDE!');
          // $(this).addClass('hideboy');
          $(this).css('display', 'none');
        }
        else {
          console.log('KEEP!');
          $(this).css('display', 'block');
        }
    });

  }

}

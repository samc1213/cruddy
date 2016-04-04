$(document).ready(function() {
  $searchinput = $('#searchinput');
  sort();
  $("#fieldtosorton").change(sort);
  $("#waytosort").change(sort);
  // $('input[value="edit"]').parent().submit(function (e) {
  //   console.log('editsubmit');
  //   e.preventDefault();
  // });
  $('#wrapper').html(sort("creationdate-creationdate"));
  $searchinput.keyup(search);
  $('#fieldtosearchon').change(search);
  // $.editable.addInputType('autogrow', {
  //   element: function(settings, original){
  //     var textarea = $('<textarea>');
  //     textarea.height("100%");
  //     textarea.width("100%");
  //     $(this).append(textarea);
  //     return(textarea);
  //   },
  //   plugin : function(){
  //     $('textarea', this).autogrow(settings, original);
  //   }
  // });
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
          // type : "autogrow",
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

function sort(){
  var waytosort = $("#waytosort").val()
  var fieldtosorton = $("#fieldtosorton").val().split('-')[1];
  var fieldnumbertosorton = fieldtosorton.substr(9);
  var entitytosorton = $("#fieldtosorton").val().split('-')[0];
  console.log(waytosort + fieldtosorton + entitytosorton + 'fieldnum' + fieldnumbertosorton);
  newhtml = $(document).find('.entityinstancebox').sort(function(a, b){
    if (fieldtosorton == "creationdate"){
      var contentA = $(a).attr('creationdate');
      var contentB = $(b).attr('creationdate');

    }
    else{
      console.log("nOTCREATIL");
      var contentA = $(a).find('.fielddiv[fieldnum="' + fieldnumbertosorton + '"][entityname="' + entitytosorton + '"]').text();
      var contentB = $(b).find('.fielddiv[fieldnum="' + fieldnumbertosorton + '"][entityname="' + entitytosorton + '"]').text();
    }
    console.log(contentA);
    console.log(contentB);
    if (contentA < contentB){
      console.log("LessMootha");
    }
    if (contentA > contentB){
      console.log("MooreMotha");
    }
    if (waytosort == "newtoold"){
      console.log("ascending");
      return (contentA > contentB) ? 1 : (contentA < contentB) ?-1 : 0;
    }
    else{
      return (contentA < contentB) ? 1 : (contentA > contentB) ?-1 : 0;

    }
  });
  $('#wrapper').html(newhtml);
}

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

$(document).ready(function() {
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
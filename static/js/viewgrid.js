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
          submitdata : {uuid: $(this).closest('.entityinstancebox').attr('uuid'),
        fieldnumber: $(this).attr('fieldnum'),
        entityname: ename}
        });
      }
    });

  });
  console.log(curentityjson);
});

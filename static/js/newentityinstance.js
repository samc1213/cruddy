$(document).ready(function() {
  $('select').select2();
  $('.fileuploadform').fileinput();
  // $submitnewinstancebtn = $('#submitnewinstancebtn');
  // $submitnewinstancebtn.click(submitforms);
});

function submitforms() {
  console.log('submitforms!');
}

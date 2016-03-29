$(document).ready(function() {
  $form = $('#newentityform');
  $form.on('keydown', '.fieldname', validate);
});

function validate() {
  console.log($(this).attr('id'));
  // $('.fieldtype').each(function() {
  // //   var currentfieldtype = $(this).val();
  // //   var fieldnameid = 'field' + $(this).attr('number') + 'name';
  // //   if (currentfieldtype == "string") {
  // //
  // //   }
  // console.log($(this).attr('id'));
  // });
}

$(document).ready(function() {
  console.log("ready!");
  numfields = 0;
  $form = $('#newentityform');
  $newfieldbtn = $('#newfieldbtn');
  $numfieldsinput = $('#numfieldsinput');
  $newfieldbtn.click(addnewfield);
  $form.on('change', '.fieldtype', fieldchange);
  addnewfield();
});

function fieldchange() {
  console.log($(this).attr('number'));
  formgroupnumber = $(this).attr('number');
  if ($(this).val() == 'entity') {
    var childentitynamefield = '<label class="entitychildnamelabel" for="entitychildname' + formgroupnumber + '">Entity Child Name:</label> \
    <input type="text" name="entitychildname' + formgroupnumber + '" id="entitychildname' + formgroupnumber + '" class="form-control entitychildname">';
    $(this).after(childentitynamefield);
  }
  else {
    $(this).siblings('.entitychildname').remove();
    $(this).siblings('.entitychildnamelabel').remove();
  }

}

function addnewfield() {
  console.log('addingnewfiled');
  var lastfieldid = 'fg' + (numfields);
  console.log(lastfieldid);
  $lastformgroup = $form.find('#' + lastfieldid);
  numfields += 1;
  $lastformgroup.after(makenewinputformgroup(numfields));
  $numfieldsinput.val(numfields);
}

function makenewinputformgroup(formgroupnumber) {
  return '<div class="form-group fieldgroup" id="fg' + formgroupnumber + '"> \
  <h3>Field ' + formgroupnumber + '</h3>\
  <label for="fieldname' + formgroupnumber + '">Name:</label> \
    <input type="text" name="fieldname' + formgroupnumber + '" id="fieldname' + formgroupnumber + '" class="form-control fieldname" placeholder="e.g. ' + returnfieldexample(formgroupnumber) + '"> \
    <label for="fieldtype'+ formgroupnumber + '">Type:</label> \
    <select name="fieldtype' + formgroupnumber + '" id="fieldtype' + formgroupnumber + '" class="form-control fieldtype" number="' + formgroupnumber + '"> \
    <option value="string">Text</option> \
    <option value="int">Whole Number</option> \
    <option value="float">Decimal Number</option> \
    <option value="entity">Child Entity</option> \
    </select> \
  </div>';
}

function returnfieldexample(fieldnumber) {
  var fieldexamples = {
    2: "Last Name",
    3: "Email",
    4: "Phone Number",
    5: "Address Line 1",
  }
  if (fieldexamples[fieldnumber] != null) {
    return fieldexamples[fieldnumber]
  }
  else {
    return "ZIP Code"
  }

}

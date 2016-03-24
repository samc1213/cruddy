$(document).ready(function() {
  console.log("ready!");
  numfields = 0;
  $form = $('#newentityform');
  $newfieldbtn = $('#newfieldbtn');
  $numfieldsinput = $('#numfieldsinput');
  $newfieldbtn.click(addnewfield);

  addnewfield();
});

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
  <label for="field' + formgroupnumber + 'name">Name:</label> \
    <input type="text" name="field' + formgroupnumber + 'name" id="field' + formgroupnumber + 'name" class="form-control fieldname" placeholder="e.g. ' + returnfieldexample(formgroupnumber) + '"> \
    <label for="field'+ formgroupnumber + 'type">Type:</label> \
    <select name="field' + formgroupnumber + 'type" id="field' + formgroupnumber + 'type" class="form-control fieldtype"> \
    <option value="string">Text</option> \
    <option value="int">Whole Number</option> \
    <option value="float">Decimal Number</option> \
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

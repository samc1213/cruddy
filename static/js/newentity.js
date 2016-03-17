$(document).ready(function() {
  console.log("ready!");
  var numfields = 2;

  $form = $("#newentityform");
  addnewfield(numfields, $form);
});


function addnewfield(numfields, $formobj) {
  $formobj.append(makenewinputformgroup(numfields));
}

function makenewinputformgroup(formgroupnumber) {
  return '<div class="form-group" id="' + formgroupnumber + '"> \
  <label for="entityname">Field ' + formgroupnumber + ':</label> \
    <input type="text" name="field' + formgroupnumber + '" id="field' + formgroupnumber + '" class="form-control" placeholder="e.g. ' + returnfieldexample(formgroupnumber) + '"> \
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

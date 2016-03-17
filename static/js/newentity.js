$(document).ready(function() {
  console.log("ready!");
  numfields = 2;

  $form = $('#newentityform');
  $newfieldbtn = $('#newfieldbtn');
  $newfieldbtn.click(addnewfield);


});

function addnewfield() {
  console.log('addingnewfiled');
  var lastfieldid = 'fg' + (numfields - 1);
  console.log(lastfieldid);
  $lastformgroup = $form.find('#' + lastfieldid);
  $lastformgroup.after(makenewinputformgroup(numfields));
  numfields += 1;
}

function makenewinputformgroup(formgroupnumber) {
  return '<div class="form-group" id="fg' + formgroupnumber + '"> \
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

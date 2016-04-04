$(document).ready(function() {
  console.log("ready!");
  numfields = 0;
  $form = $('#newentityform');
  $newfieldbtn = $('#newfieldbtn');
  $numfieldsinput = $('#numfieldsinput');
  $newfieldbtn.click(addnewfield);
  $form.on('change', '.fieldtype', fieldchange);
  $form.on('DOMNodeInserted', '.fieldtype', fieldchange);
  $form.on('change', '.actionname', actionchange)
  $form.on('click', '.actiontoggle', toggleaction);
  $form.on('click', '.newactionbtn', newactionbtnclick)
  addnewfield();

});

actionsavailable = {
  'int':['add', 'subtract'], 
  'float':null, 
  'string':['edit'], 
  'entity':null, 
  'file':null, 
  'phone':['textmsg']
}

actionprettytext = {
  'add': 'Add',
  'subtract':'Subtract', 
  'edit':'Edit',
  'textmsg':'Text Message'
}
actionqualifiertexts = {
  'add': 'Amount to Add',
  'subtract': 'Amount to Subtract', 
  'edit': null,
  'textmsg':'Message To Send'
}
actioninputtypes = {
  'add': 'number',
  'subtract': 'number', 
  'edit': null,
  'textmsg': 'text'
}

function actionchange() {
  formgroupnumber = $(this).attr('number');
  var actionnamestring = '#actionname' + formgroupnumber + '-1';
  console.log('anameSTRINg' + actionnamestring)
  selectedaction = $(actionnamestring).val();
  console.log('saction' + selectedaction);
  $actionarea.find('.actionname').nextAll().remove();

  if (actionqualifiertexts[selectedaction] != null){
      var valueselectortext = '<label>' + actionqualifiertexts[selectedaction] + '</label><input name="actionqualifier' + formgroupnumber + '-1" class="form-control" type="' + actioninputtypes[selectedaction] + '"/>';
  $actionarea.find('.actionname').after(valueselectortext);

  }
}


function toggleaction() {
  console.log('toggle');
  $actionarea = $(this).siblings('.actionarea');
  if ($(this).attr('arrowdirection') == 'right') {
    console.log('totheright');
    $(this).attr('arrowdirection', 'down');
    $(this).html('Actions &#9660');
  }
  else {
    $(this).attr('arrowdirection', 'right');
    $(this).html('Actions &#9658');
  }
  $actionarea.toggle();
}

function newactionbtnclick() {
  // console.log("shittybitty");
  formgroupnumber = $(this).attr('number');
  $actionarea = $(this).siblings('.actionarea');
  var fieldtype = $(this).siblings('.fieldtype').val();
  console.log('ft' + fieldtype);
  var actionsavailablelist =  actionsavailable[fieldtype]
  if (actionsavailablelist == null) {
    console.log('nully');
    $actionarea.text('There are no actions available for this field type.');
        $actionarea.siblings('input[name = "numactions"]').val(0);

  }
  else {
    var actionselectortext = '<label>Action</label><select class="form-control actionname" name="actionname' + formgroupnumber + '-1" id="actionname' + formgroupnumber + '-1" number = "' + formgroupnumber + '">';
    for (i = 0; i < actionsavailablelist.length; i++) {
      actionselectortext += '<option number="' + formgroupnumber + '" value="' + actionsavailablelist[i] + '">' + actionprettytext[actionsavailablelist[i]] + '</option>';
    }
    actionselectortext += '</select>';
    $actionarea.html(actionselectortext);
    var actionnamestring = '#actionname' + formgroupnumber + '-1';
    selectedaction = $(actionnamestring).val();
    if (actionqualifiertexts[selectedaction] != null){
      var valueselectortext = '<label>' + actionqualifiertexts[selectedaction] + '</label><input name="actionqualifier' + formgroupnumber + '-1" class="form-control" type="' +  actioninputtypes[selectedaction] + '"/>';
      $actionarea.append(valueselectortext);

    }
    $actionarea.siblings('input[name = "numactions"]').val(1);


  }
  if ($(this).val() == 'entity') {
    var childentitynamefield = '<label class="entitychildnamelabel" for="entitychildname' + formgroupnumber + '">Entity Child Name:</label> \
    <input type="text" name="entitychildname' + formgroupnumber + '" id="entitychildname' + formgroupnumber + '" class="form-control entitychildname">';
    $actionarea.html(childentitynamefield);
  }
  else {
    $(this).siblings('.entitychildname').remove();
    $(this).siblings('.entitychildnamelabel').remove();
  }
  $(this).hide();

}

function fieldchange() {
  console.log($(this).attr('number'));
  formgroupnumber = $(this).attr('number');
  $actionarea = $(this).siblings('.actionarea');
  var fieldtype = $(this).val();
  console.log('ft' + fieldtype);
  var actionsavailablelist =  actionsavailable[fieldtype]
  if (actionsavailablelist == null) {
    console.log('nully');
    $actionarea.text('There are no actions available for this field type.');
    $actionarea.siblings('input[name = "numactions"]').val(0);
  }
  else {
    var actionselectortext = '<label>Action</label><select class="form-control actionname" name="actionname' + formgroupnumber + '-1" id="actionname' + formgroupnumber + '-1" number = "' + formgroupnumber + '">';
    for (i = 0; i < actionsavailablelist.length; i++) {
      actionselectortext += '<option number="' + formgroupnumber + '" value="' + actionsavailablelist[i] + '">' + actionprettytext[actionsavailablelist[i]] + '</option>';
    }
    actionselectortext += '</select>';
    $actionarea.html(actionselectortext);
    var actionnamestring = '#actionname' + formgroupnumber + '-1';
    selectedaction = $(actionnamestring).val();
    if (actionqualifiertexts[selectedaction] != null){
      var valueselectortext = '<label>' + actionqualifiertexts[selectedaction] + '</label><input name="actionqualifier' + formgroupnumber + '-1" class="form-control" type="' +  actioninputtypes[selectedaction] + '"/>';
      $actionarea.find('.actionname').after(valueselectortext);

    }
    $actionarea.siblings('input[name = "numactions"]').val(1);
  }
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
    <option value="file">File</option> \
    <option value="phone">Phone Number</option> \
    </select> \
    <button type="button" id = "newactionbtn'+formgroupnumber+'" group = "'+formgroupnumber+'" number ="'+formgroupnumber+'" class = "newactionbtn btn btn-default"> Add a New Action! </button> \
    <input type="hidden" name = "numactions" value = "0">\
    <div class="actionarea">\
    </div> \
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

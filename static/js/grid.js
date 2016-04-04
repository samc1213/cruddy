$(document).ready( function() {
  $('.addgridbtn').click( function() {
    $(this).attr('disabled', 'disabled');
  });
  for (var i = 5; i < 70; i++){
    $('#fontsize').append($("<option></option>")
         .attr("value",i)
         .text(i));
    }
  coloroptions = {'black': 'Black', 'white':'White', 'red':'Red','blue':'Blue','green':'Green','yellow':'Yellow'}
  for (htmlcolor in coloroptions) {
    var colortext = coloroptions[htmlcolor];
    $('#fontcolor').append($("<option></option>")
         .attr("value",htmlcolor)
         .text(colortext));
  }
  styleoptions = {'normal': 'Normal', 'italic':'Italic',}
  for (htmlstyle in styleoptions) {
    var style = styleoptions[htmlstyle];
    $('#fstyle').append($("<option></option>")
         .attr("value",htmlstyle)
         .text(style));
  }
  $(document).on('click', '.gs-w', function(e) {
    highlight($(e.target));
  });
  $('#customfontarea').change(updatefontstuff);
  var url =window.location.href;
  var urlsplitarr = url.split('/');
  var ename = urlsplitarr[urlsplitarr.length - 1];
  console.log("/getgrid/" + ename);
  $.get( "/getgrid/" + ename, function( data ) {
    gridjson = data;
    gridwidth = $('.gridster').width()*0.9;
    console.log(gridwidth);
    numcols = 6;
    count = 0;
    colwidth = gridwidth / 6;
    gridsteryo = $(".gridster ul").gridster({
        jsonArr: gridjson,
        widget_margins: [10, 10],
        widget_base_dimensions: [colwidth, 15],
        max_cols: numcols,
        min_cols: numcols,
        resize: {enabled: true},
        serialize_params: function($w, wgd) { return { col: wgd.col, row: wgd.row, size_x: wgd.size_x, size_y: wgd.size_y, name:$w.text(), fieldnamenumber:$w.attr('fieldnamenumber'), fontsize:$w.attr('fontsize'), fontcolor:$w.attr('fontcolor'), fstyle:$w.attr('fstyle')} }
    }).data('gridster');
    if (gridjson != '') {
      var json = jQuery.parseJSON(gridjson);
      for (i = 0; i < json.length; i++) {
          var item = json[i];
          console.log(item);
          // $('#' + item.id).attr('data-row', item.row).attr('data-col', item.col);
            widgetstr = '<li';
          for (var key in item) {
            if (key != 'name' & key != 'size_x' & key != 'size_y' & key != 'col' & key != 'row') {
              widgetstr += ' ' + key + '="' + item[key] + '"';
            }
          }
          widgetstr += '>' + item['name'] + '</li>'
          console.log(widgetstr + item['col'] +  item['row']);
          var buttonid = 'btn' + item['name'];
          $("#" + buttonid).attr('disabled', 'disabled');
        //  fieldnamenumber="' + item.fieldnamenumber + '">';
          gridsteryo.add_widget(widgetstr, item['size_x'], item['size_y'], item['col'], item['row']);
      }
      console.log('GJ' + gridjson);
    }
    $('.sidebar').children().each(function(){
      console.log($(this).attr('id'));
      if ($(this).attr('id') != ""){
        $(this).click(function(){
          console.log('bullshit');
            gridsteryo.add_widget('<li fstyle="normal" fontcolor="black" fontsize="12" fieldnamenumber="' + $(this).attr('fieldnamenumber') + '">'+$(this).attr('id').substr(3)+'</li>', 6, 2);
            highlight($('li[fieldnamenumber="' + $(this).attr('fieldnamenumber') + '"]'));
        });
      }
      //fix this shit
      // if (count ==0 && $(this).attr('id') != ""){
      //   $(this).attr('id')
      //   gridsteryo.add_widget('<li fieldnamenumber="' + $(this).attr('fieldnamenumber') + '">'+$(this).attr('id').substr(3)+'</li>', 6, 2);
      //   count ++;
      //   }
    });

  // }
  });
  // console.log(getgrid() + 'heyo');
  // gridster.add_widget()
  console.log($('.sidebar').children());

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

function savegrid() {
  var gridster = $(".gridster ul").gridster().data('gridster');
  var gridjson = JSON.stringify(gridster.serialize());
  console.log('GRIDJAYFORSAVE'  + gridjson);
  var url =window.location.href;
  var urlsplitarr = url.split('/');
  var ename = urlsplitarr[urlsplitarr.length - 1]
  $.post( "/savegrid/" + ename, { gridjson: gridjson } );
  console.log();
}

function highlight($gridbox) {
  $('#curfieldspan').text($gridbox.text());
  $('#fontsize').val($gridbox.attr('fontsize'));
  $('#fontcolor').val($gridbox.attr('fontcolor'));
    $('#fstyle').val($gridbox.attr('fstyle'));
  $('#currentboxfieldnamenum').val($gridbox.attr('fieldnamenumber'));
  console.log('highlight');
  updatefontstuff();
}

function updatefontstuff() {
  $('.gs-w[fieldnamenumber="' + $('#currentboxfieldnamenum').val() + '"]').attr('fontsize', $('#fontsize').val());
  $('.gs-w[fieldnamenumber="' + $('#currentboxfieldnamenum').val() + '"]').attr('fontcolor', $('#fontcolor').val());
  $('.gs-w[fieldnamenumber="' + $('#currentboxfieldnamenum').val() + '"]').attr('fstyle', $('#fstyle').val());
  console.log('update');
}

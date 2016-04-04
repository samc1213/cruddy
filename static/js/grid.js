$(document).ready( function() {
  $('.addgridbtn').click( function() {
    $(this).attr('disabled', 'disabled');
  });
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
        serialize_params: function($w, wgd) { return { col: wgd.col, row: wgd.row, size_x: wgd.size_x, size_y: wgd.size_y, name:$w.text(), fieldnamenumber:$w.attr('fieldnamenumber')} }
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
            gridsteryo.add_widget('<li fieldnamenumber="' + $(this).attr('fieldnamenumber') + '">'+$(this).attr('id').substr(3)+'</li>', 6, 2);
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
  var url =window.location.href;
  var urlsplitarr = url.split('/');
  var ename = urlsplitarr[urlsplitarr.length - 1]
  $.post( "/savegrid/" + ename, { gridjson: gridjson } );
  console.log();
}

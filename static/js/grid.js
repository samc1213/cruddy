$(document).ready( function() {
  gridwidth = $('.gridster').width();
  console.log(gridwidth);
  numcols = 6;
  count = 0;
  colwidth = gridwidth / 6;
  gridsteryo = $(".gridster ul").gridster({
      widget_margins: [10, 10],
      widget_base_dimensions: [colwidth, 15],
      max_cols: numcols,
      min_cols: numcols,
      resize: {enabled: true},
  }).data('gridster');
  // gridster.add_widget()
  console.log($('.sidebar').children());
  $('.sidebar').children().each(function(){
    console.log($(this).attr('id'));
    if ($(this).attr('id') != ""){
      $(this).click(function(){
          gridsteryo.add_widget('<li>'+$(this).attr('id').substr(2)+'</li>', 6, 2);
      });
    }
    //fix this shit
    if (count ==0 && $(this).attr('id') != ""){
      $(this).attr('id')
      gridsteryo.add_widget('<li>'+$(this).attr('id').substr(2)+'</li>', 6, 2);
      count ++;
      }
  });
});

// function addnewli(val) {
//   console.log('addingnewli');
//   gridsteryo.add_widget('<li>'+val+'</li>', 6, 2);
// }
      // var gridster;

      // // same object than generated with gridster.serialize() method
      // var serialization = [
      //   {
      //       col: 1,
      //       row: 1,
      //       size_x: 6,
      //       size_y: 1
      //   }
      // ];


      // // sort serialization
      // serialization = Gridster.sort_by_row_and_col_asc(serialization);

      // $(function(){

      //   gridster = $(".gridster ul").gridster({
      //     widget_base_dimensions: [100, 55],
      //     widget_margins: [5, 5]
      //   }).data('gridster');


      //   $('.js-seralize').on('click', function() {
      //       gridster.remove_all_widgets();
      //       $.each(serialization, function() {
      //           gridster.add_widget('<li />', this.size_x, this.size_y, this.col, this.row);
      //       });
      //   });

      // });

function addnewfield() {
  console.log('addingnewfiled');
  var lastfieldid = 'fg' + (numfields);
  console.log(lastfieldid);
  $lastformgroup = $form.find('#' + lastfieldid);
  numfields += 1;
  $lastformgroup.after(makenewinputformgroup(numfields));
  $numfieldsinput.val(numfields);
}

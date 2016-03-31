$(document).ready( function() {
  gridwidth = $('.gridster').width();
  console.log(gridwidth);
  numcols = 6;
  colwidth = gridwidth / 6;
  $(".gridster ul").gridster({
      widget_margins: [10, 10],
      widget_base_dimensions: [colwidth, 15],
      max_cols: numcols,
      min_cols: numcols,
  });
});

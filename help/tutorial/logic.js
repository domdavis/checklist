jQuery(document).ready(function(){
  $('#blue').change(function() {
    new Toggle('blue').colour('btn-primary')
  })
  $('#yellow').change(function() {
    new Toggle('yellow').colour('btn-warning')
  })
})

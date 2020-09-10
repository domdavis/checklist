$(document).ready(function () {
  $('#brief').change(function () {
    if (!$(this).prop('checked')) {
      return
    }

    const userid = $('#userid').val()
    const toggle = new Toggle('brief')

    if (!userid) {
      toggle.colour('btn-primary')
      return
    }

    const base = `https://www.simbrief.com/api/xml.fetcher.php`
    const url = base + `?username=` + userid + `&json=1`

    $.getJSON(url).done(function (data) {
      toggle.colour('btn-success')
      update(new Briefing(data))
    }).fail(function () {
      toggle.colour('btn-warning')
    })
  })
})





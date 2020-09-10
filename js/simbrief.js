
jQuery(document).ready(function () {
  let briefing = {}

  $('#fetch').click(function () {
    const userid = $('#userid').val()

    if (!userid) {
      notesFor('fetch', 'No user set!')
      return
    }

    const base = `https://www.simbrief.com/api/xml.fetcher.php`
    const url = base + `?username=` + userid + `&json=1`

    $.getJSON(url).done(function (data) {
      briefing = new Briefing(data)
      notesFor('fetch', 'Flight plan ('+ briefing.origin + '/' + briefing.destination+ ') loaded successfully')
      update(briefing)
    }).fail(function () {
      notesFor('fetch', 'Failed to load flight plan!')
    })
  })

  $('.scratch').change(function() {
    update(briefing)
  })
})





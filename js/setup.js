$(function () {
  $('#fly').click(function() {
    const aircraft = $('#aircraft').val()

    if (!aircraft) {
      error('aircraft', 'No aircraft selected!')
      return
    }

    let params = {}

    $('input').each((i, opt) => {
      if (opt.type === 'checkbox') {
        params[opt.id] = opt.checked
      }

      if (opt.type === 'text') {
        params[opt.id] = opt.value
      }
    })

    location.href = root + '/' + aircraft + "?" + $.param(params)
  })
})

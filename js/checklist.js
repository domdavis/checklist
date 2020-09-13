const urlParams = new URLSearchParams(window.location.search)

function Briefing(data) {
  this.data = data
}

Briefing.prototype.string = function() {
  return Array.prototype.slice.apply(arguments).reduce((xs, x) =>
    (xs && xs[x]) ? xs[x] : undefined, this.data)
}

Briefing.prototype.number = function() {
  let val = Array.prototype.slice.apply(arguments).reduce((xs, x) =>
    (xs && xs[x]) ? xs[x] : undefined, this.data)

  if (val !== undefined) {
    val = number(val)
  }

  return val
}

let briefing = new Briefing()

$(function() {
  $('[data-requires]').each(function() {
    if (urlParams.get($(this).data('requires')) !== 'true') {
      $(this).hide()
    }
  })

  const username = urlParams.get('simbrief')

  if (username) {
    const base = `https://www.simbrief.com/api/xml.fetcher.php`
    const url = base + `?username=` + username + `&json=1`

    $.getJSON(url).done(function(data) {
      briefing = new Briefing(data)
      hint('flight-plan', join('Loaded flight plan for ',
        briefing.string('origin', 'icao_code'), '/',
        briefing.string('destination', 'icao_code')))
      $('#flight-plan').bootstrapToggle('on')
      update()
    }).fail(function() {
      error('flight-plan', 'Failed to load flight plan!')
    })
  }

  $('.scratch').on('change keypress paste input', update)
})

const update = () => {
  const passengers = briefing.number('general', 'passengers')
  const businessPax = $('#business-pax')
  const economyPax = $('#economy-pax')

  let business = number(businessPax.val())
  let economy = number(economyPax.val())

  if (passengers) {
    business = business > passengers ? 0 : business
    economy = passengers - business
    economyPax.val(economy)
    economyPax.prop('disabled', true)
  }

  const zfwcg = $('#zfwcg').val()

  const zfw = convert(tonnes, briefing.number('weights', 'est_zfw'),
    briefing.string('params', 'units'))

  const oat = number($('#oat').val())
  const isa = briefing.number('general', 'avg_temp_dev')
  const elevation = briefing.number('origin', 'elevation')

  let flex

  if (oat && elevation) {
    flex = Math.floor(((elevation / 1000) * 1.98) + isa + oat)
  }

  const runway = briefing.string('origin', 'plan_rwy')
  const departure = $('#rwy').val()

  const course = $('#departure-crs')

  if (!course.val()) {
    course.val($('#crs').val())
  }

  hint('fuel', measurement(lbs, briefing.number('fuel', 'plan_ramp'),
    briefing.string('params', 'units')))
  hint('business-weight', measurement(lbs, business * pax.weight))
  hint('economy-weight', measurement(lbs, economy * pax.weight))
  hint('cargo', measurement(lbs, (business + economy) * pax.luggage))
  hint('callsign', briefing.string('general', 'icao_airline'))
  hint('flight', briefing.string('general', 'flight_number'))
  hint('fin', briefing.string('api_params', 'fin'))
  hint('to-from', join(briefing.string('origin', 'icao_code'), '/',
    briefing.string('destination', 'icao_code')))
  hint('flight-number', briefing.string('general', 'flight_number'))
  hint('crz', join(briefing.string('atc', 'initial_alt'), '/'))
  hint('runway', join('RWY ', runway))
  hint('route', join(briefing.string('origin', 'icao_code'), '/', runway,
    ' ', briefing.string('general', 'route'), ' ',
    briefing.string('destination', 'icao_code'), '/',
    briefing.string('destination', 'plan_rwy')))
  hint('cog', optionalPair(zfw, zfwcg))
  hint('block', convert(tonnes, $('#fuel-loaded').val(),
    briefing.string('params', 'units')))
  hint('flex', flex)
  hint('autopilot', optionalPair(course.val(), $('#alt').val()) )

  if (runway && departure && runway !== departure) {
    hint('departure', join('Flight plan (', runway,
      ') does not match departure (', departure, ')'))
  }

  hint('transponder', $('#squawk').val())
  hint('radio', $('#tower').val())
  hint('standby', $('#freq').val())
}

const optionalPair = (a, b) => {
  let str

  if (a && b) {
    str = a + '/' + b
  } else if (a && !b) {
    str = a + '/'
  } else if (!a && b) {
    str = '/' + b
  }

  return str
}

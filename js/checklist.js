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

  let cog

  if (zfwcg && zfw) {
    cog = zfwcg + '/' + zfw
  } else if (zfwcg && !zfw) {
    cog = zfwcg + '/'
  } else if (!zfwcg && zfw) {
    cog = '/' + zfw
  }

  const oat = number($('#oat').val())
  const isa = briefing.number('general', 'avg_temp_dev')
  const elevation = briefing.number('origin', 'elevation')

  let flex

  if (oat && elevation) {
    flex = Math.floor(((elevation/1000) * 1.98) + isa + oat)
  }

  hint('fuel', measurement(lbs, briefing.number('fuel', 'plan_ramp'),
    briefing.string('params', 'units')))
  hint('business-weight', measurement(lbs, business * pax.weight))
  hint('economy-weight', measurement(lbs, economy * pax.weight))
  hint('cargo', measurement(lbs, (business + economy) * pax.luggage))
  hint('callsign', briefing.string('atc', 'callsign'))
  hint('fin', briefing.string('api_params', 'fin'))
  hint('to-from', join(briefing.string('origin', 'icao_code'), '/',
    briefing.string('destination', 'icao_code')))
  hint('crz', join(briefing.string('atc', 'initial_alt'), '/'))
  hint('runway', join('RWY ', briefing.string('origin', 'plan_rwy')))
  hint('route', briefing.string('general', 'route'))
  hint('cog', cog)
  hint('block', convert(tonnes, briefing.number('fuel', 'plan_ramp'),
    briefing.string('params', 'units')))
  hint('flex', flex)
}

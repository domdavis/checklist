const lbsPerKG = 2.20462
const kgsPerLB = 0.453592
const businessClass = 10
const paxWeightLBS = 175
const luggageWeightLBS = 55

$(document).ready(function () {
  $('#brief').change(function () {
    if (!$(this).prop('checked')) {
      return
    }

    const userid = $('#userid').val()

    if (!userid) {
      colour('brief', 'btn-primary')
      return
    }

    const base = `https://www.simbrief.com/api/xml.fetcher.php`
    const url = base + `?username=` + userid + `&json=1`

    $.getJSON(url).done(function (data) {
      colour('brief', 'btn-success')
      calculate(data)
    }).fail(function () {
      colour('brief', 'btn-warning')
    })
  })
})

function calculate (data) {
  const units = data['params']['units']
  const pax = data['general']['passengers']

  label('fuel', lbs(data['fuel']['plan_ramp'], units))
  label('economy', lbs((pax - businessClass) * paxWeightLBS))
  label('cargo', lbs(pax * luggageWeightLBS))
}

function kgs(units, weight) {
  if (units !== 'kgs') {
    weight = Math.round(weight * kgsPerLB)
  }

  return Number(weight).toLocaleString() + ' kg'
}

function lbs(weight, units) {
  if (units === 'kgs') {
    weight = Math.round(weight * lbsPerKG)
  }

  if (weight < 0) {
    weight = 0
  }

  return Number(weight).toLocaleString() + ' lbs'
}

function label(item, check) {
  const labels = $("label[for='" + item + "']")
  labels[0].textContent = check
  labels[1].textContent = check
}

function colour(item, colour) {
  const labels = $("label[for='" + item + "']")
  labels.first().removeClass('btn-success')
  labels.first().addClass(colour)
}


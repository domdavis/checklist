const lbs = "lbs"
const kgs = "kgs"
const tonnes = "t"

const defaults = {
  businessClassPax: 10,
  paxWeightLBS: 175,
  luggageWeightLBS: 55
}

const conversion = {
  kgs: { lbs: 0.453592, t: 1000 },
  lbs: { kgs: 2.20462, t: 2204.62 },
  t: { kgs: 0.001, lbs: 0.000453592, precision: 1}


}

const notesFor = (id, text) => {
  $('#' + id + "-notes").html('<small>'+text+'</small>')
}

const textFor = (name, text) => {
  if ( text === undefined || text === "") {
    return
  }

  const labels = $("label[for='" + name + "']")

  labels.first().text(text)
  labels.last().text(text)
}

const convert = (unit, value, units) => {
  let scalar
  let precision
  let lookup = conversion[unit]

  if (lookup) {
    scalar = lookup[units]
    precision = lookup.precision
  }

  if (!scalar) {
    scalar = 1
  }
  if (!precision) {
    precision = 0
  }

  value = value * scalar

  if (value < 0) {
    value = 0
  }

  if (isNaN(value)) {
    return ''
  }

  return Number(value).toLocaleString(undefined,
    {
      maximumFractionDigits: precision,
      minimumFractionDigits: precision,
    })
}

const displayValue = (unit, value, units) => {
  return convert(unit, value, units) + ' ' + unit
}

function join() {
  let text = ""
  Array.prototype.slice.apply(arguments).forEach(arg => {
    if (arg !== undefined) {
      text = text + arg
    }
  })

  return text
}


function Briefing(briefing) {
  this.units = briefing['params']['units']
  this.passenger_count = briefing['general']['passengers']
  this.flight = briefing['general']['flight_number']
  this.route = briefing['general']['route']
  this.isa = briefing['general']['avg_temp_dev']
  this.origin = briefing['origin']['icao_code']
  this.elevation = briefing['origin']['elevation']
  this.destination = briefing['destination']['icao_code']
  this.block_fuel = briefing['fuel']['plan_ramp']
  this.zfw = briefing['weights']['est_zfw']
}






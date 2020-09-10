const lbs = "lbs"
const kgs = "kgs"

const defaults = {
  businessClassPax: 10,
  paxWeightLBS: 175,
  luggageWeightLBS: 55
}

const conversion = {
  kgs: { lbs: 2.20462 },
  lbs: { kg: 0.453592}
}

const convert = (unit, value, units) => {
  let scalar
  let lookup = conversion[unit]

   if (lookup) {
     scalar = lookup[units]
   }

  if (!scalar) {
    scalar = 1
  }

  console.log(value, scalar)
  value = Math.round(value * scalar)

  if (value < 0) {
    value = 0
  }

  return Number(value).toLocaleString() + ' ' + unit
}

function Briefing(briefing) {
  this.units = briefing['params']['units']
  this.block_fuel = briefing['fuel']['plan_ramp']
  this.passenger_count = briefing['general']['passengers']
}



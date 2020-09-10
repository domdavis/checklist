const update = briefing => {
  const zfwcg = $('#zfwcg').val()
  const oat = $('#oat').val()

  textFor('fuel', displayValue(lbs, briefing.block_fuel, briefing.units))
  textFor('economy', displayValue(lbs, (briefing.passenger_count -
    defaults.businessClassPax) * defaults.paxWeightLBS))
  textFor('cargo', displayValue(lbs,
    briefing.passenger_count * defaults.luggageWeightLBS))
  notesFor('to-from', join(briefing.origin, '/', briefing.destination))
  notesFor('flight-number', briefing.flight)
  notesFor('route', briefing.route)
  textFor('cog', join(zfwcg, '/', convert(tonnes, briefing.zfw, briefing.units)))
  textFor('block', convert(tonnes, briefing.block_fuel, briefing.units))
  textFor('flex', flex(briefing.isa, briefing.elevation, oat))
}

const flex = (isa, elevation, oat) => {
  if (elevation === '' || oat === '' || isNaN(elevation) || isNaN(oat)) {
    return ''
  }

  isa=parseFloat(isa)
  oat=parseFloat(oat)

  return 'AS REQ(' + Math.floor(((elevation/1000) * 1.98) + isa + oat) + ')'
}

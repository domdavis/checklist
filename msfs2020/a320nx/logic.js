const update = briefing => {
  textFor('fuel', convert(lbs, briefing.block_fuel, briefing.units))
  textFor('economy', convert(lbs, (briefing.passenger_count -
    defaults.businessClassPax) * defaults.paxWeightLBS))
  textFor('cargo', convert(lbs,
    briefing.passenger_count * defaults.luggageWeightLBS))
}

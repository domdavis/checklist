const root = "/config"

document.addEventListener('touchstart', function () {}, true)

$(function () {
  $('[data-toggle="popover"]').popover()

  $('.popover-dismiss').popover({
    trigger: 'focus'
  })
})

const lbs = 'lbs'
const kgs = 'kgs'
const tonnes = 't'

const pax = {
  weight: 175,
  luggage: 55
}

const conversion = {
  kgs: {lbs: 0.453592, t: 1000},
  lbs: {kgs: 2.20462, t: 2204.62},
  t: {kgs: 0.001, lbs: 0.000453592, precision: 1}
}

const convert = (unit, value, units) => {
  if (!number(value)) {
    return undefined
  }

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
    return undefined
  }

  return Number(value).toLocaleString(undefined,
    {
      maximumFractionDigits: precision,
      minimumFractionDigits: precision,
    })
}

const measurement = (unit, value, units) => {
  return join(convert(unit, value, units), ' ', unit)
}

const comment = (id, msg, show, colour) => {
  if (!msg) {
    return
  }

  const comment = $('#' + id + '-comment')
  const icon = $('#' + id + '-icon')

  if (comment) {
    icon.removeClass((index, className) => {
      return (className.match (/\btext-\S+/g) || []).join(' ');
    })

    comment.text(msg)
    comment.addClass(colour)
  }

  if (icon) {
    icon.removeClass((index, className) => {
      return (className.match (/\bfa-\S+/g) || []).join(' ');
    })

    icon.addClass(show)
    icon.addClass(colour)
  }
}

const error = (id, msg) => {
  comment(id, msg, 'fa-exclamation-circle', 'text-danger')
}

const hint = (id, msg) => {
  comment(id, msg, 'fa-info-circle', 'text-info')
}

const number = n => {
  return isNaN(+n) ? 0 : +n
}

const join = (...args) => {
  let failed
  let msg = ''

  args.forEach(arg => {
    if (arg === undefined || arg === null) {
      failed = true
      return
    }

    msg += arg
  })

  return failed ? undefined : msg
}

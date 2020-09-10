const textFor = (toggle, text) => {
  new Toggle(toggle).label(text)
}

function Toggle (name) {
  this.labels = $("label[for='" + name + "']")
}

Toggle.prototype.label = function(text) {
  this.labels.first().text(text)
  this.labels.last().text(text)
}

Toggle.prototype.colour = function(item, colour) {
  this.labels.first().removeClass('btn-success')
  this.labels.first().addClass(colour)
}

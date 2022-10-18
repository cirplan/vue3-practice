let price = 5
let quntity = 2
let total = 0

let dep = new Set()

let effect = () => {
  total = price * quntity
}

function track() {
  dep.add(effect)
}

function trigger() {
  dep.forEach(effect => effect())
}

track()
effect()

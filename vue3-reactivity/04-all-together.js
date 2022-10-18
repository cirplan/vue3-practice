const targetMap = new WeakMap()

function track(target, key) {
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }

  dep.add(effect)
}

function trigger(target, key) {
  let depsMap = targetMap.get(target)
  if (!depsMap) return
  let dep = depsMap.get(key)
  if (dep) {
    dep.forEach(effect => {
      effect()
    })
  }
}

function reactive(target) {
  const handlers = {
    get(target, key, receiver) {
      let result = Reflect.get(target, key, receiver)
      track(target, key)
      return result
    },
    set(target, key, value, receiver) {
      let oldValue = target[key]
      let result = Reflect.set(target, key, value, receiver)
      if (result && oldValue !== result) {
        trigger(target, key)
      }
      return result
    }
  }

  return new Proxy(target, handlers)
}

let product = reactive({ price: 5, quantity: 2 })
let total = 0

let effect = () => {
  total = product.price * product.quantity
}

effect()

console.log('before updated quantity total = ' + total)
product.quantity = 3
console.log('after updated quantity total = ' + total)
console.log('Updated quantity to = ' + product.quantity)

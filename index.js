const Promise = require('bluebird');

function isClass(obj) {
  const isCtorClass = obj.constructor
      && obj.constructor.toString().substring(0, 5) === 'class'
  if(obj.prototype === undefined) {
    return isCtorClass
  }
  const isPrototypeCtorClass = obj.prototype.constructor
    && obj.prototype.constructor.toString
    && obj.prototype.constructor.toString().substring(0, 5) === 'class'
  return isCtorClass || isPrototypeCtorClass
}

function promisifyAll (object, options) {
  options = options || {};

  if (!options.suffix) {
    options.suffix = 'Async';
  }

  if (isClass(object) || (object.prototype && Object.getOwnPropertyNames(object.prototype).length > 1)) {
    const methods = Object.getOwnPropertyNames(object.prototype);

    for (const index in methods) {
      const property = methods[index];

      if (property !== 'constructor' && typeof object.prototype[property] === 'function') {

        object.prototype[property + options.suffix] = function () {
          const args = Array.prototype.slice.call(arguments);
          return Promise.fromCallback((callback) => {
            object.prototype[property].apply(this, [...args, callback]);
          })
        };
      }
    }
  } else {
    for (const property in object) {
      if (object.hasOwnProperty(property) && typeof object[property] === 'function') {
        object[property + options.suffix] = function () {
          const args = Array.prototype.slice.call(arguments);
          return Promise.fromCallback((callback) => {
            object[property].apply(this, [...args, callback]);
          })
        };
      }
    }
  }

  return object;
}

module.exports = promisifyAll;
module.exports.default = promisifyAll;

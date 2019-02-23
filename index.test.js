const promisifyAll = require('./index');

test('promisifies POJO', () => {
  expect(
    Object.keys(promisifyAll({
      string: 'test',
      bool: false,
      func: () => {}
    }))
  ).toEqual([
    'string',
    'bool',
    'func',
    'funcAsync'
  ]);
});

test('promisifies classes', () => {
  class Test {
    constructor() {

    }

    someMethod () {

    }
  }

  const Promisified = promisifyAll(Test);


  expect(new Promisified()).toHaveProperty('someMethod');
  expect(new Promisified()).toHaveProperty('someMethodAsync');
});

test('promisifies classes & preserves context', () => {
  class Test {
    constructor() {

    }

    someMethod (callback) {
      callback(null, this);
    }
  }
  expect.assertions(1);

  const instance = new (promisifyAll(Test));

  return expect(instance.someMethodAsync()).resolves.toBe(instance);
});

test('promisifies ES5 classes', () => {

  function Test () {}

  Test.prototype.someMethod = function (callback) {
    callback(null, this);
  }

  expect.assertions(1);

  const instance = new (promisifyAll(Test));

  return expect(instance.someMethodAsync()).resolves.toBe(instance);
});

test('passes through args', () => {

  class Test {
    constructor() {

    }

    resolve (arg1, callback) {
      callback(null, arg1);
    }
  }

  expect.assertions(1);

  const instance = new (promisifyAll(Test));

  return expect(instance.resolveAsync('test')).resolves.toBe('test');
});

test('handles errors', () => {

  class Test {
    constructor() {

    }

    reject (arg1, callback) {
      callback(arg1);
    }
  }

  expect.assertions(1);

  const instance = new (promisifyAll(Test));

  return expect(instance.rejectAsync(new Error('test'))).rejects.toBeInstanceOf(Error);
});

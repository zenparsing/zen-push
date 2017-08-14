'use strict';

var Observable = require('zen-observable');

function addMethods(target, methods) {
  Object.keys(methods).forEach(function(k) {
    var desc = Object.getOwnPropertyDescriptor(methods, k);
    desc.enumerable = false;
    Object.defineProperty(target, k, desc);
  });
}

function send(observers, message, value) {
  var list = [];

  observers.forEach(function(observer) {
    list.push(observer);
  });

  list.forEach(function(observer) {
    try {
      switch (message) {
        case 'next': return observer.next(value);
        case 'error': return observer.error(value);
        case 'complete': return observer.complete(value);
      }
    } catch (e) {
      setTimeout(function() { throw e; }, 0);
    }
  });
}

function PushStream() {
  var observers = new Set();
  this._observers = observers;
  this._observable = new Observable(function(observer) {
    observers.add(observer);
    return function() { observers.delete(observer); };
  });
}

addMethods(PushStream.prototype, {
  get observable() { return this._observable; },
  get observed() { return this._observers.size > 0; },
  next: function(x) { send(this._observers, 'next', x); },
  error: function(e) { send(this._observers, 'error', e); },
  complete: function(x) { send(this._observers, 'complete', x); },
});

module.exports = PushStream;

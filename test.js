'use strict';

const assert = require('assert');
const PushStream = require('./');

class MockObserver {
  next(x) { this.nextValue = x; }
  error(e) { this.errorValue = e; }
  complete(x) { this.completeValue = x; }
}

{ // Sending values and errors
  let pusher = new PushStream();
  let a = new MockObserver();
  let b = new MockObserver();

  pusher.observable.subscribe(a);
  pusher.observable.subscribe(b);

  pusher.next(1);

  assert.equal(a.nextValue, 1);
  assert.equal(b.nextValue, 1);

  pusher.next(2);

  assert.equal(a.nextValue, 2);
  assert.equal(b.nextValue, 2);

  pusher.error(3);

  assert.equal(a.errorValue, 3);
  assert.equal(b.errorValue, 3);
}

{ // Sending complete
  let pusher = new PushStream();
  let a = new MockObserver();
  let b = new MockObserver();

  pusher.observable.subscribe(a);
  pusher.observable.subscribe(b);

  pusher.complete(1);
  assert.equal(a.completeValue, 1);
  assert.equal(b.completeValue, 1);
}

# PR: add order creation and a happy-path test

The new test substitutes the insert method and invokes createOrder once. It
does not run two requests against the persistence implementation.

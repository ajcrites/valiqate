# Valiqate -- Promise-based validation

Turning validation upside-down, the Valiqate library
allows setting conditions in a chain and performing an
operation on success/failure.

## Valiqate
The Valiqate function allows you to make simple conditional
checks that are tied to the success/failure of the particular
Valiqate object.  You can create a new `Valiqate` instance
by calling the package:

    var valiqate = require("valiqate")();

### `.check`
The `.check` method checks a provided condition and records
it as a success or failure with the provided success/failure
messages.

`.check` works with two sets of arguments: a boolean or
function condition with an optional failure message, or
a single object argument with required properties.

#### Providing Object Argument

* `name` -- the name of this particular condition.  This
 is used in the `Valiqate` success/fail callbacks.
* `condition` -- the condition itself.  It can either be
 a boolean, a function that returns a boolean, or a function
 that returns a promise.

There are also optional arguments:

* `context` -- `this` within the provided `condition` if
 it is a function.
* `failure` -- failure message (if condition is `false` or
 `.fail` is triggered on the returned promise).
* `success` -- success message (if condition is `true` or
 `.then` is triggered on the returned promise).

#### Boolean condition
You can use:

    vch.check(condition);
    vch.check(condition, "failure message");

This simplifies the checking API, but the checks are
unnamed.  They will be passed as variadic arguments starting
with the first argument in the `fail` method.  If no
failure string is provided, an empty string will be.

### `.chain`
Creates a new `Chain`.  Provide a string naming the chain
as well as an optional context for conditional functions
within the chain and an optional success string if all
conditions in the chain are met.

`Chain`s will not execute conditional functions that are
chained to them if the chain is broken by a condition
failing.

### `.succeed`
Provide a callback function that is executed when all
conditions have passed (are *truthy* or execute a `.then`
method of a promise).

The first argument passed to the callback is an object
that has all of the provided `name` properties corresponding
to all of the provided `success` messages (or empty strings
if none are provided).

Success messages are optional and generally not needed.

### `.fail`
Analogous to `.succeed` but if any `.check` or `.chain`
fails on a condition.  This occurs if the condition is
`falsey`, is a function that returns a `falsey` value, or
is a promise that executes the `.fail` method.

## `Chain`
The `Chain` object allows you to chain conditions together.
This is useful because you can specify validation functions
that are not executed if an earlier condition fails.  This
also works with promises.

### `.check`
The `.check` method is identical to the `Valiqate` except
that it only works with the condition or condition+message
syntax.

##  Usage

Simple usage revolves around checking provided conditions
and using failure messages.  A simple form can be
validated in this way with each individual input checked.

```javascript
var valiqate = require("valiqate")();
valiqate.check({
    name: "name",
    condition: name.length >= 5,
    failure: "Name must be at least 5 characters long",
    success: "Name is valid!"
});
valiqate.check({
    name: "password",
    condition: password.length >= 5,
    failure: "Password must be at least 5 characters long",
    success: "Password is valid!"
});

valiqate.succeed(function (msgs) {
    msgs.name == "Name is valid!";
    msgs.password == "Password is valid!";
})
// `.fail` can be chained to `.succeed` and vice versa
.fail(function (msgs) {
    msgs.name == Name must be at least 5 characters long";
    msgs.password == "Password must be at least 5 characters long";
});
```

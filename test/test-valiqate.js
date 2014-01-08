var should = require("should"),
    valiqate = require("../src/valiqate")
;

describe("valiqate", function () {
    describe("simple", function () {
        it("should fail with simple validation", function (done) {
            var vch = valiqate();

            vch.check(4 > 5, "failure");

            vch.fail(function (msgs, msg) {
                msg.should.match(/failure/);
                done();
            });
        });

        it("should fail with simple validation object check", function (done) {
            var vch = valiqate();

            vch.check({
                name: "name",
                condition: 4 > 5,
                failure: "failure"
            });

            vch.fail(function (msgs) {
                msgs.name.should.match(/failure/);
                done();
            });
        });

        it("should succeed with simple validation", function (done) {
            vch = valiqate();

            vch.check(4 < 5);

            vch.succeed(function () {
                done();
            });
        });

        it("should succeed with simple validation with message", function (done) {
            vch = valiqate();

            vch.check({
                name: "name",
                condition: 4 < 5,
                success: "success"
            });

            vch.succeed(function (msgs) {
                msgs.name.should.match(/success/);
                done();
            });
        });
    });
});

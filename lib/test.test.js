"use strict";
test("fail", done => {
    console.log("a");
    done.fail();
    console.log("b");
});
test("success", done => {
    console.log("c");
    done();
    console.log("d");
});

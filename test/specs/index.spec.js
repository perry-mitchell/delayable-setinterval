const sleep = require("sleep-promise");
const { clearDelayedInterval, setDelayedInterval: _setDelayedInterval } = require("../../source/index.js");

describe("setDelayedInterval", function() {
    let setDelayedInterval;

    beforeEach(function() {
        this.ids = [];
        setDelayedInterval = (...args) => {
            const id = _setDelayedInterval(...args);
            this.ids.push(id);
            return id;
        };
    });

    afterEach(function() {
        this.ids.forEach(id => clearDelayedInterval(id));
    });

    it("returns an ID", function() {
        const result = setDelayedInterval(() => {}, 50);
        expect(result).to.be.a("string").and.to.have.length.above(0);
    });

    it("fires synchronously", function() {
        const spy = sinon.spy();
        const interval = setDelayedInterval(spy, 100);
        return sleep(350).then(() => {
            clearDelayedInterval(interval);
            expect(spy.callCount).to.equal(3);
        });
    });

    it("handles asynchronous tasks", function() {
        const spy = sinon.stub().callsFake(() => sleep(200));
        const interval = setDelayedInterval(spy, 100);
        return sleep(650).then(() => {
            clearDelayedInterval(interval);
            expect(spy.callCount).to.equal(2);
        });
    });

    it("does not fire callback if cancelled beforehand", function() {
        const spy = sinon.spy();
        const interval = setDelayedInterval(spy, 200);
        return sleep(100).then(() => {
            clearDelayedInterval(interval);
            expect(spy.callCount).to.equal(0);
        });
    });

    it("does not fire another timer if cancelled during callback execution", function() {
        const spy = sinon.stub().callsFake(() => sleep(200));
        const interval = setDelayedInterval(spy, 100);
        return sleep(150)
            .then(() => {
                clearDelayedInterval(interval);
            })
            .then(() => sleep(300))
            .then(() => {
                expect(spy.callCount).to.equal(1);
            });
    });
});

const __intervals = {};

function clearDelayedInterval() {
    const interval = __intervals[id];
    if (!interval) {
        return;
    }
    clearTimeout(interval.timer);
    interval.timer = null;
    delete __intervals[id];
}

function generateID() {
    return `${Date.now()}:${Math.floor(Math.random() * 1000000)}`;
}

function restartTimer(id) {
    const interval = __intervals[id];
    if (!interval) {
        throw new Error(`No interval found for ID: ${id}`);
    }
    if (interval.timer !== null) {
        throw new Error(`Interval already running on ID: ${id}`);
    }
    interval.timer = setTimeout(() => {
        if (!interval.timer) {
            // Stop if timer has been cleared
            return;
        }
        let result;
        try {
            result = interval.fn();
        } catch (err) {}
        if (result && typeof result.then === "function") {
            const taskComplete = () => {
                if (!interval.timer) {
                    // Stop if timer has been cleared
                    return;
                }
                interval.timer = null;
                restartTimer(id);
            };
            result.then(
                taskComplete,
                taskComplete
            );
        }
        interval.timer = null;
        restartTimer(id);
    }, interval.delay);
}

function setDelayedInterval(fn, delay) {
    const id = generateID();
    __intervals[id] = {
        delay,
        fn,
        timer: null
    };
    restartTimer(id);
    return id;
}

module.exports = {
    clearDelayedInterval,
    setDelayedInterval
};

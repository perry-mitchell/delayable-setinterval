interface DelayedInterval {
    delay: number;
    fn: DelayedIntervalCallback;
    timer: ReturnType<typeof setTimeout>;
}

export type DelayedIntervalCallback = (...args: Array<any>) => any;

export type DelayedIntervalID = string;

const __intervals: Record<DelayedIntervalID, DelayedInterval> = {};

export function clearDelayedInterval(intervalID: DelayedIntervalID): void {
    if (!intervalID || !__intervals[intervalID]) {
        return;
    }
    clearTimeout(__intervals[intervalID].timer);
    __intervals[intervalID].timer = null;
    delete __intervals[intervalID];
}

function generateID(): DelayedIntervalID {
    return `${Date.now()}:${Math.floor(Math.random() * 1000000)}`;
}

function restartTimer(id: DelayedIntervalID) {
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
            return;
        }
        interval.timer = null;
        restartTimer(id);
    }, interval.delay);
}

export function setDelayedInterval(fn: DelayedIntervalCallback, delay: number): DelayedIntervalID {
    const id = generateID();
    __intervals[id] = {
        delay,
        fn,
        timer: null
    };
    restartTimer(id);
    return id;
}

const PENDING = 'pending';
const RESOLVE = 'resolve';
const REJECTED = 'rejected';

class MyPromise {
    constructor(exector) {
        this.status = PENDING;
        this.value = undefined;
        this.reason = undefined;
        this.onFulfilledCbs = [];
        this.onRejectedCbs = [];

        const resolve = (value) => {
            if (this.status !== PENDING) {
                return;
            }
            setTimeout(() => {
                this.value = value;
                this.status = RESOLVE;
                this.onFulfilledCbs.forEach(cb => {
                    cb(this.value);
                })
            })
        }

        const rejected = (reason) => {
            if (this.status !== PENDING) {
                return;
            }
            setTimeout(() => {
                this.reason = reason;
                this.status = REJECTED;
                this.onRejectedCbs.forEach(cb => {
                    cb(reason)
                })
            })
        }
        exector(resolve, rejected);
    }

    resolvePromise = (promise2, x, resolve, rejected) => {
        if (x === promise2) {
            return reject(new TypeError('[TypeError: Chaining cycle detected for promise #<Promise>]'));
        }
        if (x instanceof MyPromise) {
            x.then(resolve, rejected);
        } else {
            resolve(x);
        }
    }

    then = (onFulfilled, onRejected) => {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : error => { throw error };

        if (this.status === PENDING) {
            let promise2 = new MyPromise((resolve, rejected) => {
                this.onFulfilledCbs.push((value) => {
                    try {
                        const x = onFulfilled(value);
                        this.resolvePromise(promise2, x, resolve, rejected);

                    } catch (error) {
                        rejected(error)
                    }
                })
                // console.log('----->list', this.onRejectedCbs);
                this.onRejectedCbs.push((reason) => {
                    try {
                        const x = onRejected(reason);
                        this.resolvePromise(promise2, x, resolve, rejected);
                    } catch (error) {
                        rejected(error);
                    }
                })
            })
            return promise2;
        } else if (this.status === RESOLVE) {
            let promise2 = new MyPromise((resolve, rejected) => {
                try {
                    const x = onFulfilled(this.value);
                    this.resolvePromise(promise2, x, resolve, rejected);

                } catch (error) {
                    rejected(error)
                }
            })
        } else {
            let promise2 = new MyPromise((resolve, rejected) => {
                try {
                    const x = onRejected(this.reason)
                    this.resolvePromise(promise2, x, resolve, rejected);
                } catch (error) {
                    rejected(error)
                }
            })

        }

    }

    catch = (onRejected) => {
        return this.then(null, onRejected);
    }

}


let readFilePromise = (filename) => {
    return new MyPromise((resolve, reject) => {
        setTimeout(() => {
            if (filename === './003.txt') {
                reject('-------------->' + filename)
                return;
            }
            resolve(filename);
        }, 1000);
    })
}
// readFilePromise('./001.txt').then(data => {
//     console.log(data.toString());
//     return readFilePromise('./002.txt');
// }).then(data => {
//     console.log(data.toString());
//     return readFilePromise('./003.txt');
// }).then(data => {
//     console.log('读取003成功', data);
// }).catch(error => {
//     console.log('失败', error)
// })

const p1 = readFilePromise('./001.txt');

const p2 = p1.then(data => {
    console.log(data.toString());
    return readFilePromise('./002.txt');
})

const p3 = p2.then(data => {
    console.log(data.toString());
    return readFilePromise('./003.txt');
})

const p4 = p3.then(data => {
    console.log('读取003成功', data);
})

const p5 = p3.catch(error => {
    console.log('失败', error)
})



/*
 * @Author: CoyoteWaltz <coyote_waltz@163.com>
 * @Date: 2020-08-06 22:50:17
 * @LastEditTime: 2020-08-07 00:09:51
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description: 并发限制的异步任务调度器
 * @TODO:
 */
class Scheduler {
  waitQueue = [];
  limit;
  cnt = 0;
  constructor(limit = 2) {
    this.limit = limit;
  }
  add(promiseCreator, ...args) {
    return new Promise((resolve, reject) => {
      // 把 resolve 闭包入这个 task 是很妙的 只有当 promiseCreator 真正执行回调的时候才调用
      const task = this.createTask(promiseCreator, args, resolve, reject);
      if (this.cnt < this.limit) {
        task();
      } else {
        this.waitQueue.push(task);
      }
    });
  }

  // 封装一个 任务 fn
  createTask(fn, args, resolve, reject) {
    return () => {
      // 执行 就++ 可以放到第一句
      this.cnt++;
      fn(args)
        .then(resolve)
        .catch(reject)
        .finally(() => {
          // 结束之后 让下一个等待的任务启动
          this.cnt--;
          if (this.waitQueue.length) {
            const task = this.waitQueue.shift();
            task();
          }
        });
      // 执行 就++ 可以放到第一句
      // this.cnt++;
    };
  }
}

const timeout = (time) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(time);
    }, time);
  });

const scheduler = new Scheduler();

const addTask = (time, order) => {
  scheduler
    .add(() => {
      return timeout(time);
    })
    .then(() => console.log(order));
};

addTask(1000, 1);
addTask(500, 2);
addTask(300, 3);
addTask(400, 4);
// 2 3 1 4
// 同时最多运行的任务只有两个

// Promise.race([
//   timeout(4000).then(console.log),
//   timeout(3000).then(console.log),
// ]).then((res) => console.log(res));

// Promise.resolve(123)
//   // .then((res) => {
//   //   console.log(444);
//   //   return res;
//   // })
//   .finally(() => {
//     console.log('finally');
//   })
//   .then((res) => {
//     console.log(res);
//   });

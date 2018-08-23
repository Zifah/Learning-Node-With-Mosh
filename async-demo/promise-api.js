const p = Promise.reject(new Error("Promise Rejected!"));

p
    .then(result => console.log(result))
    .catch(err => console.log(err));
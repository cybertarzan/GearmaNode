
var gearmanode = require('../lib/gearmanode');


// simplest sample for README.md
var worker = gearmanode.worker();
worker.addFuntion('reverse', function (job) {
    var rslt = job.payload.split("").reverse().join("");
    job.workComplete(rslt);
});
worker.removeFuntion('reverse');

// var worker = gearmanode.worker();
// worker.addFuntion('sleep', function (job) {
//     var seconds = new Number(job.payload);
//     var cnt = 0;
//     var tmo = function() {
//         if (cnt < seconds) {
//             cnt ++;
//             console.log('== sleep: idx=' + cnt + ', ' + job.toString());
//             job.reportStatus(cnt, seconds);
//             setTimeout(tmo, 1000);
//         } else {
//             job.workComplete();
//         }
//     }
//     tmo();
// });
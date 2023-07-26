/**
 * @param {number} n
 * @return {number[][]}
 */
var generateMatrix = function (n) {
    let l = 0
    let t = 0
    let r = n - 1
    let b = n - 1
    let num = 1;
    let tar = n * n;
    const map = [];
    while (num <= tar) {
        for (let i = l; i <= r; i++) {
            fill(t, i, num);
            num++;
        }
        t++;
        for (let i = t; i <= b; i++) {
            fill(i, r, num);
            num++;
        }
        r--;
        for (let i = r; i >= l; i--) {
            fill(b, i, num);
            num++;
        }
        b--;
        for (let i = b; i >= t; i--) {
            fill(i, l, num);
            num++;
        }
        l++;
    }
  
    function fill(i, j, num) {
        if (!map[i]) {
            map[i] = [];
        }
        map[i][j] = num;
    }
    return map;
  };
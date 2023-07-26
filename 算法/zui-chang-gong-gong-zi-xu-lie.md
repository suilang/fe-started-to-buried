**题目**： 给定两个字符串 text1 和 text2，返回这两个字符串的最长公共子序列的长度。

**描述**：一个字符串的 子序列 是指这样一个新的字符串：它是由原字符串在不改变字符的相对顺序的情况下删除某些字符（也可以不删除任何字符）后组成的新字符串。

例如，"ace" 是 "abcde" 的子序列，但 "aec" 不是 "abcde" 的子序列。两个字符串的「公共子序列」是这两个字符串所共同拥有的子序列。

若这两个字符串没有公共子序列，则返回 0。

**代码**

```
var longestCommonSubsequence = function(text1, text2) {
    const dp = [];
    const m = text1.length;
    const n = text2.length;
    for(let i = 0;i <= m; i++){
        for(let j = 0;j <=n; j++ ){
            if(i === 0 || j === 0){
                dp[i] = dp[i] || [];
                dp[i][j] = 0;
                continue;
            }
            if(text1[i-1] === text2[j-1]){
                dp[i][j] = dp[i-1][j-1] + 1;
            }else{
                dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]); 
                
            }
        }
    }
    dp.forEach(d=>{
        console.log(d)
    })
   
    return dp[m][n];
};
console.log(longestCommonSubsequence('abcde', 'ace'))

```





### 参考文档
1. 题目来源：[力扣](https://leetcode-cn.com/problems/longest-common-subsequence)

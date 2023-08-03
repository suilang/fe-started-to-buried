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

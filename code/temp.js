var repeatedSubstringPattern = function(s) {
  const str = s + s;
  console.log('-->', str, str.indexOf(s,1))
  return str.indexOf(s,1) !== -1
};

console.log(repeatedSubstringPattern('aba'))
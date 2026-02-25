// console.log("test");
var isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

console.log(isDark ? "dark" : "light");

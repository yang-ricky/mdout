var process = require('child_process');

var fs = require("fs");
var path = require("path");
var list = [];
function listFile(dir){
  var arr = fs.readdirSync(dir);
  arr.forEach(function(item){
    var fullpath = path.join(dir,item);
    var stats = fs.statSync(fullpath);
    if(stats.isDirectory()){
      listFile(fullpath);
    }else{
      list.push(fullpath);
    }
  });
  return list;
}

const inputDir = './input';

const output = inputDir + '/output'

if (fs.existsSync(output)) {
  fs.rmdirSync(output);
}
fs.mkdirSync(output);

const files = listFile(inputDir);

console.log(files);
console.log("准备生成pdf文档")

files
.filter(file=>file.includes(".md"))
.forEach(file => {
  const pdfFileName = file.split("/").pop().replace(".md", ".pdf");
  process.exec(`mdout ${file} -o ${output}/${pdfFileName}`,function (error, stdout, stderr) {
          if (error !== null) {
            console.log('exec error: ' + error);
          }
  });
})


console.log("生成完成")
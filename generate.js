var process = require('child_process');
var rimraf = require("rimraf");

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

//

const output = inputDir + '/output'

// if (fs.existsSync(commentsRemovedDir)) {
//   rimraf.sync(commentsRemovedDir);
// }
// fs.mkdirSync(commentsRemovedDir);

if (fs.existsSync(output)) {
  rimraf.sync(output);
}
fs.mkdirSync(output);

const files = listFile(inputDir);

console.log("清理html临时文件")

console.log("按时间戳重新打标签，且删除评论部分")

files.forEach(file=>{
  if (file.endsWith('.html')) {
    fs.unlinkSync(file);
  }
})


console.log(files);
console.log("准备生成pdf文档")

function wait(second) {
    // execSync 属于同步方法；异步方式请根据需要自行查询 node.js 的 child_process 相关方法；
    let ChildProcess_ExecSync = require('child_process').execSync;
    ChildProcess_ExecSync('sleep ' + second);
};


let number = 0;


function main() {
  files
  .filter(file=>file.includes(".md"))
  .sort((a,b)=> {
    const aTime = a.split("/").pop().split("$")[0];
    const bTime = b.split("/").pop().split("$")[0];
    return  parseInt(aTime) - parseInt(bTime);
  })
  .forEach(file => {
    const pdfFileName = file.split("/").pop().replace(".md", ".pdf");
    //const fileWithSequence = getSequence(number) + "$" + pdfFileName.split("$")[1];
    const cmd = `mdout ${file} -o ${output}/${pdfFileName}`
    console.log(cmd)
    process.exec(cmd,function (error, stdout, stderr) {
      console.log("完成了吗？")
      if (error !== null) {
          console.log('exec error: ' + error);
      }
    });
    wait(8);
    number++;
  })
}

process.exec("mdout input/1582704710@中国供应链到底有多厉害？.md -o ./input/output/1582704710$中国供应链到底有多厉害？.pdf",function (error, stdout, stderr) {
      console.log("完成了吗？")
      if (error !== null) {
              console.log('exec error: ' + error);
            }
    });

//main()

function getSequence(number) {
  if(number<10) {
    return "00" + number;
  } else if (number<100) {
    return "0" + number;
  }
}

console.log("生成完成")
const XLSX = require('xlsx')
const path = require('path')
const fs = require('fs')
// 读取所有表格
const workbook = XLSX.readFile('./Input/stylecolor.xlsx')
// const workbook = XLSX.readFile('./Input/0124.xlsx')
// console.log(workbook)
// 读取所有sheet名称数组
const sheetNames = workbook.SheetNames
console.log(sheetNames)

// 中文json
let zhCN = {}
// 日文json
let jaJP = {}
// 英文JSON
let enUS = {}
// id对应的key
let idJSON = {}

// 首字母大写
function toUpCase (s) {
  // return s.toLowerCase().replace(/\b([\w|']+)\b/g, function (word) {
  var words = s.split(/[\s\-]/);
  for(i = 0; i < words.length; i ++){
    words[i] = words[i].charAt(0).toUpperCase()+words[i].slice(1);
  }
  return words.join('')
  // })
}

// 首字母大写并移除空格
// function removeSpace (str) {
//   return toUpCase(str).replace(/\s*/g, '')
// }

// 首字母大写并移除空格去掉 `s
function removedots (str) {
  return (toUpCase(str).replace('\'s', ''))
}


function generate () {
  // console.log(sheetNames)
  // console.log(XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[3]]))
  sheetNames.forEach(sheetName => {
    // const worksheet = workbook.Sheets[sheetName]
    const worksheet = workbook.Sheets[sheetName]
    const worksheetJson = XLSX.utils.sheet_to_json(worksheet)
    // console.log(worksheetJson)
    worksheetJson.forEach(data => {
      let keys = removedots(data.key)
      // key值为sheet+点英文双驼峰组合，value值分别为中文，英文，日文，id
      zhCN[sheetName+'.'+keys] = data.zh
      enUS[sheetName+'.'+keys] = data.en
      jaJP[sheetName+'.'+keys] = data.jp
      idJSON[sheetName+'.'+keys] = data.id
    })
    // console.log(JSON.stringify(zhCN))
    // console.log(JSON.stringify(enUS))
    // console.log(JSON.stringify(jaJP))

    // TODO 写文件 文件名 zhCN.[sheetName].json  分别导出sheet名为文件名的多个文件
    let newfileChinesepath = path.join(__dirname, `/Output/zhCN.${sheetName}.json`)
    let newfileEnglishpath = path.join(__dirname, `/Output/enUS.${sheetName}.json`)
    let newfileJapanesepath = path.join(__dirname, `/Output/jaJP.${sheetName}.json`)
    let newfileIdJson = path.join(__dirname, `/Output/idJSON.${sheetName}.json`)
    //写入中文为valuejs文件
    fs.writeFileSync(newfileChinesepath, JSON.stringify(zhCN))
    //写入英文为valuejs文件
    fs.writeFileSync(newfileEnglishpath, JSON.stringify(enUS))
    //写入日文为valuejs文件
    fs.writeFileSync(newfileJapanesepath, JSON.stringify(jaJP))
    //写入id为value的js文件
    fs.writeFileSync(newfileIdJson, JSON.stringify(idJSON))
    zhCN = {}
    enUS = {}
    jaJP = {}
    idJSON = {}
  })
}
// 生成指定语言版本文件
generate()

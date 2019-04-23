const XLSX = require('xlsx')
const path = require('path')
const fs = require('fs')
// 读取所有表格
// const workbook = XLSX.readFile('./Input/stylecolor1.xlsx')
const workbook = XLSX.readFile('./Input/0410.xlsx')
// 读取所有sheet名称数组
const sheetNames = workbook.SheetNames

// 中文简体json
let zhCN = {}
// 日文json
let jaJP = {}
// 英文JSON
let enUS = {}
// 香港繁体JSON
let zhHk = {}
// 意大利语JSON
let itIT = {}
// 法语JSON
let frFR = {}
// id对应的key
let idJSON = {}

let NewWorkSheetJson = []

// 首字母大写
function toUpCase (s) {
  if(typeof s === 'number'){
    return s
  }
  let words = s.split(/[\s\-]/);
  for(let i = 0; i < words.length; i ++){
    words[i] = words[i].charAt(0).toUpperCase()+words[i].slice(1);
  }
  return words.join('')
}

// 首字母大写并移除空格去掉 `s
// 没有key会导出失败
function removedots (str) {
  if(typeof str === 'number') return str
  return (toUpCase(str).replace('\'s', ''))
}

function generate () {
  // console.log(XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[3]]))
  sheetNames.forEach(sheetName => {
    // const worksheet = workbook.Sheets[sheetName]
    const worksheet = workbook.Sheets[sheetName]
    // console.log(worksheet)
    const worksheetJson = XLSX.utils.sheet_to_json(worksheet)
    // console.log(worksheetJson)
    worksheetJson.forEach((data, index) => {
      const perItem = Object.values(data)
      for(let i = 0;i<perItem.length;i++){
        if(perItem[i]==null||typeof(perItem[i])==undefined){
          perItem.splice(i,1);
          i=i-1;
        }
      }
      if(perItem.length<4){
        worksheetJson.splice(index, 1)
      }
    })
    worksheetJson.forEach(item=>{
      keys = removedots(item.key)
      // key值为sheet+点英文双驼峰组合，value值分别为中文，英文，日文，id
      zhCN[sheetName+'.'+keys] = item.zh
      enUS[sheetName+'.'+keys] = item.en
      jaJP[sheetName+'.'+keys] = item.jp
      zhHk[sheetName+'.'+keys] = item.zhHK
      itIT[sheetName+'.'+keys] = item.itIT
      frFR[sheetName+'.'+keys] = item.frFR
      idJSON[sheetName+'.'+keys] = item.id
    })
    let newfileChinesepath = path.join(__dirname, `/Output/zhCN.js`)
    let newfileEnglishpath = path.join(__dirname, `/Output/enUS.js`)
    let newfileJapanesepath = path.join(__dirname, `/Output/jaJP.js`)
    let newfileTraditionalChinesepath = path.join(__dirname, `/Output/zhHK.js`)
    let newfileItalianpath = path.join(__dirname, `/Output/itIT.js`)
    let newfileFrenchpath = path.join(__dirname, `/Output/frFR.js`)
    let newfileIdJson = path.join(__dirname, `/Output/idJSON.js`)
    //写入中文为valuejs文件
    fs.writeFileSync(newfileChinesepath, 'export default'+JSON.stringify(zhCN))
    //写入英文为valuejs文件
    fs.writeFileSync(newfileEnglishpath, 'export default'+JSON.stringify(enUS))
    //写入日文为valuejs文件
    fs.writeFileSync(newfileJapanesepath, 'export default'+JSON.stringify(jaJP))
    //写入繁体中文为valuejs文件
    fs.writeFileSync(newfileTraditionalChinesepath, 'export default'+JSON.stringify(zhHk))
    //写入意大利语为valuejs文件
    fs.writeFileSync(newfileItalianpath, 'export default'+JSON.stringify(itIT))
    //写入法语为valuejs文件
    fs.writeFileSync(newfileFrenchpath, 'export default'+JSON.stringify(frFR))
    //写入id为value的js文件
    fs.writeFileSync(newfileIdJson, 'export default'+JSON.stringify(idJSON))
  })
}
// 生成指定语言版本文件
generate()

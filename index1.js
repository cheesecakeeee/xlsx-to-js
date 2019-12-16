// id为颜色，value为中文，汤良浩临时要但没有使用
const XLSX = require('xlsx')
const path = require('path')
const fs = require('fs')

// 读取所有表格
const workbook = XLSX.readFile('./Input/style.xlsx')

// 读取所有sheet名称数组
const sheetNames = workbook.SheetNames

// 颜色对应的zh
let idColor = {}

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
      keys = item.id
      // key值为sheet+点英文双驼峰组合，value值分别为中文，英文，日文，id
      idColor[keys] = item.zh
    })
    let newfileIdColor = path.join(__dirname, `/Output/idColor.js`)

    //写入颜色对应中文的js文件
    fs.writeFileSync(newfileIdColor, 'export default'+JSON.stringify(idColor))
  })
}
// 生成指定语言版本文件
generate()


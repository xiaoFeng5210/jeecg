//  根据是否筛选处理传过来的JSON数据
//  KFormbuild组件就可以拿到每个搜索项的表单JSON数据了
//  TODO 递归获取list,递归还需要优化
//  jsondata参数为传过来的JSON数据
//  arr为jsondata里的list
export const translateJsonData = (jsondata, arr, queryJsonDataList) => {
  arr.forEach((v, i) => {
    if (Array.isArray(v.columns || v.list)) {
      return translateJsonData(jsondata, v.columns || v.list, queryJsonDataList)
    }
    // 判断是否为筛选条件
    if (v.options.isScreeningConditions === 'true') {
      queryJsonDataList.push({
        list: [v],
        config: jsondata.config
      })
    }
  })
}
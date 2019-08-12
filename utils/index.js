const checksNullArray = arr => Array.isArray(arr) && arr.length

const minValueOfArray = (arr, attr) => Math.min.apply(Math, arr.map(item => item[attr])) 

const maxValueOfArray = (arr, attr) => Math.max.apply(Math, arr.map(item => item[attr]))

const randomValue = maxValue => Math.floor(Math.random() * maxValue)

module.exports = {
    checksNullArray,
    minValueOfArray,
    maxValueOfArray,
    randomValue
}
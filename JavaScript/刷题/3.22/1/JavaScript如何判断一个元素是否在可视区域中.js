// JavaScript如何判断一个元素是否在可视区域中
// 图片的懒加载
// 列表的无限滚动
// 计算广告元素的曝光情况
// 可点击链接的预加载

// 解决方案
// offsetTop、scrollTop
// getBoundingClientRect
// Intersection Observer

// 获取向上或者左滚动的距离
// window.scrollX / ie window.pageXOffset
// window.scrollY / ie window.pageYOffset

// 避免兼容问题
const scrollX = ((target = document.documentElement) || (target = document.body.parentNode)) && target.scrollLeft ?? document.body.scrollLeft

const scrollY = ((target = document.documentElement) || (target = document.body.parentNode)) && target.scrollTop ?? document.body.scrollTop
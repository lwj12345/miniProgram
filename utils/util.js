const requestPromise = myUrl => {
  // 返回一个Promise实例对象 
  return new Promise((resolve, reject) => {
    wx.request({
      url: myUrl,
      header: {'content-type':'application/json'},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: res => resolve(res)
    })
  })
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}
function imageUtil(e) {
  var imageSize = {};
  var originalWidth = e.detail.width;//图片原始宽
  var originalHeight = e.detail.height;//图片原始高
  var originalScale = originalHeight/originalWidth;//图片高宽比
  //获取屏幕宽高
  wx.getSystemInfo({
      success: function (res) {
          var windowWidth = res.windowWidth;
          var windowHeight = res.windowHeight;
          console.log(windowHeight)
          var windowscale = windowHeight/windowWidth;//屏幕高宽比
          if(originalScale < windowscale){//图片高宽比小于屏幕高宽比
              //图片缩放后的宽为屏幕宽
              imageSize.imageWidth = windowWidth;
              // imageSize.imageHeight = (windowWidth * originalHeight) / originalWidth;
              imageSize.imageHeight = windowHeight;
          }else{//图片高宽比大于屏幕高宽比
              //图片缩放后的高为屏幕高
              //不用管那么多，直接全部都是高为屏幕的高就可以实现全屏展示
              imageSize.imageHeight = windowHeight;
              imageSize.imageWidth = (windowHeight * originalWidth) / originalHeight;
          }
      }
  })
  return imageSize;
}
module.exports = {
  imageUtil,
  requestPromise
}

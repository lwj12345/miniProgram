// pages/detail/index.js
Page({
  data: {
    message:[]
  },
  onLoad: function (options) {
    var list = JSON.parse(options.detail)
    this.setData({
      message:list
    })
  },
  //点击发票图片实现放大预览功能
  previewImage:function(e){
    var urls = []
    //获取data上面的数据时候，必须要加上this.data，表示获取到data上的值
    var u1 = this.data.message.pictureUrl
     urls.push(u1)  
     wx.previewImage({
       urls:urls
     })
   },
})
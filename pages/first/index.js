import util from '../../utils/util.js'
const utilApi = require('../../utils/util.js')
Page({
  data: {
    imagewidth: 0,//缩放后的宽
    imageheight: 0,//缩放后的高
    userInfo: {},
    hasUserInfo: false,
    code:'',
    userOpenid:''
  },
  //设置图片宽高进行不同机型的全屏
  imageLoad: function (e) {
    var imageSize = util.imageUtil(e)
    this.setData({
      imagewidth: imageSize.imageWidth,
      imageheight: imageSize.imageHeight
    })
  },
    //上传图片，访问接口
    getLocalImage:function(){
      var that=this;
      wx.chooseImage({
        count: 1, // 默认9
        success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        wx.showLoading({
          title:'识别中',
          mask:true
        }),
        wx.uploadFile({
        url: 'https://www.auroralab.cloud/oss/getUploadInfo', //此处换上你的接口地址
        filePath: tempFilePaths[0],
        name: 'file',
        header: { 
        "Content-Type": "multipart/form-data",
        'accept': 'application/json',
        'Authorization': 'Bearer ..' //若有token，此处换上你的token，没有的话省略
        },
        formData:{
        'user':'test' //其他额外的formdata，可不写
        },
          success: function(res){
            console.log(res)
            var aa = JSON.parse(res.data)
            console.log(aa)
            if(aa.code==20000){
              var Allobj = res.data
              wx.hideLoading();
              wx.navigateTo({
                url: '/pages/result/index?message='+Allobj,
              }); 
              wx.showModal({
               title:'识别成功',
               content:'单击可进行修改',
             })
            }else{
              wx.showToast({
                title: '识别失败,请上传发票图片',
                icon:'none',
                duration: 1500
               })
            }
          }, 
          fail: function(res){
              
          },
        })
        }   
        })
  },
    toHistory:function(e){
         wx.login({
          success: res => { 
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            this.setData({
              code:res.code
            })
            utilApi.requestPromise('https://www.auroralab.cloud/user/userLogin?code='+res.code)
            .then(res=>{
              var openid = res.data.data.openId
              wx.navigateTo({
                url: '/pages/history/index?openid='+openid,
              });
              this.setData({
                userOpenid:res.data.data.openId
              })
            })  
          }
        })
    },
    usemethod:function(e){
      wx.navigateTo({
        url: '/pages/usermethod/index',
      });
    },
  onLoad: function (options) {

  }
})
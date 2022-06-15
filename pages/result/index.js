const utilApi = require('../../utils/util.js')
Page({
  data: {
    message:{},
    pictureUrl:'',
    code:'',
    userOpenid:'',
    invoiceNum:'',
    code:''
  },
  onLoad: function (options) {
    var _obj=options.message;
    var info = JSON.parse(_obj)
    this.setData({
      message:info.data.billVo,
      pictureUrl:info.data.url,
      invoiceNum:info.data.billVo.invoiceNum
    }),
      // 登录,获取用户openId
      wx.login({
        success: res => { 
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          this.setData({
            code:res.code
          })
          utilApi.requestPromise('https://www.auroralab.cloud/user/userLogin?code='+res.code)
          .then(res=>{
            this.setData({
              userOpenid:res.data.data.openId
            })
          })  
        }
      })  
  },
 //点击发票图片实现放大预览功能
 previewImage:function(e){
  var urls = []
  //获取data上面的数据时候，必须要加上this.data，表示获取到data上的值
  var u1 = this.data.pictureUrl
   urls.push(u1)  
   wx.previewImage({
     urls:urls
   })
 },
 SaveInfo(e){
  //新建一个数组，将productList中的数据
  wx.request({
    url: 'https://www.auroralab.cloud/oss/bill/addBill',
    data: {
      purchaserName:e.detail.value.Name,
      purchaserRegisterNum:e.detail.value.Num,
      purchaserAddress:e.detail.value.Address,
      purchaserBank:e.detail.value.Bank,
      sellerName:e.detail.value.SellerName,
      sellerRegisterNum:e.detail.value.SellerRegisterNum,
      sellerAddress:e.detail.value.SellerAddress,
      sellerBank:e.detail.value.SellerBank,
      payee:e.detail.value.Payee,
      checker:e.detail.value.Checker,
      noteDrawer:e.detail.value.NoteDrawer,
      "productList": [
        {
          "billId": "string",
          "commodityAmount": e.detail.value.commodityAmount,
          "commodityName": e.detail.value.commodityName,
          "commodityNum":e.detail.value.commodityNum,
          "commodityPrice": e.detail.value.commodityPrice,
          "commodityTax":e.detail.value.commodityTax,
          "commodityTaxRate": e.detail.value.commodityTaxRate
        }
      ],
      totalTax:e.detail.value.TotalTax,
      amountInFiguers:e.detail.value.AmountInFiguers,
      userOpenid:this.data.userOpenid,
      pictureUrl:this.data.pictureUrl,
      invoiceNum:this.data.invoiceNum
    },
    header: {'content-type':'application/json'},
    method: 'POST',
    dataType: 'json',
    responseType: 'text',
    success: (result) => {
      console.log(result)
      this.setData({
        code:result.data.code
      })
      if(result.data.code===20000){
            wx.showToast({
              title:'保存成功',
              icon: 'success',  
              duration:2000  
            })
            setTimeout(function () {
              wx.redirectTo({
                url: '/pages/first/index',
              });
             },2000)
      }else{
        wx.showToast({
          title:'该发票已存在,可在识别记录中查看',
          icon:'none',
          duration:2000
        })
        setTimeout(function () {
          wx.redirectTo({
            url: '/pages/first/index',
          });
         },2000)
      }    
    },
    fail: (err) => {},
  });
},
  onUnload: function () {
    if (getCurrentPages().length == 2) {
      wx.navigateBack({
        delta: 1,
      })
    }
  }
})
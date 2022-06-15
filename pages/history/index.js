// pages/history/index.js
const utilApi = require('../../utils/util.js')
Page({
  data: {
    msg:[],
    backgroundColor:'',
    current_item:-1,
  },

  onLoad: function (options) {
    var userOpenid = options.openid
    this.setData({
      userOpenid:userOpenid
    })
    utilApi.requestPromise('https://www.auroralab.cloud/user/getUserInfo?openId='+userOpenid)
    .then(res=>{
      this.setData({
        msg:res.data.data,
      })
    })
      
  },
  changeColor:function(e){
   var that = this;
   //获取到当前下标
   let index = e.currentTarget.dataset.index;
   //从msg中获取数组
   var msgarr = this.data.msg;
   for(let i in msgarr.billVoList){
     if(i == index){
       console.log(msgarr.billVoList[i].productList[0].billId)
       var currentId = msgarr.billVoList[i].productList[0].billId
       //将获取到的biilId值传回给接口
          utilApi.requestPromise('https://www.auroralab.cloud/oss/bill/reimbursementBill?id='+currentId)
       //成功后再次请求接口，此时statu状态已经改变
          utilApi.requestPromise('https://www.auroralab.cloud/user/getUserInfo?openId='+this.data.userOpenid)
              .then(res=>{
                this.setData({
                  msg:res.data.data,
                })  
              })
     }
   }
  },
  detailmsg:function(e){
    var detail = JSON.stringify(e.currentTarget.dataset.item)
    wx.navigateTo({
      url:'/pages/detail/index?detail='+detail
    })
  },
  deleteInfo:function(e){
    console.log('12121211')
    var that = this;
    //获取到当前下标
    let index = e.currentTarget.dataset.index;
    //从msg中获取数组
    var msgarr = this.data.msg;
    for(let i in msgarr.billVoList){
      if(i == index){
        // console.log(msgarr.billVoList[i].productList[0].billId)
        var currentId = msgarr.billVoList[i].productList[0].billId
        wx.showModal({
          title: '提示',
          content: '确定要删除此发票吗？',
          success: (res) => {
            if(res.confirm){
               //将获取到的biilId值传回给接口
               console.log(currentId)
         wx.request({
            url: 'https://www.auroralab.cloud/oss/bill/deleteBill?id='+currentId,
            //data: {},
            header: {'content-type':'application/json'},
            method: 'DELETE',
            dataType: 'json',
            responseType: 'text',
            success: (result) => {
              utilApi.requestPromise('https://www.auroralab.cloud/user/getUserInfo?openId='+this.data.userOpenid)
           .then(res=>{
             that.setData({
               msg:res.data.data,
             })
           })
            },
            fail: () => {},
            complete: () => {}
          });
            
         
            }
            else if(res.cancel){
              console.log('点击了取消')
            }
             //成功后再次请求接口，此时statu状态已经改变
        
          },
          fail: () => {},
          complete: () => {}
        }); 
        // //成功后再次请求接口，此时statu状态已经改变
        //    utilApi.requestPromise('https://www.auroralab.cloud/user/getUserInfo?openId='+this.data.userOpenid)
        //        .then(res=>{
        //          that.setData({
        //            msg:res.data.data,
        //          })
        //        })
      }
    }
  }
})
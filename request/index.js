//这个文件是专门用来放请求的
//同时发送异步代码的次数
let ajaxTimes = 0;
export const request=(params)=>{
    ajaxTimes++;
    //显示加载中效果
    wx.showLoading({
        title:'加载中',
        mask:true
      })
    //定义公共的url
    const baseUrl = "https://www.auroralab.cloud"
    //resolve表示成功了，reject表示失败了
    return new Promise((resolve,reject)=>{
        wx.request({
            //将params的参数全部解构出来
            ...params,
            url:baseUrl + params.url,
            success:(result)=>{
                resolve(result)
            },
            fail:(err)=>{
                reject(err)
            }, 
            complete:()=>{
                ajaxTimes--;
                if(ajaxTimes===0){
                     //关闭正在等待的图标
                wx.hideLoading();
                }
                
            }
        });
          
    })
}
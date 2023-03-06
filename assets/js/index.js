$(function() {
  // 调用getUserInfo获取用户的基本信息
  getUserInfo()

  //退出登录
  $('#btnLogout').on('click', function() {
    layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function(
      index
    ) {
      //do something
      //1.清空本地存储中的token
      localStorage.removeItem('token')
      //2.重新跳转到登录页面
      location.href = './login.html'
      layer.close(index)
    })
  })
})
//获取用户基本的信息
function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    //headers 就说请求头部配置对象
    // headers: {
    //   Authorization: localStorage.getItem('token') || ''
    // },
    success: function(res) {
      if (res.status !== 0) return layui.layer.msg('获取用户信息失败!')
      renderAvatar(res.data)
    },
      //不论成功还是失败，最终都会调用complete回调函数
      //可全局挂载到ajaxPrefilter（）函数上
   /*  complete: function(res) {
      //   console.log(res)
      if (
        res.responseJSON.status === 1 &&
        res.responseJSON.message === '身份认证失败！'
      ) {
        //1.强制清空 token
        localStorage.removeItem('token')
        //2.强制跳转到登录页面
        location.href = './login.html'
      }
    } */
  })
}
//renderAvatar函数用于渲染头像
function renderAvatar(user) {
  //1.获取用户的名称
  let name = user.nickname || user.username
  //2.设置欢迎的文本
  $('#welcome').html(`欢迎&nbsp;&nbsp;${name}`)
  //3.按需渲染用户的头像
  if (user.user_pic !== null) {
    //3.1渲染图片头像
    $('.layui-nav-img')
      .attr('src', user.user_pic)
      .show()
    $('.text-avatar').hide()
  } else {
    let first = name[0].toUpperCase()
    $('.text-avatar')
      .html(first)
      .show()
    $('.layui-nav-img').hide()
  }
}

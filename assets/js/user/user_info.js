$(function() {
  const form = layui.form
  form.verify({
    nickname: function(value) {
      if (value.length > 6) {
        return '昵称长度必须在1-6个字符之间'
      }
    }
  })
  //初始化用户信息
  initUserInfo()

  //初始化用户信息的函数
  function initUserInfo() {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('获取用户信息失败！')
        }
        form.val('formUserInfo', res.data)
      }
    })
  }

  //重置表单数据
  $('#btnReset').on('click', function(e) {
    //阻止表单的默认重置行为
    e.preventDefault()
    //初始化用户信息
    initUserInfo()
  })

  //监听表单的提交
  $('.layui-form').on('submit', function(e) {
    //阻止默认行为
    e.preventDefault()
    //发起Ajax请求
    $.ajax({
      method: 'POST',
      url: '/my/userinfo',
      data: $(this).serialize(),
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('更新用户信息失败！' + res.message)
        }
        layer.msg('更新用户信息成功！')
        //调用父页面的方法，重新渲染用户头像和昵称
        window.parent.getUserInfo()
      }
    })
  })
})

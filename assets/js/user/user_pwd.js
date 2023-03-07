$(function() {
  const form = layui.form
  form.verify({
    // 自定义了一个叫做pwd校验规则
    pwd: [/^[\S]{6,12}$/, '密码必须6-12位，且不能出现空格'],
    repwd: value => {
      let pwdValue = $('[name=newPwd]').val()
      if (pwdValue !== value) return '两次密码不一致'
    },
    samepwd: function(value) {
      if (value === $('[name=oldPwd]').val()) {
        return '新旧密码不能相同'
      }
    }
  })
  //获取用户密码的函数
  /*   function getUserpwd() {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      success: function(res) {
        console.log(res)
        if (res.status !== 0) {
          return layer.msg('获取用户密码失败！')
        } else if ($('.oldpwd').val() !== res.data.password) {
          return layer.msg('原密码输入错误！')
        } else {
          //发起Ajax请求
          $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
              if (res.status !== 0) {
                return layer.msg('更新密码失败！')
              }
              layer.msg('更新密码成功！')
              //重置表单
              $('.layui-form')[0].reset()
            }
          })
        }
      }
    })
  } */
  //监听表单的提交
  $('.layui-form').on('submit', function(e) {
    //阻止默认行为

    e.preventDefault()
    // //判断原密码是否输入正确
    //   getUserpwd()
    //发起Ajax请求
    $.ajax({
      method: 'POST',
      url: '/my/updatepwd',
      data: $(this).serialize(),
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('更新密码失败！' + res.message)
        }
        layer.msg('更新密码成功！')

        //重置表单
        $('.layui-form')[0].reset()
        //1.清空本地存储中的token
        localStorage.removeItem('token')
        //2.重新跳转到登录页面
        window.parent.location.href = '../login.html'
      }
    })
  })
})

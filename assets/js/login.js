$(function() {
  //点击“去注册账号”的链接
  $('#link_reg').on('click', function() {
    $('.login-box').hide()
    $('.reg-box').show()
  })
  //点击“去登录”的链接
  $('#link_login').on('click', function() {
    $('.login-box').show()
    $('.reg-box').hide()
  })

  // 从layui中获取form对象
  const form = layui.form
  // 通过form.verify()函数自定义校验规则
  form.verify({
    // 自定义了一个叫做pwd校验规则
    pwd: [/^[\S]{6,12}$/, '密码必须6-12位，且不能出现空格'],
    repwd: value => {
      let pwdValue = $('.reg-box [name=password]').val()
      if (pwdValue !== value) return '两次密码不一致'
    }
  })

  // 监听注册表单的提交事件
  $('#form-reg').on('submit', function(e) {
    //   阻止默认的提交行为
    e.preventDefault()
    //   发起Ajax的post请求
    $.post(
      '/api/reguser',
      {
        username: $('#form-reg [name=username]').val(),
        password: $('#form-reg [name=password]').val()
      },
      function(res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        layer.msg('注册成功,请登录！')
        //   模拟人的点击行为
        $('#link_login').click()
      }
    )
  })
  //监听登录表单的提交事件
  $('#form-login').submit(function(e) {
    //   阻止默认的提交行为
    e.preventDefault()
    $.ajax({
      url: '/api/login',
      method: 'POST',
      data: $(this).serialize(),
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('登录失败！' + res.message)
        }
        layer.msg('登录成功！')
        localStorage.setItem('token', res.token)

        // 跳转到后台主页
        location.href = './index.html'
      }
    })
  })
})

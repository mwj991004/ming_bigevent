//注意：每次调用$.get()或$.post()或$.ajax()时，
//会先调用ajaxPrefilter 这个函数
//在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(options => {
  options.url = 'http://127.0.0.1:3007' + options.url
  //统一为有权限的接口设置headers请求头
  //   options.headers = {
  //     Authorization: localStorage.getItem('token') || ''
  //   }
  if (options.url.indexOf('/my/') !== -1) {
    options.headers = options.headers || {}
    options.headers.Authorization = localStorage.getItem('token') || ''
  }
  //全局统一挂载complete函数
  options.complete = function(res) {
    if (
      res.responseJSON.status === 1 &&
      res.responseJSON.message === '身份认证失败!'
    ) {
      //1.强制清空 token
      localStorage.removeItem('token')
      //2.强制跳转到登录页面
      if (window.parent) {
        window.parent.location.href = 'http://127.0.0.1:3007/login.html'
      }
      location.href = 'http://127.0.0.1:3007/login.html'
    }
  }
})

$(function() {
  const layer = layui.layer

  //1.1获取裁剪区域的DOM元素
  let $image = $('#image')

  //1.2配置选项
  const options = {
    //纵横比
    aspectRatio: 1,
    //指定预览区域
    preview: '.img-preview'
  }
  //1.3创建裁剪区域
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    success: function(res) {
      if (res.status !== 0) {
        //1.3.0 获取用户头像失败时，也创建默认图片的裁剪区域
        $image.attr('src', '../assets/images/sample.jpg').cropper(options)
        return layui.layer.msg('获取用户头像失败!')
      } else {
        //1.3.1设置用户头像图片的裁剪区域
        if (res.data.user_pic) {
          $image
            .attr('src', res.data.user_pic) //重新设置图片路径
            .cropper(options) //创建裁剪区域
        } else {
          //1.3.2创建默认图片的裁剪区域
          $image.attr('src', '../assets/images/sample.jpg').cropper(options)
        }
      }
    }
  })

  //为上传按钮绑定点击事件
  $('#btnChooseImage').on('click', function() {
    $('#file').click()
  })

  //为文件选择框绑定change事件
  $('#file').on('change', function(e) {
    let filelist = e.target.files
    if (filelist.length === 0) {
      return layer.msg('请选择照片！')
    }
    //1.拿到用户选择的文件
    let file = e.target.files[0]

    //2.将文件，转化为路径
    let imgURL = URL.createObjectURL(file)

    //3.重新初始化裁剪区域
    $image
      .cropper('destroy') //摧毁旧的裁剪区域
      .attr('src', imgURL) //重新设置图片路径
      .cropper(options) //重新初始化裁剪区域
  })

  //为确定按钮绑定事件
  $('#btnUpload').on('click', function() {
    //1.要拿到用户裁剪之后的头像
    let dataURL = $image
      .cropper('getCroppedCanvas', {
        //创建一个Canvas画布
        width: 100,
        height: 100
      })
      .toDataURL('image/png') //将canvas画布上的内容，转化为base64格式的字符串
    //2.调用接口，把图像上传到服务器
    $.ajax({
      method: 'POST',
      url: '/my/update/avatar',
      data: {
        avatar: dataURL
      },
      success: function(res) {
        if (res.status != 0) return layer.msg('更换头像失败！')
        layer.msg('更换头像成功！')
        window.parent.getUserInfo()
      }
    })
  })
})

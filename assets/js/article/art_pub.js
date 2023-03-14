$(function() {
  let layer = layui.layer
  let form = layui.form

  initCate()
  //初始化文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('初始化文章分类失败！' + res.message)
        }
        //使用模板引擎渲染数据
        let htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)

        // 通过 layui 重新渲染表单区域的UI结构
        form.render()
      }
    })
  }
  //绘制裁剪封面
  //1.1获取裁剪区域的DOM元素
  let $image = $('#image')

  //1.2配置选项
  const options = {
    //纵横比
    aspectRatio: 16 / 8,
    //指定预览区域
    preview: '.img-preview'
  }
  //1.3创建裁剪区域
  $image.cropper(options)

  //查询localStorage是否有artId ，如果有，则是修改已有文章
  let artId = localStorage.getItem('artId')

  if (artId) {
    // 修改标题
    $('.layui-card-header').html('修改文章')

    //初始化文章信息
    $.ajax({
      method: 'GET',
      url: '/my/article/' + artId,
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('获取用户信息失败！')
        }
        console.log(res)
        //把取到的表单值渲染进表单
        setTimeout(function() {
          form.val('formPub', res.data)
        }, 100)

        //把文章的内容存入进富文本
        $('[name=content]').html(res.data.content)

        //存图片

        let imgSrc = res.data.cover_img
        document.getElementById('image').src = imgSrc
        //为裁剪区域重新设置图片
        $image
          .cropper('destroy') //摧毁旧的裁剪区域
          .attr('src', imgSrc) //重新设置图片路径
          .cropper(options) //重新初始化裁剪区域
      }
    })
    //初始化富文本编辑器
    initEditor()
  } else {
    //初始化富文本编辑器
    initEditor()
  }

  //为选择封面按钮，绑定点击事件
  $('#btnChooseImage').on('click', function() {
    $('#coverFile').click()
  })

  //监听coverFile的change事件，获取用户选择的文件列表
  $('#coverFile').on('change', function(e) {
    //获取到文件的列表数组
    let files = e.target.files
    if (files.length === 0) {
      return
    }
    //根据文件，创建对应的URL地址
    let newImgURL = URL.createObjectURL(files[0])

    //为裁剪区域重新设置图片
    $image
      .cropper('destroy') //摧毁旧的裁剪区域
      .attr('src', newImgURL) //重新设置图片路径
      .cropper(options) //重新初始化裁剪区域
  })

  //定义文章的发布状态
  let art_state = '已发布'

  //为存为草稿按钮，绑定点击事件处理函数
  $('#btnSave2').on('click', function() {
    art_state = '草稿'
  })

  //为表单绑定submit 提交事件
  $('#form-pub').on('submit', function(e) {
    //1.阻止表单的默认提交行为
    e.preventDefault()
    //2.基于form表单，快速创建一个FormData对象
    let fd = new FormData($(this)[0])
    //存富文本内容

    fd.set('content', tinyMCE.activeEditor.getContent())
    //3.将art_state存储到fd中
    fd.append('state', art_state)
    //4.将封面裁剪后的图片，输出为一个文件对象
    $image
      .cropper('getCroppedCanvas', {
        //创建一个Canvas画布
        width: 400,
        height: 280
      })
      .toBlob(function(blob) {
        //将canvas画布上的内容，转化为文件对象
        //得到文件对象后，进行后续操作
        //5.将文件对象，存储到fd中
        console.log($('#coverFile')[0].files)
        if ($('#coverFile')[0].files.length !== 0) {
          fd.append('cover_img', blob)
        }

        //6.判断是修改文章还发布新文章
        if (artId) {
          //存文章的id
          fd.append('Id', artId)

          //6.1发起添加文章的Ajax请求

          updateArticle(fd)
        } else {
          fd.forEach((v, k) => {
            console.log(k, v)
          })
          //6.2发起添加文章的Ajax请求
          publishArticle(fd)
        }
      })
  })

  function publishArticle(fd) {
    $.ajax({
      method: 'POST',
      url: '/my/article/add',
      data: fd,
      //注意：如果向服务器提交的是FormData格式的数据
      //必须添加以下两个配置项
      contentType: false,
      processData: false,
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('发布文章失败！' + res.message)
        }
        layer.msg('发布文章成功！')
        window.parent.document.querySelector('#article_list').click()
      }
    })
  }
  function updateArticle(fd) {
    $.ajax({
      method: 'POST',
      url: '/my/article/edit',
      data: fd,
      //注意：如果向服务器提交的是FormData格式的数据
      //必须添加以下两个配置项
      contentType: false,
      processData: false,
      success: function(res) {
        //移除存储的文章id
        localStorage.removeItem('artId')
        if (res.status !== 0) {
          console.log(res.status)
          return layer.msg('修改文章失败！' + res.message)
        }
        layer.msg('修改文章成功！')
        window.parent.document.querySelector('#article_list').click()
      }
    })
  }
})

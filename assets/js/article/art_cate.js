$(function() {
  const layer = layui.layer
  const form = layui.form
  initArtCateList()

  //获取文章分类的列表
  function initArtCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function(res) {
        let tbodyHTML = template('tpl-table', res)
        $(' .layui-table tbody').html(tbodyHTML)
      }
    })
  }

  //为添加类别按钮绑定点击事件
  let indexAdd = null
  $('#btnAddCate').on('click', function() {
    indexAdd = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $('#dialog-add').html()
    })
  })

  //通过代理的形式，为form-add表单绑定submit事件
  $('body').on('submit', '#form-add', function(e) {
    e.preventDefault()

    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('新增分类失败！' + res.message)
        }
        layer.msg('新增分类成功！')
        //关闭弹出层
        layer.close(indexAdd)
      }
    })
  })
  
  //通过代理的形式，为编辑按钮绑定点击事件
  let indexEdit = null
  $('tbody').on('click', '.btn-edit', function() {
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '修改文章分类',
      content: $('#dialog-edit').html()
    })
    let id = $(this).attr('data-id')
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: function(res) {
        form.val('form-edit', res.data)
      }
    })
  })

  //通过代理的形式，为form-edit表单绑定submit事件
  $('body').on('submit', '#form-edit', function(e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('更新分类数据失败！' + res.message)
        }
        layer.msg('更新分类数据成功！')
        //关闭弹出层
        layer.close(indexEdit)
        initArtCateList()
      }
    })
  })
  //通过代理的形式，为删除按钮绑定点击事件
  $('body').on('click', '.btn-delete', function() {
    let id = $(this).attr('data-id')
    //提示用户是否要删除
    layer.confirm('确认删除？', { icon: 3, title: '提示' }, function(index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success: function(res) {
          console.log(res)
          if (res.status !== 0) {
            return layer.msg('删除分类失败！')
          }
          layer.msg('删除分类成功！')
          //关闭弹出层
        //   layer.close(index)
          initArtCateList()
        }
      })
    })
  })
})

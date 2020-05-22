<template>
  <div>
    <a-modal
      title="表单名称"
      :width="500"
      :visible="visible"
      @cancel="handleCancel"
      @ok="handleSubmit">
      <a-form :form="form" :label-col="{ span: 5 }"
              :wrapper-col="{ span: 12 }">
        <a-form-item label="表单名称">
          <a-input
            v-decorator="['formName', { rules: [{ required: true, message: '请输入表单名称!' }] }]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { postAction, putAction } from '@/api/manage'

export default {
  name: 'DesformNameModal',
  props: ['currentRow', 'DesignFormsData','id'],
  data() {
    return {
      visible: false,
      form: this.$form.createForm(this, { name: 'formItem_rule' })
    }
  },
  methods: {
    show() {
      this.visible = true;
    },
    // 用来父组件调用传值来判断类型,主要用来
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          const parameter = this.type === 'add' ? {
            ...this.DesignFormsData,
            ...values
          } : {
            ...this.DesignFormsData,
            ...values,
            id: this.id
          }
          this.handleRequestAdd(parameter)
        }
      });
    },
    handleRequestAdd(parameter) {
      const requestAction = this.id  ? putAction : postAction
      const url = this.id ? '/form/form/edit' : '/form/form/add'
      requestAction(url, parameter).then((res) => {
        if (res.success) {
          this.$message.success(res.message)
        } else {
          this.$message.warning(res.message)
        }
      }).catch((res) => {
        this.$message.warning(res.message)
      }).finally(() => {
        this.handleCancel()
        // 触发祖先组件的查询事件
        this.$emit('query-list')
      })
    },
    handleCancel() {
      this.visible = false
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.form.setFieldsValue({ formName: '' })
    })
  }
}
</script>

<style lang="scss" scoped>

</style>
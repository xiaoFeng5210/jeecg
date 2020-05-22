<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="保存"
    okText="提交"

  >
<!--    <a-steps :current="1">-->
<!--      <a-step>-->
<!--        &lt;!&ndash; <span slot="title">Finished</span> &ndash;&gt;-->
<!--        <template slot="title">-->
<!--          已申请-->
<!--        </template>-->
<!--        <span slot="description">李明<br>2018-10-31 12:30:20</span>-->
<!--      </a-step>-->
<!--      <a-step title="部门经理审批通过" >-->
<!--        <span slot="description">-->
<!--          王某某<br>-->
<!--          2018-10-31 14:20:20-->
<!--        </span>-->
<!--        </a-step>-->
<!--      <a-step title="公司主管领导待进行" >-->
<!--      </a-step>-->
<!--    </a-steps>-->

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row>
          <a-col span="12">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="用章归属">
              <a-select default-value="lucy" @change="handleChapterChange">
                <a-select-option value="jack">
                  Jack
                </a-select-option>
                <a-select-option value="lucy">
                  Lucy
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="发往单位">
              <a-input placeholder="请填写发往单位"  v-decorator="[ 'description', { rules: [{ required: true, message: '请填写发往单位!' }] }]"/>
            </a-form-item>
          </a-col>

          <a-col span="12">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="用章性质">
              <a-select default-value="lucy" @change="handleChapterNatureChange">
                <a-select-option value="jack">
                  Jack
                </a-select-option>
                <a-select-option value="lucy">
                  Lucy
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="用章数量">
              <a-input placeholder="请填写用章数量" v-decorator="[ 'dictCode', validatorRules.dictCode]"/>
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item
          label="用章事由">
          <a-textarea
            placeholder="请输入用章事由"
            :auto-size="{ minRows: 6 }"
            v-decorator="[ 'dictCode', validatorRules.dictCode]"/>
        </a-form-item>

        <a-form-item label="附件上传:">
            <a-upload
              name="file"
              :multiple="true"
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              :headers="headers"
              @change="handleChange"
            >
              <a-button> <a-icon type="upload" /> 上传文件 </a-button>
            </a-upload>
        </a-form-item>
<!--        <a-form-item-->
<!--          label="审批内容">-->
<!--          <a-textarea placeholder="请输入审批内容" v-decorator="[ 'dictCode', validatorRules.dictCode]"/>-->
<!--        </a-form-item>-->


      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import { addDict, editDict, duplicateCheck } from '@/api/api'

  export default {
    name: 'DictModal',
    data() {
      return {
        value: 1,
        title: '起草',
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 }
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          dictName: { rules: [{ required: true, message: '请输入字典名称!' }] },
          dictCode: {
            rules: [{ required: true, message: '请输入字典编码!' },
              { validator: this.validateDictCode }]
          }
        }
      }
    },
    created() {
    },
    methods: {
      validateDictCode(rule, value, callback) {
        // 重复校验
        var params = {
          tableName: 'sys_dict',
          fieldName: 'dict_code',
          fieldVal: value,
          dataId: this.model.id
        }
        duplicateCheck(params).then((res) => {
          if (res.success) {
            callback()
          } else {
            callback(res.message)
          }
        })
      },
      // 归属
      handleChapterChange(value) {

      },
      // 用章性质
      handleChapterNatureChange(value) {

      },
      handleChange(value) {
        this.model.status = value
      },
      init(){

      },
      show(){
          this.visible = true
      },
      add() {
        this.edit({})
      },
      edit(record) {
        if (record.id) {
          this.visiblekey = true
        } else {
          this.visiblekey = false
        }
        this.form.resetFields()
        this.model = Object.assign({}, record)
        this.visible = true
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'dictName', 'dictCode', 'description'))
        })
      },
      // 确定
      handleOk() {
        const that = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true
            values.dictName = (values.dictName || '').trim()
            values.dictCode = (values.dictCode || '').trim()
            values.description = (values.description || '').trim()
            let formData = Object.assign(this.model, values)
            let obj
            console.log(formData)
            if (!this.model.id) {
              obj = addDict(formData)
            } else {
              obj = editDict(formData)
            }
            obj.then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.warning(res.message)
              }
            }).finally(() => {
              that.confirmLoading = false
              that.close()
            })
          }
        })
      },
      // 关闭
      handleCancel() {
        this.close()
      },
      close() {
        this.$emit('close')
        this.visible = false
      }
    }
  }
</script>
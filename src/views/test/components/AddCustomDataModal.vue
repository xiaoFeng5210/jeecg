<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    class="g-modal-box"
    cancelText="关闭">

    <a-spin :spinning="confirmLoading">
      <div style="width: 100%">
        <k-form-build :value="formConfig" ref="customFormBuild" />
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction, postAction, putAction, getAction } from '@/api/manage'
  import {
    KFormBuild
  } from "../packages/index";
  import pick from 'lodash.pick'
  import moment from "moment"
  import Vue from 'vue'
  import { translateJsonData } from '@/utils/designForms/customFormMethods'
  import { jsonData } from '../JsonData'

  Vue.use(KFormBuild);

  export default {
    name: "AddCustomDataModal",
    props: ['formId'],
    data () {
      return {
        // 自定义表单用户填写的数据
        customData: '',
        formId: '',
        formName: '',
        // 业务表id
        businessId: '',
        formConfig: '',
        title: '',
        // 这个组件用来做什么用的/新增/详情
        businessType: '',
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
        },
        url: {
          detail: '/form/table/queryById/',
          add: "/form/table/add/",
          edit: "/form/table/update/"
        },
      }
    },
    watch: {
      businessType(newVal, oldVal) {
      }
    },
    methods: {
      show(type, record) {
        this.title = type
        this.businessType = type
        if (record) {
          this.businessId = record.id
        }
        this.visible = true
      },
      init() {
          this.confirmLoading = true
          //  获取JSONDATA数据
          getAction('/form/form/queryById', { id: this.formId}).then((res) => {
            this.formConfig = res.result
            if (this.businessType !== '添加') {
              console.log(this.businessType)
              return this.getDetailsPage()
            } else {
              this.$refs.customFormBuild.reset()
            }
          }).finally(() => {
            this.confirmLoading = false
          })
      },
      //  详情页调接口
      getDetailsPage() {
        this.confirmLoading = true
        getAction('/form/table/queryById/' + this.formId + '/' + this.businessId)
        .then((res) => {
          this.setCustomFormData(res.result)
        })
      },

      // 编辑页接口
      requestEditor() {
        putAction('/form/table/update/' + this.formId + '/')
      },

      close () {
        this.$emit('close');
        this.visible = false;
      },
      async handleOk () {
        this.confirmLoading = true
        if (this.businessType === '详情') {
          this.confirmLoading = false
          this.handleCancel()
          return
        }
        try {
          this.customData = await this.getCustomFormData()
          this.requestAdd(this.formId, this.customData)
        }
        catch (err) {
          this.$message.warning(err)
          this.confirmLoading = false
        }
      },
      handleCancel () {
        this.close()
      },
    //  新增/编辑 请求
      requestAdd(id, parameter) {
        const requestAction = this.businessType === '添加' ? postAction : putAction
        const requestUrl = this.businessType === '添加' ? this.url.add : this.url.edit
        requestAction(requestUrl + id, parameter).then((res) => {
            if (res.success) {
              this.$message.success(res.message)
            } else {
              this.$message.warning(res.message)
            }
          }).catch(() => {
            this.$message.warning('网络异常')
          }).finally(() => {
            this.$refs.customFormBuild.reset()
            this.$emit('ok')
            this.handleCancel()
          })
      },
    //  获取用户填写的数据
      getCustomFormData() {
        return new Promise((resolve, reject) => {
          this.$refs.customFormBuild.getData().then((values) => {
            resolve(values)
          }).catch(() => {
            reject('验证未通过')
          })
        })
      },

    //  当进来是详情页时，插入数据
      setCustomFormData(formData) {
        // this.$refs.customFormBuild.setData(formData)
        this.$refs.customFormBuild.form.setFieldsValue(formData)
      }
    }
  }
</script>

<style scoped>
  .g-modal-box {

  }
</style>
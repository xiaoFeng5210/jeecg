<template>
  <a-modal
    :title="title"
    :width="500"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="创建人"
          hasFeedback >
          <a-input placeholder="请输入创建人" v-decorator="['createBy', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="表单名称"
          hasFeedback >
          <a-input placeholder="请输入表单名称" v-decorator="['formName', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="创建时间"
          hasFeedback >
          <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" v-decorator="[ 'createTime', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="更新时间"
          hasFeedback >
          <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" v-decorator="[ 'updateTime', {}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"

  export default {
    name: "DesignFormsEditorModal",
    data () {
      return {
        title:"操作",
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
          add: "/test/jeecgDemo/add",
          edit: "/form/form/edit",
        },
      }
    },
    created () {
    },
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'createBy','formName','createTime','updateTime'))
          //时间格式化
          this.form.setFieldsValue({createTime:this.model.createTime?moment(this.model.createTime,'YYYY-MM-DD HH:mm:ss'):null})
          this.form.setFieldsValue({updateTime:this.model.updateTime?moment(this.model.updateTime,'YYYY-MM-DD HH:mm:ss'):null})
          // this.form.setFieldsValue({birthday:this.model.birthday?moment(this.model.birthday):null})
        });
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
              method = 'put';
            }
            let formData = Object.assign(this.model, values);
            //时间格式化
            formData.createTime = formData.createTime?formData.createTime.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.updateTime = formData.updateTime?formData.updateTime.format('YYYY-MM-DD HH:mm:ss'):null;
            // formData.birthday = formData.birthday?formData.birthday.format():null;

            console.log(formData)
            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })



          }
        })
      },
      handleCancel () {
        this.close()
      },


    }
  }
</script>

<style scoped>

</style>
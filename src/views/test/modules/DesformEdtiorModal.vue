<template>
  <div>
    <a-modal
      title="表格设计器"
      width="100%"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      style="top: 0px; padding: 0px; width: 100%;"
      @cancel="handleCancel"
      cancelText="关闭">
      <a-spin :spinning="confirmLoading">
        <k-form-design @save="handleSave" title="表格设计器" ref="designForm"/>
      </a-spin>
    </a-modal>
<!--    确认后弹出的输入表单名称的Modal-->
    <DesformNameModal ref="nameModal"
                      :currentRow="currentRow"
                      :DesignFormsData="DesignFormsData"
                      v-on="$listeners" :id="id"/>
  </div>
</template>

<script>
  import { httpAction, getAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import Vue from "vue"
  // import 'k-form-design/lib/k-form-design.css'
  import {
      KFormDesign,
      KFormBuild,
      setFormDesignConfig
  } from "../packages/index";
  import Cmp from "../CustomComponent/index.vue";
  import DesformNameModal from './components/DesformNameModal'

  // setFormDesignConfig({
  //     title: "测试自定义字段",
  //     list: [
  //         {
  //             type: "demo", // 表单类型
  //             label: "自定义组件", // 标题文字
  //             icon: "icon-gallery",
  //             component: Cmp,
  //             options: {
  //                 defaultValue: undefined,
  //                 multiple: false,
  //                 disabled: false,
  //                 width: "100%",
  //                 clearable: true,
  //                 placeholder: "请选择",
  //                 showSearch: false
  //             },
  //             model: "",
  //             key: "",
  //             rules: [
  //                 {
  //                     required: false,
  //                     message: "必填项"
  //                 }
  //             ]
  //         }
  //     ],
  //     uploadFile: "",
  //     uploadImage: ""
  // });
  Vue.use(KFormDesign);
  // Vue.use(KFormBuild);

  export default {
    name: "DesformEditorModal",
    props: {
      row: {}
    },
    data () {
      return {
        // 这个id和type用来判断是新增还是编辑
        id: '',
        type: '',
        formConfig: '',
        title:"操作",
        // 是否保存JSON数据
        isSaveJson: false,
        // 保存后的JSON数据
        DesignFormsData: {},
        // 当前行数据
        currentRow: {},
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
          edit: "/test/jeecgDemo/edit",
        },
      }
    },
    mounted () {
      this.DesignFormsData = ''
      this.id = ''
    },
    methods: {
      show(type, record){
           this.visible = true;
           if (type === 'editor') {
             this.id = record.id
             this.setJsonData(record.id)
           } else {
             this.$refs.designForm.handleReset()
             this.id = ''
           }
      },
      // 获取JSONdata数据
      setJsonData(id) {
        getAction('/form/form/queryById', { id: id}).then((res) => {
          this.formConfig = res.result
          this.$refs.designForm.handleSetData(this.formConfig)
        })
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        if (!this.isSaveJson) {
          return this.$message.warning('请先保存')
        }
        if (this.DesignFormsData.list.length <= 0) {
          return this.$message.warning('请先添加基础控件')
        }
        this.$refs.nameModal.show()
      },
      handleCancel () {
        this.close()
      },
      // 保存表单json数据
      handleSave(data) {
        this.DesignFormsData = JSON.parse(data);
        this.currentRow = this.row;
        this.isSaveJson = true
      }
    },
    components: {
      DesformNameModal
    }
  }
</script>

<style scoped>

</style>
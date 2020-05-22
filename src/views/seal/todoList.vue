<template>
<div style="display: flex; ">
  <a-card style="width: 125px; margin-right:10px">
    <a-tabs v-model="condition" tab-position="left">
      <a-tab-pane :key="1" tab="全部">
      </a-tab-pane>
      <a-tab-pane :key="2" tab="待办">
      </a-tab-pane>
      <a-tab-pane :key="3" tab="已办">
      </a-tab-pane>
    </a-tabs>
  </a-card>

  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="关键字">
              <a-input placeholder="请输入关键字" v-model="queryParam.formName"></a-input>
            </a-form-item>
          </a-col>

          <template>
            <a-col :md="6" :sm="8">
              <a-form-item label="申请时间">
                <a-range-picker v-model="queryParam.birthdayRange"
                                format="YYYY-MM-DD"
                                :placeholder="['开始时间', '结束时间']"
                                @change="onBirthdayChange" />
              </a-form-item>
            </a-col>
          </template>

<!--          自定义查询-->


          <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
            <a-col :md="6" :sm="24">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </a-col>
          </span>
          <a-col :md="6" :sm="24">
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator" style="margin-top: 5px">
<!--      <a-button @click="handleAdd" type="primary" icon="plus">用章申请</a-button>-->
      <a-button type="primary" @click="handleAdd">起草</a-button>
      <a-button type="primary">导出</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete"/>
            删除
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作
          <a-icon type="down"/>
        </a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{
        selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
        <span style="float:right;">
          <a-divider type="vertical" />
          <a-popover title="自定义列" trigger="click" placement="leftBottom">
            <template slot="content">
              <a-checkbox-group @change="onColSettingsChange" v-model="settingColumns" :defaultValue="settingColumns">
                <a-row>
                  <template v-for="(item,index) in defColumns">
                    <template v-if="item.key!='rowIndex'&& item.dataIndex!='action'">
                        <a-col :span="12"><a-checkbox :value="item.dataIndex">{{ item.title }}</a-checkbox></a-col>
                    </template>
                  </template>
                </a-row>
              </a-checkbox-group>
            </template>
            <a><a-icon type="setting" />自定义列</a>
          </a-popover>
        </span>
      </div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">

        <div slot="filterDropdown">
          <a-card>
            <a-checkbox-group @change="onColSettingsChange" v-model="settingColumns" :defaultValue="settingColumns">
              <a-row>
                <template v-for="(item,index) in defColumns">
                  <template v-if="item.key!='rowIndex'&& item.dataIndex!='action'">
                    <a-col :span="12"><a-checkbox :value="item.dataIndex">{{ item.title }}</a-checkbox></a-col>
                  </template>
                </template>
              </a-row>
            </a-checkbox-group>
          </a-card>
        </div>

<!--        状态-->
        <template slot="state" slot-scope="text, record">
          <a>起草</a>
        </template>

        <a-icon slot="filterIcon" type='setting' :style="{ fontSize:'16px',color:  '#108ee9' }" />
        <span slot="action" slot-scope="text, record">
          <a @click="handleCustomFormEdit(record)">
            <a-icon type="edit"/>
            编辑
          </a>
<!--          <a @click="editDesignItem(record)"><a-icon type="setting"/> 设计表单</a>-->
<!--          <a-divider type="vertical"/>-->
          <a-divider type="vertical"/>
          <a @click="handleGetDetails(record)">详情</a>
          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

<!--    起草添加组件-->
    <AddModal ref="modalAdd" @ok="modalFormOk" />
<!--    <AddCustomDataModal ref="modalForm" @ok="modalFormOk" :formId="formId"/>-->
<!--    审批组件-->
    <ApproveModal ref="modalApprove" @ok="modalFormOk"/>
  </a-card>
</div>
</template>

<script>
  import JSuperQuery from '@/components/jeecg/JSuperQuery.vue';
  import JInput from '@/components/jeecg/JInput.vue';
  import AddModal from './modules/AddModal'
  import {initDictOptions, filterDictText} from '@/components/dict/JDictSelectUtil'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import Vue from 'vue'
  import { filterObj } from '@/utils/util';
  import { deleteAction, postAction, getAction } from '@/api/manage'
  import { translateJsonData } from '@/utils/designForms/customFormMethods'
  import moment from 'moment'
  import { defColumns } from './todolist'
  import ApproveModal from './modules/ApproveModal'



  //高级查询modal需要参数
  const superQueryFieldList=[{
    type:"date",
    value:"birthday",
    text:"生日"
  },{
    type:"string",
    value:"name",
    text:"用户名"
  },{
    type:"int",
    value:"age",
    text:"年龄"
  }]
  export default {
    name: "SealApproveList",
    mixins:[JeecgListMixin],
    components: {
      JSuperQuery,
      AddModal,
      JInput,
      ApproveModal
    },
    data() {
      return {
        // tabs
        condition: 1,
        defColumns: [],
        // 此列表是自定义列表
        custom: true,
        formId: this.$route.query.id || this.paramsId,
        paramsId: '',
        // 查询的参数
        searchMap: {},
        searchMapList: [],
        queryJsonDataList: [],
        // 不需要mixins create
        disableMixinCreated: true,
        description: '用户管理页面',
        //表单设计器拿到的table行数据
        designforms: '',
        //字典数组缓存
        sexDictOptions: [],
        importExcelUrl:`${window._CONFIG['domianURL']}/test/jeecgDemo/importExcel`,
        //表头
        columns:[],
        //列设置
        settingColumns:[],
        url: {
          list: '/form/table/queryData',
          delete: "/form/table/deleteById/" + this.$route.query.id + '/',
          deleteBatch: "/form/form/deleteBatch",
          exportXlsUrl: "/test/jeecgDemo/exportXls"
        },
        fieldList:superQueryFieldList
      }
    },
    methods: {
      getListData(arg) {
        this.loading = true;
        if (arg === 1) {
          this.ipagination.current = 1;
        }
        const page = this.ipagination.current
        const size = this.ipagination.pageSize
        const parameter = {
          formId: this.formId,
          searchMap: this.searchMap,
          page: page,
          size: size
        }
        this.requestListData(parameter)
      },

      // 获取列表数据
      requestListData(parameter) {
        postAction(this.url.list, parameter).then((res) => {
          if (res.success) {
            this.dataSource = res.result.records;
            this.ipagination.total = res.result.total;
            this.loading = false
          }
          if(res.code===510){
            this.$message.warning(res.message)
          }
        })
      },
      handleAdd() {
        this.$refs['modalAdd'].show('添加', null)
        this.$refs['modalAdd'].init()
      },
      // 详情
      handleGetDetails(record) {
        this.$refs['modalForm'].show('详情', record)
        this.$refs['modalForm'].init()
      },
      // 编辑
      handleCustomFormEdit(record) {
        this.$refs['modalForm'].show('编辑', record)
        this.$refs['modalForm'].init()
      },
      editDesignItem(record){
        this.designforms = record
        this.$refs['desformEdtiorModal'].show()
      },
      getQueryParams(){

        //高级查询器
        let sqp = {}
        if(this.superQueryParams){
          sqp['superQueryParams']=encodeURI(this.superQueryParams)
        }
        var param = Object.assign(sqp, this.queryParam, this.isorter ,this.filters);
        // param.field = this.getQueryField();  高级查询
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        delete param.birthdayRange; //范围参数不传递后台
        return filterObj(param);
      },
      initDictConfig() {
        console.log("--我才是真的方法!--")
        //初始化字典 - 性别
        initDictOptions('sex').then((res) => {
          if (res.success) {
            this.sexDictOptions = res.result;
          }
        });
      },
      onetomany: function () {
        this.$refs.jeecgDemoTabsModal.add();
        this.$refs.jeecgDemoTabsModal.title = "编辑";
      },
      onBirthdayChange: function (value, dateString) {
        this.queryParam.birthday_begin=dateString[0];
        this.queryParam.birthday_end=dateString[1];
      },
      //列设置更改事件
      onColSettingsChange (checkedValues) {
        var key = this.$route.name+":colsettings";
        Vue.ls.set(key, checkedValues, 7 * 24 * 60 * 60 * 1000)
        this.settingColumns = checkedValues;
        const cols = this.defColumns.filter(item => {
          if(item.key =='rowIndex'|| item.dataIndex=='action'){
            return true
          }
          if (this.settingColumns.includes(item.dataIndex)) {
            return true
          }
          return false
        })
        this.columns =  cols;
      },
      initColumns(){
        //权限过滤（列权限控制时打开，修改第二个参数为授权码前缀）
        //this.defColumns = colAuthFilter(this.defColumns,'testdemo:');

        var key = this.$route.name+":colsettings";
        let colSettings= Vue.ls.get(key);
        if(colSettings==null||colSettings==undefined){
          let allSettingColumns = [];
          this.defColumns.forEach(function (item,i,array ) {
            allSettingColumns.push(item.dataIndex);
          })
          this.settingColumns = allSettingColumns;
          this.columns = this.defColumns;
        }else{
          this.settingColumns = colSettings;
          const cols = this.defColumns.filter(item => {
            if(item.key =='rowIndex'|| item.dataIndex=='action'){
              return true;
            }
            if (colSettings.includes(item.dataIndex)) {
              return true;
            }
            return false;
          })
          this.columns =  cols;
        }
      },
      modalFormOk() {
        this.getListData()
      },
    //  删除
      handleDelete(id) {
        var that = this;
        deleteAction(that.url.delete + id).then((res) => {
          if (res.success) {
            that.$message.success(res.message);
            that.getListData();
          } else {
            that.$message.warning(res.message);
          }
        });
      },
    },
    mounted () {
    },
    created() {
      this.defColumns = defColumns
      this.columns = defColumns
      this.initColumns();
      // this.getListData()
    }
  }
</script>
<style scoped>
  .ant-card-body .table-operator {
    margin-bottom: 18px;
  }

  .ant-table-tbody .ant-table-row td {
    padding-top: 15px;
    padding-bottom: 15px;
  }

  .anty-row-operator button {
    margin: 0 5px
  }

  .ant-btn-danger {
    background-color: #ffffff
  }

  .ant-modal-cust-warp {
    height: 100%
  }

  .ant-modal-cust-warp .ant-modal-body {
    height: calc(100% - 110px) !important;
    overflow-y: auto
  }

  .ant-modal-cust-warp .ant-modal-content {
    height: 90% !important;
    overflow-y: hidden
  }
  /** Button按钮间距 */
  .ant-btn {
    margin-left: 3px
  }
</style>
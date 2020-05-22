import moment from 'moment'

export const defColumns = [
    {
      title: '#',
      dataIndex: '',
      key: 'rowIndex',
      width: 60,
      align: "center",
      customRender: function (t, r, index) {
        return parseInt(index) + 1;
      }
    },
    {
      title: '发往单位',
      align: "center",
      dataIndex: 'id'
    },
  {
    title: '用章归属',
    align: "center",
    dataIndex: 'id'
  },
  {
    title: '用章事由',
    align: "center",
    dataIndex: 'id'
  },
  {
    title: '申请人',
    align: "center",
    dataIndex: 'id'
  },
    {
      title: '申请时间',
      align: "center",
      dataIndex: 'create_time',
      customRender: function (t, r, index) {
        return moment(r.create_time).format('YYYY-MM-DD HH:mm:ss')
      }
    },

  {
    title: '状态',
    align: "center",
    dataIndex: 'state'
  },
    {
      title: '操作',
      dataIndex: 'action',
      align: "center",
      scopedSlots: {
        filterDropdown: 'filterDropdown',
        filterIcon: 'filterIcon',
        customRender: 'action'},
    }
]
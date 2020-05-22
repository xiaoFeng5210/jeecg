<template>
  <a-list>
    <a-list-item>
        用章待办（1）
    </a-list-item>
    <a-list-item>
      会议审批（2）
    </a-list-item>
    <a-list-item>
      公文（2）
    </a-list-item>
    <a-list-item>
      任务督办（5）
    </a-list-item>
  </a-list>
</template>

<script>
  import AList from 'ant-design-vue/es/list'
  import AListItem from 'ant-design-vue/es/list/Item'

  export default {
    name: "Article",
    components: {
      AList,
      AListItem
    }
  }
</script>

<style scoped>

</style>
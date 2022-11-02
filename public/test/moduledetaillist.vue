<template>
  <div
    class="module-detail-list"
    v-loading.lock="modulesLoading"
    element-loading-background="rgba(0, 0, 0, 0.2)"
    element-loading-text="模块加载中…"
  >
    <div class="container">
      <div class="left-container">
        <template v-if="moduleLayout.menus.length > 0">
          <module-menu
            :menus="moduleLayout.menus"
            :activeIndex="moduleLayout.activeMenu"
            @onMenuClick="onMenuClick"
          ></module-menu>
        </template>
      </div>
      <div class="right-wrap">
        <!-- 表单、流程表单页面 -->
        <template
          v-if="
            curpageType === PageType.FORM_PAGE ||
            curpageType === PageType.FLOW_PAGE
          "
        >
          <div class="right-header">
            <menu-header :paths="moduleLayout.paths"></menu-header>
            <div class="button-group">
              <el-button
                size="small"
                type="primary"
                plain
                icon=" el-icon-plus"
                v-if="addable"
                @click="onAddRow"
                title="添加"
                >添加</el-button
              >
              <el-button
                size="small"
                type="primary"
                plain
                icon="el-icon-search"
                @click="onSearch"
                title="查询"
                >查询</el-button
              >
              <el-button
                size="small"
                type="primary"
                plain
                icon="el-icon-delete"
                @click="onBatchDelete"
                title="批量删除"
                >批量删除</el-button
              >
              <AdvancedSearch
                class="advanced-search"
                :rowList="rowList"
                :modulePageId="pageParmas.pageId"
                @advancedSearch="onAdvancedSearch"
              ></AdvancedSearch>
              <el-dropdown
                class="more-button"
                placement="bottom-start"
                style="margin-left: 10px"
              >
                <!-- <el-button type="primary" plain size="small">…</el-button> -->
                <i class="el-icon-more" title="更多"></i>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      @click="onDownload"
                      :disabled="tableOption.tableData.length == 0"
                      >下载数据</el-dropdown-item
                    >
                    <el-dropdown-item @click="onDownloadTemplate"
                      >下载模板</el-dropdown-item
                    >
                    <el-dropdown-item>
                      <el-upload
                        action
                        :before-upload="beforeUpload"
                        class="upload-demo"
                        accept=".xls, .xlsx"
                        :http-request="uploadFunc"
                        :show-file-list="false"
                      >
                        <a>导入数据</a>
                      </el-upload>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
          <div class="right-container">
            <template v-if="tableOption.tableColums.length > 0">
              <div class="modelcondition" v-if="modelConditionList.length > 0">
                <el-form size="small">
                  <el-col
                    v-for="(item, index) in modelConditionList"
                    :key="index"
                    :span="12"
                  >
                    <el-form-item :label="item.opFields.fieldRemark">
                      <el-input
                        v-if="item.type == 0"
                        size="small"
                        v-model="item.opFields.fieldValue"
                      ></el-input>
                      <el-date-picker
                        v-if="item.type == 1"
                        v-model="item.opFields.fieldValue"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-form>
              </div>
              <div class="right-search">
                <top-form
                  :formConf="topSetting.formConf"
                  :componentList="topSetting.componentList"
                  :formData="topSetting.formData"
                ></top-form>
              </div>

              <table-extend
                v-bind="tableOption"
                @handleSelectionChange="handleSelectionChange"
                @pageSizeChange="onPageSizeChange"
                @currentChange="currentChange"
                @tableSort="onTableSort"
              >
                <template #operatColumn>
                  <el-table-column
                    fixed="right"
                    label="操作"
                    min-width="250"
                    v-if="tableOption.tableColums.length > 0"
                  >
                    <template #default="scope">
                      <el-button
                        v-if="scope.row.status === 0"
                        size="small"
                        type="danger"
                        >待审核</el-button
                      >
                      <el-button
                        v-if="scope.row.status === 1"
                        size="small"
                        type="success"
                        >已审核</el-button
                      >
                      <el-button
                        v-if="scope.row.status === 2"
                        size="small"
                        type="danger"
                        >等待</el-button
                      >
                      <el-button
                        v-if="scope.row.status === 3"
                        size="small"
                        type="danger"
                        >已退回</el-button
                      >
                      <el-button
                        v-if="scope.row.status === 4"
                        size="small"
                        type="danger"
                        >已退回</el-button
                      >
                      <el-button
                        type="text"
                        size="small"
                        @click="onEditRow(scope.row)"
                      >
                        {{ scope.row.status === 4 ? '重新提交' : '编辑' }}
                      </el-button>
                      <el-button
                        type="text"
                        size="small"
                        @click="onDelRow(scope.row)"
                        >删除</el-button
                      >
                      <el-button
                        type="text"
                        size="small"
                        @click="onDetail('detail', scope.row)"
                        v-if="
                          scope.row.startable === false &&
                          scope.row.status !== 4
                        "
                        >详情</el-button
                      >
                      <el-button
                        type="text"
                        size="small"
                        @click="onStart(scope.row, startFlowLabel)"
                        v-if="scope.row.startable === true"
                        >{{ startFlowLabel }}</el-button
                      >
                      <el-button
                        type="text"
                        size="small"
                        @click="onStart(scope.row)"
                        v-if="scope.row.executable === true"
                        >审核</el-button
                      >
                    </template>
                  </el-table-column>
                </template>
              </table-extend>
            </template>
            <template v-else>
              <el-empty description="暂无数据"></el-empty>
            </template>
          </div>
        </template>
        <!-- 报表页面 -->
        <template v-else-if="curpageType === PageType.REPORT_PAGE">
          <div class="right-header">
            <menu-header :paths="moduleLayout.paths"></menu-header>
          </div>
          <report-view></report-view>
        </template>
        <!-- <template v-else>
          <el-result icon="error" title="无效页面" subTitle="无知无效页面"></el-result>
        </template>-->
      </div>
    </div>
    <model-form
      v-model:visible="pageSetting.visible"
      :title="pageSetting.title"
      :type="pageSetting.type"
      :formConf="pageSetting.formConf"
      :formData="form.formData"
      :componentList="pageSetting.componentList"
      @onSubmit="onSubmit"
      ref="modelFormRef"
    >
      <template #otherBtn v-if="form.formData.status === 4">
        <el-button type="primary" @click="reSubmit">重新提交</el-button>
      </template>
    </model-form>
  </div>
  <div class="fixedDialog">
    <el-dialog
      v-if="curpageType == PageType.FLOW_PAGE"
      width="800px"
      v-model="processvisible"
      destroy-on-close
    >
      <template v-slot:title>
        <DialogTitle
          :dialogTitle="detailType === 'detail' ? '流程详情' : '流程审核'"
        ></DialogTitle>
      </template>

      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane
          :label="ele.name"
          :name="`${index}`"
          v-for="(ele, index) in variables.__FormList__"
          :key="index"
        >
          <div class="columRow">
            <top-form
              :formConf="ele.formConf"
              :formData="ele.formModel"
              :componentList="ele.componentList"
            ></top-form>
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="流程图"
          name="processIntanceImage"
          v-if="detailType === 'detail'"
        >
          <el-scrollbar>
            <img class="process-image" :src="variables.imageUrl" alt="流程图" />
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane
          :label="flowable.tabName"
          name="exec"
          v-if="detailType !== 'detail'"
        >
          <div class="columRow">
            <top-form
              :formConf="flowable.formConf"
              :componentList="flowable.componentList"
              :formData="form.formData"
              ref="flowableForm"
            ></top-form>
          </div>
        </el-tab-pane>
      </el-tabs>
      <template #footer v-if="detailType !== 'detail'">
        <el-button @click="processvisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="onDone(item)"
          v-for="(item, index) in buttonList"
          :key="index"
        >
          <!-- :loading="doLoading" -->
          {{ item.nameSpace }}
        </el-button>
      </template>
      <template #footer v-else>
        <el-button icon="el-icon-close" @click="processvisible = false"
          >关闭</el-button
        >
      </template>
    </el-dialog>
  </div>

  <!-- 主从表新增编辑表单，后续需要优化-->
  <table-edit-form
    v-model:visible="tableForm.visible"
    :title="tableForm.title"
    :type="tableForm.type"
    :formConf="tableForm.formConf"
    :formData="tableForm.formData"
    :componentList="tableForm.componentList"
    @onSubmit="onSubmitTableForm"
  ></table-edit-form>
</template>

<script lang="ts" setup>
import { reactive, ref, nextTick, provide, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import topForm from '@/components/moduleform/form.vue'
import modelForm from '@/components/moduleform/index.vue'
import tableEditForm from '@/components/moduleform/index.vue'
import menuHeader from '@/components/moduleMenu/header.vue'
import moduleMenu from '@/components/moduleMenu/menus.vue'
import useModuleList from './useModuleList'
import useTableExtend from '@/use/useTableExtend'
import reportView from '@/components/reportView/index.vue'
import useEmitter from '@/use/useEitter'
import useInitComponent from './useInitComponent'
import useComponentEmit from '@/views/hooks/use-component-emit'
import useInitComponentData from '@/views/hooks/use-init-component'
import { getToken, getStorage } from '@/utils/utils'
import AdvancedSearch from '@/components/advancedSearch/index.vue'
import {
  getAppInfoById,
  getPageSetData,
  exportData,
  getTempExcel,
  importExcel,
  pageDelData,
  pageUpdateData,
  pageAddData,
  getPageCfgByTableId,
  doBtnEvent,
  getFirstTreeData,
  getReportFirstTreeData,
  getTreeData,
  getModelConditions,
} from '@/api/homeApi/index'
import { confirmBox, deepClone, messageAlert } from '@/utils/utils'
import {
  getFlowableData,
  startFlowable,
  doFlowable,
  getFlowableDetail,
  reSubmitFlowable,
} from '@/api/flowable'

import { PageType } from './types'

import DialogTitle from '@/components/dialogTitle/index.vue'
import { PenetratePageType } from '@/components/designComponent/enum'

export type SubmitParams = {
  jsonDATA: any
  modelId: number | string
  pageId: number | string
  updateId?: number
  deleteIds?: number[]
}

const store = useStore()
// 布局处理
const {
  moduleLayout,
  topSetting,
  pageSetting,
  setPaths,
  initHeaderNav,
  initPageConfig,
  rowFormTransform,
  multipleValueComponentTransform,
} = useModuleList()

//表格处理
const { tableOption, selectIds, handleSelectionChange, resetTableOption } =
  useTableExtend()

const { initComponentData, selectInit, tabTableInit, treeInit } =
  useInitComponentData()
const {
  loadDialogSelectData,
  createAutoCode,
  fillDialogSelectData,
  delTabTableData,
  editTabTableData,
  addTabTableData,
} = useComponentEmit()

const rowList = reactive({
  options: [],
})

provide('parent', {
  getInfoByappid: getInfoByappid,
  tableRowClick,
})

provide('table-components', pageSetting)

useEmitter([
  // 自动生成自编码
  { key: 'on-create-autocode', value: createAutoCode },
  // 加载开窗表格数据
  { key: 'on-load-reltable-data', value: loadDialogSelectData },
  // 填充表格选择的数据
  { key: 'on-set-reltable-data', value: fillDialogSelectData },
  // 删除主从表数据
  { key: 'on-del-tabtable-data', value: delTabTableData },
  // 编辑主从表数据
  {
    key: 'on-edit-tabtable-data',
    value: (e) => editTabTableData(e, tableForm),
  },
  // 新增主从表数据
  { key: 'on-add-tabtable-data', value: (e) => addTabTableData(e, tableForm) },
  // 表单配置按钮  按钮执行事件
  { key: 'on-do-event', value: excuteBtn },
  // 更新后表单配置按钮  按钮执行事件
  { key: 'on-do-event-btnform', value: excuteBtnForm },
  // 树形组件加载
  { key: 'on-load-tree', value: (e) => treeInit(e, curpageType.value) },
])

// 当前的页面类型
const curpageType = ref<any>(null)

// 左侧菜单模块加载loading
const modulesLoading = ref<boolean>(false)
//表格数据加载框
const route = useRoute()

const router = useRouter()

const variables = reactive({
  __FormList__: [],
  imageUrl: '',
})

// 控制添加按钮，默认为true
const addable = ref<boolean>(true)
// 页面类型为流程表单时，启动流程使用
const processDefinitionId = ref<string>('')
// 执行流程时的弹框
const processvisible = ref<boolean>(false)
/**启动流程按钮名称 */
const startFlowLabel = ref<string>('')

//详情的类型
const detailType = ref('')

//按钮执行时需要记录id
const exectId = ref<any>(null)

// 选中的流程名称
const activeName = ref<string>('0')
// 执行loading
const doLoading = ref<boolean>(false)
// 执行流程时表单对象
const flowableForm = ref<any>(null)

// 选中的tab
const app = reactive({
  name: undefined,
  models: [] as any[],
})

// 编辑时表单对象
const form = reactive<any>({
  formData: {},
})
//弹框
const modelFormRef = ref<any>(null)

const buttonList = ref<any>([])
//筛选条件
const modelConditionList = ref<any>([])
// 分页器
const pageRequest = { pageIndex: 1, pageSize: 15 }

let filterColumns = {}
let requestConditions = []

// 页面参数
const pageParmas = reactive({
  pageName: '',
  modelName: '',
  modelId: route.query.modelid || '',
  pageId: '',
  file: '',
})

const flowable = reactive({
  formConf: undefined,
  componentList: [],
  id: '',
  taskId: '',
  tabName: '',
  pageId: '',
})

const filterlist = reactive({
  filterName: '',
  filterCompare: '',
  private: [],
})
const tableForm = reactive({
  visible: false,
  title: '',
  type: '',
  size: 0,
  formConf: undefined,
  tableId: undefined,
  componentList: [],
  formData: {},
  options: {},
})

// 点击页面切换,更改当前的显示页面
const pageChange = (model, page) => {
  pageParmas.pageName = page.pageName
  pageParmas.modelName = model.modelName
  pageParmas.pageId = page.id
  pageParmas.modelId = model.id
  filterColumns = {}
  curpageType.value = page.pageType
  if (
    curpageType.value === PageType.FORM_PAGE ||
    curpageType.value === PageType.FLOW_PAGE
  ) {
    router
      .replace({
        path: '/pages/moduledetaillist',
        query: {
          appid: route.query.appid,
          modelid: pageParmas.modelId,
          pageId: pageParmas.pageId,
        },
      })
      .then(() => {
        reloadPage()
      })
  }
  if (curpageType.value === PageType.REPORT_PAGE) {
    const { appid, modelid, pageId } = route.query
    router.replace({
      path: '/pages/moduledetaillist',
      query: {
        appid: route.query.appid,
        modelid: pageParmas.modelId,
        pageId: pageParmas.pageId,
      },
    })
  }
}

let advancedCondition
//高级筛选回调
const onAdvancedSearch = (value) => {
  advancedCondition = value
}
// 点击搜索
const onSearch = () => {
  modelConditionList.value.forEach((element, index) => {
    requestConditions.push({
      fieldName: element.opFields.fieldName,
      type: element.type,
      param:
        element.type == 0
          ? element.opFields.fieldValue
            ? element.opFields.fieldValue.split(',')
            : []
          : element.opFields.fieldValue,
    })
  })

  filterColumns = topSetting.formData || {}
  pageSetting.reload = false
  reloadTable()
}

// 新增数据弹框
const onAddRow = () => {
  store.commit('apps/setDesignStatus', false)
  initComponentData(pageSetting.componentList, 'add')
  multipleValueComponentTransform(pageSetting.componentList)
  pageSetting.title = '新增'
  pageSetting.visible = true
  form.formData['id'] = undefined
  exectId.value = undefined
  // 自编码数据
  autoCreateData(pageSetting.componentList)
}

//excel下载
const onDownload = async () => {
  filterColumns = topSetting.formData || {}
  pageSetting.reload = false
  pageSetting.visible = false
  pageSetting.type = ''
  pageSetting.size = 0
  pageSetting.formConf = undefined
  pageSetting.componentList = []
  tableOption.tableLoading = true
  let para = {
    dataRequest: {
      modelId: pageParmas.modelId,
      pageId: pageParmas.pageId,
      filterColumns,
      sortFileId: pageSetting.sortField,
      sortOrder: pageSetting.sortType,
    },
    pageRequest: pageRequest,
  }

  const res = await exportData(para)

  if (res.code == 200) {
    tableOption.tableLoading = false
    reloadPage()
  }
}
//excel模板下载
const onDownloadTemplate = async () => {
  let params = {
    pageId: pageParmas.pageId,
  }
  const res = await getTempExcel(params)
  if (res.code == 200) {
    tableOption.tableLoading = false
  }
}
//文件上传之前
const beforeUpload = (file) => {
  let isExcel = true
  const typeList = ['xlsx', 'xls']
  const Excel = file.name.substring(file.name.lastIndexOf('.') + 1)
  const isLt2M = file.size / 1024 <= 500

  if (!typeList.includes(Excel)) {
    messageAlert('error', '请先下载模板再上传的文件,且只能是xlsx或者是xls格式')
    isExcel = false
  }
  if (!isLt2M) {
    messageAlert('error', '上传的文件excel文件大小不能超过500M')
  }
  return isLt2M && isExcel
}

//根据下载的模板填入数据并上传excel表格
const uploadFunc = async (fileOptions: any): Promise<void> => {
  tableOption.tableLoading = true
  const formData = new FormData()
  formData.append('file', fileOptions.file)
  formData.append('pageId', pageParmas.pageId)
  formData.append('modelId', pageParmas.modelId)

  const res = await importExcel(formData)
  if (res.code == 200) {
    messageAlert('success', '导入成功')
    tableOption.tableLoading = false
    getPageSet()
  } else {
    tableOption.tableLoading = false
  }
}

//编辑一条数据弹框
const onEditRow = (row) => {
  initComponentData(pageSetting.componentList, 'edit', row)
  debugger
  pageSetting.title = row.status === 4 ? '重新提交' : '编辑'
  pageSetting.visible = true

  exectId.value = row.id
  nextTick(() => {
    debugger
    form.formData = rowFormTransform(row, pageSetting.componentList)
    console.log('form.formData', form.formData)
    initTableComponentData(form.formData, pageSetting.componentList)
  })
}
// 启动流程
const onStart = (row: any, str?: string) => {
  exectId.value = row.id
  let para = {
    jsonDATA: row,
    modelId: pageParmas.modelId as string,
    pageId: pageParmas.pageId,
    updateId: row.id,
    processDefinitionId: processDefinitionId.value,
    taskId: row.taskId ? row.taskId : '',
  }
  // 启动流程
  if (row.startable) {
    confirmBox(str, async () => {
      const res = await startFlowable(para)
      if (res.code === 200) {
        messageAlert('success', '提交成功')
        getPageSet()
      }
    })
  }
  // 执行流程
  if (row.executable) {
    activeName.value = 'exec'
    onDetail('exec', row)
    getflowableForm(row, para)
  }
}

function onDone(item) {
  doLoading.value = true
  let para = {
    id: flowable.id,
    taskId: flowable.taskId,
    name: item.name,
    value: item.value,
    pageId: flowable.pageId,
    jsonDATA: flowableForm.value?.formData,
    values: {
      formConf: flowableForm.value.formConf || null,
      componentList: flowableForm.value.componentList || null,
      formModel: flowableForm.value?.formData || null,
    },
  }
  if (!flowableForm.value.formValid()) return
  doFlowable(para)
    .then((res) => {
      if (res.code === 200) {
        processvisible.value = false
        messageAlert('success', '执行成功')
        getPageSet()
      }
      doLoading.value = false
    })
    .catch(() => {
      doLoading.value = false
    })
}

//获取执行流程的表单详情
const getflowableForm = async (row: any, para) => {
  flowable.formConf = undefined
  flowable.componentList = []
  flowable.id = ''
  flowable.taskId = ''
  flowable.tabName = ''
  const res = await getFlowableData({ taskId: row.taskId })
  if (res.code === 200) {
    if (res.data.renderedStartForm) {
      const { formConf, components = [] } = JSON.parse(
        res.data.renderedStartForm
      )
      flowable.formConf = formConf
      flowable.componentList = components
      flowable.id = para.updateId
      flowable.taskId = para.taskId
      flowable.tabName = row.tabName
      flowable.pageId = res.data.pageId
    }
    processvisible.value = true
    buttonList.value = res.data.buttonList
  }
}

// 单个删除
const onDelRow = (row: any) => {
  selectIds.value = [row.id]
  delDatas()
}

/**
 * 详情
 */
const onDetail = async (type, row: any) => {
  exectId.value = row.id
  detailType.value = type
  if (type === 'detail') {
    activeName.value = '0'
  } else {
    activeName.value = 'exec'
  }

  const res = await getFlowableDetail({
    processInstanceId: row.processInstanceId,
  })
  const token = getToken('accessToken')
  variables.imageUrl = `/flowable/processInstanceImage?processInstanceId=${
    row.processInstanceId
  }&access_token=${token}&time=${+new Date()}`
  if (res.code === 200) {
    let formList = res.data.variables.__FormList__
    let newformList = deepClone(formList)
    if (formList && formList.length > 0) {
      // 详情不能修改数据 采用表单禁用限制
      formList = formList.map((item, index) => {
        item.formConf.disabled = true
        item.formModel = {}
        return item
      })
      variables.__FormList__ = formList
      if (type === 'detail') {
        processvisible.value = true
      }
      nextTick(() => {
        variables.__FormList__.forEach((item, index) => {
          item.formModel = newformList[index].formModel
        })
      })
    }
  }
}

// 批量删除
function onBatchDelete() {
  if (!selectIds.value || selectIds.value?.length == 0) {
    messageAlert('error', '请选择要删除的数据')
    return
  } else {
    delDatas()
  }
}

// 页面大小改变
const onPageSizeChange = (e): void => {
  pageRequest.pageSize = e.pageSize
  currentChange(e)
}
// 页码改变
const currentChange = (e): void => {
  pageRequest.pageIndex = e.pageIndex
  reloadTable()
}

function onTableSort(obj): void {
  const { sortName, sortType } = obj
  pageSetting.sortField = sortName
  pageSetting.sortType = sortType
  onSearch()
}

// 菜单点击
function onMenuClick(menu: any) {
  for (let i = 0; i < app.models.length; i++) {
    const model = app.models[i]
    if (!model.appPagesList) continue
    for (let j = 0; j < model.appPagesList.length; j++) {
      const page = model.appPagesList[j]
      const keys = menu.key.split('_')
      const menuKey = keys && keys[1]
      if (page.id == menuKey) {
        moduleLayout.paths = [
          { name: app.name, path: '/apps' },
          { name: model.modelName },
          { name: page.pageName },
        ]
        moduleLayout.activeMenu = `${model.id}_${page.id}`
        pageChange(model, page)
        return
      }
    }
  }
}

// 提交
const onSubmit = async (formModel): Promise<void> => {
  const { modelId, pageId } = pageParmas
  await submitForm(formModel, modelId, pageId)
  pageSetting.visible = false
  reloadTable()
}

async function submitForm(model: any, modelId, pageId) {
  let params: SubmitParams = {
    jsonDATA: model,
    modelId: modelId,
    pageId: pageId,
  }
  let res: any = undefined
  if (model.id) {
    params.updateId = model.id
    res = await pageUpdateData(params)
  } else {
    res = await pageAddData(params)
  }
  if (res.code == 200) {
    messageAlert('success', (model.id && '编辑成功') || '添加成功')
  }
}

//重新提交
const reSubmit = () => {
  modelFormRef.value.formValid(async () => {
    let formModel = modelFormRef.value.getParams()
    let params = {
      jsonDATA: formModel,
      modelId: pageParmas.modelId as string,
      pageId: pageParmas.pageId,
      values: {
        formConf: pageSetting.formConf || null,
        componentList: pageSetting?.componentList || null,
        formModel,
      },
      processInstanceId: form.formData.processInstanceId,
    }
    const res = await reSubmitFlowable(params)
    if (res.code == 200) {
      messageAlert('success', res.msg || '')
      pageSetting.visible = false
      reloadTable()
    }
  })
}

// 单个多个删除
const delDatas = async () => {
  let parmas = {
    modelId: pageParmas.modelId,
    pageId: pageParmas.pageId,
    deleteIds: selectIds.value,
  }
  confirmBox('删除数据', async () => {
    const res = await pageDelData(parmas)
    if (res.code == 200) {
      messageAlert('success', '删除成功')
      reloadTable()
      selectIds.value = []
    }
  })
}
// 获取页面组件数据,可搜索与弹框分开
const getInSearch = async () => {
  // 获取搜索里关联外键值
  initComponentData(topSetting.componentList)
}

// 获取页面配置属性数据
const getPageSet = async () => {
  // 弹框
  pageSetting.visible = false
  pageSetting.type = ''
  pageSetting.size = 0
  pageSetting.formConf = undefined
  pageSetting.componentList = []
  tableOption.tableLoading = true
  const relationalData = {}
  const selectFields: Array<string> = []
  Object.keys(route.query).forEach((key) => {
    if (!['appid', 'modelid', 'pageId'].includes(key)) {
      relationalData[key] = route.query[key]
      selectFields.push(key)
    }
  })
  let para = {
    dataRequest: {
      modelId: pageParmas.modelId,
      pageId: pageParmas.pageId,
      filterColumns,
      sortFileId: pageSetting.sortField,
      sortOrder: pageSetting.sortType,
      filterParmas: filterlist,
      filterType: {},
      requestConditions: requestConditions,
      relationalData,
      selectFields,
      relationalPageId: pageParmas.pageId,
      conditions: advancedCondition || null,
    },
    pageRequest: pageRequest,
  }
  const res = await getPageSetData(para)
  if (res.code == 200) {
    const { pageItems } = res.data.appPageData
    if (!pageItems || pageItems.components.length === 0) {
      messageAlert('error', '当前页面未设计，无法呈现！')
      resetTableOption()
    } else {
      addable.value = pageItems.addable
      processDefinitionId.value = pageItems.formConf.processDefinitionId
      startFlowLabel.value = pageItems.formConf.startFlowLabel
      initPageConfig(tableOption, res)
      // 数据加载成功后，根据需要加载搜索栏（如果已加载，则不再执行加载）
      pageSetting.reload && initComponentData(topSetting.componentList)
      if (pageItems.components) {
        rowList.options = []
        pageItems.components.forEach((element) => {
          rowList.options.push({
            label: element.__form__.label,
            value: element.__vModel__,
            type: element.componentTag,
          })
        })
        console.log('888', rowList.options)
      }
    }
  }
  requestConditions = []
  tableOption.tableLoading = false
}

//根据appid  获取应用信息和左侧菜单信息
async function getInfoByappid() {
  const { appid, modelid, pageId } = route.query
  let para = {
    applicationId: appid,
    isActive: 1,
  }
  modulesLoading.value = true
  const res = await getAppInfoById(para)
  if (res.code == 200) {
    const { appName, models } = res.data
    app.name = appName
    app.models = models
    // 当有模块id的时候设置默认展开项对应到具体模块的第一个页面
    if (!app.models || app.models.length === 0) {
      modulesLoading.value = false
      return
    }
    // 设置菜单数据源
    setPaths(app.models)
    const currentModel = modelid
      ? app.models.find((f) => f.id == modelid)
      : app.models[0]
    if (!currentModel) {
      modulesLoading.value = false
      return
    }
    initHeaderNav(appName, currentModel, pageId as string)
    if (!currentModel.appPagesList || currentModel.appPagesList.length === 0) {
      tableOption.tableColums = []
      modulesLoading.value = false
      return
    }
    const page =
      (pageId &&
        currentModel.appPagesList.find(
          (f) => f.menuDisplayed === 1 && f.id == pageId
        )) ||
      currentModel.appPagesList.find((f) => f.menuDisplayed === 1)
    if (!page) return
    pageParmas.pageId = page.id
    pageParmas.pageName = page.pageName
    pageParmas.modelName = page.modelName
    pageParmas.modelId = currentModel.id
    curpageType.value = page.pageType

    if (
      curpageType.value === PageType.FORM_PAGE ||
      curpageType.value === PageType.FLOW_PAGE
    ) {
      reloadPage()
    } else if (curpageType.value == PageType.REPORT_PAGE) {
      router.replace({
        path: '/pages/moduledetaillist',
        query: {
          appid: appid,
          modelid: pageParmas.modelId,
          pageId: pageParmas.pageId,
        },
      })
    } else {
      messageAlert('error', '当前页面类型不能展示哦')
    }
  }
  modulesLoading.value = false
}

/**
 * 初始化表格组件数据
 */
function initTableComponentData(row: any, components: any[]) {
  for (let i = 0; i < components.length; i++) {
    const element = components[i] as any
    const tag = element.componentTag
    if (tag === 'designTabTable') {
      tabTableInit(row, element)
    }
  }
}
/**
 * 自动创建值
 */
function autoCreateData(componentList) {
  componentList.forEach((component) => {
    if (
      component.componentTag === 'designAutoCode' &&
      !component.__config__.isSeries
    ) {
      createAutoCode({
        component,
        formModel: form.formData,
        tableId: component.autorule.tableId || pageParmas.pageId,
      })
    }
  })
}

// 按钮执行
function excuteBtn(obj: any) {
  if (!exectId.value) {
    messageAlert('warning', '请保存后再操作')
    return
  }
  let para = {
    pageId: pageParmas.pageId,
    eventCode: obj.component.__config__.eventCode,
    bindingFieldName: 'WorkorderStatus',
    orgId: getStorage('user').value.orgId,
    rowId: exectId.value,
  }
  doBtnEvent(para).then((res) => {
    if (res.code == 200) {
      messageAlert('success', '操作成功')
      getPageSet()
      pageSetting.visible = false
      tableForm.visible = false
      processvisible.value = false
    }
  })
  obj
}

// 更新后的按钮执行
function excuteBtnForm(item: any) {
  if (!exectId.value) {
    messageAlert('warning', '请保存后再操作')
    return
  }
  let para = {
    pageId: pageParmas.pageId,
    eventCode: item.eventCode,
    bindingFieldName: 'WorkorderStatus',
    orgId: getStorage('user').value.orgId,
    rowId: exectId.value,
  }
  doBtnEvent(para).then((res) => {
    if (res.code == 200) {
      messageAlert('success', '操作成功')
      if (para.eventCode == 'IMPORT_WORK') {
        initTableComponentData(form.formData, pageSetting.componentList)
        return
      }
      getPageSet()
      pageSetting.visible = false
      tableForm.visible = false
      processvisible.value = false
    }
  })
}

/**
 * 提交主从表数据
 */
async function onSubmitTableForm() {
  await submitForm(tableForm.formData, null, tableForm.tableId)
  tableForm.visible = false
  tabTableInit(form.formData, tableForm.options)
}

/**
 * 重新加载页面
 */
function reloadPage() {
  pageSetting.reload = true
  getPageSet()
  ModelConditions()
}
/**
 * 重新加载表格
 */
function reloadTable() {
  pageSetting.reload = false
  getPageSet()
}

/**
 * 模型筛选条件
 */
async function ModelConditions() {
  const res = await getModelConditions({ pageId: pageParmas.pageId })
  if (res.code == 200) {
    modelConditionList.value = []
    res.data.forEach((element) => {
      modelConditionList.value.push(element)
    })
  }
}
/**
 * 表格单元格点击跳转，非按钮点击事件
 */
function tableRowClick(
  page: Array<number | string>,
  params: any,
  type?: PenetratePageType = PenetratePageType.PAGE
) {
  if (page && page.length > 0 && type === PenetratePageType.PAGE) {
    router
      .replace({
        path: '/pages/moduledetaillist',
        query: {
          appid: page[0],
          modelid: page[1],
          pageId: page[2],
          ...params,
        },
      })
      .then(() => {
        getInfoByappid()
      })
  } else {
  }
}

getInfoByappid()
</script>

<style lang="scss" scoped>
@import '@/styles/modules/moduledetaillist.scss';
.modelcondition {
  padding: 10px 10px 0 10px;
  margin-left: 80px;
}
.singlecondition {
  display: flex;
  margin: auto 20px;
}
.fieldRemark {
  margin: auto 10px;
}
.el-col {
  margin-right: 20px;
}
</style>

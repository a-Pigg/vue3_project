<template>
  <div class="hfcontent">
    <el-container>
      <el-aside style="height: 100%" width="250px">
        <el-card class="carddiv1" shadow="hover" style="padding: 10px">
          <el-form class="margintop">
            <el-form-item>
              <el-input v-model="input" placeholder="搜索" @input="handleChange" />
            </el-form-item>
          </el-form>
          <el-tree ref="treeRef" class="tree" current-node-key="0" :data="patientList" :default-expanded-keys="['0']"
            :filter-node-method="filterNode" highlight-current node-key="PATIENT_ID" :props="setProps"
            style="height: calc(100vh - 220px)" @node-click="handleNodeClick">
            <template #default="{ node, data }">
              <span :class="node.level === 1 ? 'el-icon-folder-opened yellow' : 'el-icon-tickets blue'"
                style="margin-left: 0; margin-right: 5px"></span>
              <span>
                <span>{{ data.PATIENT_NAME }}</span>
              </span>
            </template>
          </el-tree>
        </el-card>
      </el-aside>
      <el-main style="height: calc(100vh - 138px)">
        <el-card class="carddiv1" shadow="hover">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px">
            <div>
              <el-button class="btnRefresh" @click="refresh">刷新</el-button>
              <el-button class="btnCancel" @click="back">返回</el-button>
              <el-button type="primary" @click="bedReservation">床位预约</el-button>
              <el-button type="primary" @click="openInpatientCaseHistory">住院病历</el-button>
            </div>
            <div>
              <el-radio-group v-if="isCard" v-model="radio">
                <el-radio-button label="卡片" />
                <el-radio-button label="简易" />
              </el-radio-group>
            </div>
          </div>
          <dischargeregistration v-if="!isCard" :bady-page-show="badyPageShow" :dictionary="dictionary"
            :patient-message="deliveryRow" @refresh="refresh2" @submit="refresh" />
          <template v-if="isCard">
            <el-descriptions border class="margintop" :column="5">
              <el-descriptions-item label="病床总数">
                <span class="blue">
                  {{ bedRatioMessage.bedTotal }}
                </span>
              </el-descriptions-item>
              <el-descriptions-item label="占用床位数">
                <span class="blue">
                  {{ bedRatioMessage.occupyBed }}
                </span>
              </el-descriptions-item>
              <el-descriptions-item label="床位占用率">
                <span class="blue">
                  {{ bedRatioMessage.occupyProportion }}
                </span>
              </el-descriptions-item>
              <el-descriptions-item v-if="badyPageShow" label="成人">
                <span class="blue">
                  {{ bedRatioMessage.adultCount }}
                </span>
              </el-descriptions-item>
              <el-descriptions-item v-if="badyPageShow" label="婴儿">
                <span class="blue">
                  {{ bedRatioMessage.badyCount }}
                </span>
              </el-descriptions-item>
            </el-descriptions>
            <el-row v-show="radio === '简易'" class="margintop cardrow" :gutter="20">
              <el-table border :data="bedMessage" height="100%" highlight-current-row
                :row-class-name="tableRowFontColor" @row-contextmenu="rowContextmenu" @row-dblclick="cardDBClick">
                <el-table-column label="床号" prop="BED_NO" sortable />
                <el-table-column label="状态" prop="BED_STATE_NAME" sortable />
                <el-table-column label="姓名" prop="PATIENT_NAME" sortable />
                <el-table-column :formatter="REGISTER_IDFormatter" label="住院号" prop="INPATIENT_NO" sortable />
                <el-table-column label="性别" prop="SEX_NAME" sortable />
                <el-table-column label="年龄" prop="AGE" sortable />
                <el-table-column label="结算类型" prop="PATIENT_MEDICALTYPE_NAME" sortable />
                <el-table-column label="护理级别" prop="ORDER_CARELEVEL" sortable />
                <el-table-column label="入院时间" prop="IN_TIME" sortable />
                <el-table-column label="入院诊断" prop="DIAG_NAME" sortable />
                <el-table-column label="责任护士" prop="RESIDENT_NURSE_NAME" sortable />
                <el-table-column label="住院医生" prop="RESIDENT_DOCT_NAME" sortable />
              </el-table>
            </el-row>
            <el-row v-show="radio === '卡片'" id="card" class="margintop cardrow" :gutter="20">
              <el-col v-for="item in bedMessage" :key="item.BED_NO" :md="6" :span="6" :xl="4">
                <div @drop="drop($event, item)">
                  <el-popover :disabled="item.BED_STATE !== 'O'" placement="top" popper-class="popover" trigger="click"
                    :width="500">
                    <template #reference>
                      <el-card class="card" draggable="true" shadow="hover" @dblclick="cardDBClick(item)"
                        @dragover="onDragover($event)" @dragstart="dragstart($event, item)">
                        <div>
                          <span class="babyBlue">{{ item.BED_NO }}</span>
                          <span class="bedNoMan">
                            {{ item.BED_STATE === 'O' ? item.INPATIENT_NO : '' }}
                          </span>
                        </div>
                        <template v-if="item.BED_STATE === 'O'">
                          <div>
                            <p class="margintop" :class="item.SEX_NAME === '男' ? 'babyBlue' : 'pink'">
                              <vab-icon icon="user-2-fill" style="font-size: 20px" />
                              {{ item.PATIENT_NAME }}
                            </p>
                          </div>
                          <div>
                            <span>{{ item.SEX_NAME }}</span>
                            <span>{{ item.AGE }}</span>
                            <span>{{ item.IN_TIME || '' + '入院' }}</span>
                          </div>
                          <div class="margintop">
                            <span>
                              {{ item.DIAG_NAME == null ? '&nbsp;' : item.DIAG_NAME }}
                            </span>
                          </div>
                          <div class="margintop">
                            <el-tag v-if="item.ORDER_CARELEVEL === '1'" color="#fe0000">Ⅰ</el-tag>
                            <el-tag v-if="item.ORDER_CARELEVEL === '2'" color="#08e524">Ⅱ</el-tag>
                            <el-tag v-if="item.ORDER_CARELEVEL === '3'" color="#e1dfdf">Ⅲ</el-tag>
                            <el-tag v-if="item.CRITICAL_FLAG === '1'" color="#ff9632"
                              style="color: white; font-weight: 600">重</el-tag>
                            <el-tag v-if="item.CRITICAL_FLAG === '2'" color="red"
                              style="color: white; font-weight: 600">危</el-tag>
                            <el-tag v-if="item.PATIENT_MEDICALTYPE_NAME?.substr(0, 1) === '公'" color="#9525a9"
                              style="color: white; font-weight: 600">
                              公
                            </el-tag>
                            <el-tag v-if="item.PATIENT_MEDICALTYPE_NAME?.substr(0, 1) === '自'" color="#9525a9"
                              style="color: white; font-weight: 600">
                              自
                            </el-tag>
                            <el-tag v-if="item.PATIENT_MEDICALTYPE_NAME?.substr(0, 1) === '普'" color="#9525a9"
                              style="color: white; font-weight: 600">
                              普
                            </el-tag>
                            <el-tag v-if="item.PATIENT_MEDICALTYPE_NAME?.substr(0, 1) === '挂'" color="#9525a9"
                              style="color: white; font-weight: 600">
                              挂
                            </el-tag>
                            <el-tag v-if="
                              item.PATIENT_MEDICALTYPE_NAME?.substr(0, 1) !== '普' &&
                              item.PATIENT_MEDICALTYPE_NAME?.substr(0, 1) !== '自' &&
                              item.PATIENT_MEDICALTYPE_NAME?.substr(0, 1) !== '公' &&
                              item.PATIENT_MEDICALTYPE_NAME?.substr(0, 1) !== '挂'
                            " color="#9525a9" style="color: white; font-weight: 600">
                              医
                            </el-tag>
                          </div>
                        </template>
                        <template v-else>
                          <div>
                            <vab-icon icon="hotel-bed-line" style="font-size: 150px; color: #eaeaeb" />
                          </div>
                        </template>
                      </el-card>
                    </template>

                    <template v-if="item.BED_STATE === 'O'">
                      <el-descriptions id="tipdiv" :column="2">
                        <el-descriptions-item label="姓名">
                          <span class="blue1">{{ item.PATIENT_NAME }}</span>
                        </el-descriptions-item>
                        <el-descriptions-item label="经治医生">
                          <span class="blue1">
                            {{ item.RESIDENT_DOCT_NAME }}
                          </span>
                        </el-descriptions-item>
                        <el-descriptions-item label="年龄">
                          <span class="blue1">{{ item.AGE }}</span>
                        </el-descriptions-item>
                        <el-descriptions-item label="联系电话">
                          <span class="blue1">{{ item.PHONE }}</span>
                        </el-descriptions-item>
                        <el-descriptions-item label="入院时间">
                          <span class="blue1">{{ item.IN_TIME }}</span>
                        </el-descriptions-item>
                        <el-descriptions-item label="科室">
                          <span class="blue1">{{ item.DEPT_NAME }}</span>
                        </el-descriptions-item>
                        <el-descriptions-item label="护理级别">
                          <span class="blue1">
                            {{ item.ORDER_CARELEVEL }}
                          </span>
                        </el-descriptions-item>
                        <el-descriptions-item label="责任护士">
                          <span class="blue1">
                            {{ item.RESIDENT_NURSE_NAME }}
                          </span>
                        </el-descriptions-item>
                        <el-descriptions-item label="诊断">
                          <span class="blue1">{{ item.DIAG_NAME }}</span>
                        </el-descriptions-item>
                      </el-descriptions>
                    </template>
                  </el-popover>
                </div>
              </el-col>
            </el-row>
          </template>
        </el-card>
      </el-main>
    </el-container>
    <!-- 右键菜单 -->
    <div v-show="menuVisible">
      <div id="menu" class="menu">
        <div>
          <el-button plain style="width: 100%" type="primary" @click="changeBed">更换床位</el-button>
        </div>
        <div>
          <el-button v-show="contextMenuPatient?.CRITICAL_FLAG !== '2'" plain style="width: 100%" type="primary"
            @click="setCritical">
            设置病危
          </el-button>
        </div>
        <div>
          <el-button v-show="contextMenuPatient?.CRITICAL_FLAG !== '1'" plain style="width: 100%" type="primary"
            @click="setCritical2">
            设置病重
          </el-button>
        </div>
        <div>
          <el-button v-show="contextMenuPatient?.CRITICAL_FLAG === '1'" plain style="width: 100%" type="primary"
            @click="cancelCritical2">
            取消病重
          </el-button>
        </div>
        <div>
          <el-button v-show="contextMenuPatient?.CRITICAL_FLAG === '2'" plain style="width: 100%" type="primary"
            @click="cancelCritical">
            取消病危
          </el-button>
        </div>
      </div>
    </div>
    <!-- 更换床位弹窗 -->
    <el-dialog v-model="changBedShow" :close-on-click-modal="false" destroy-on-close title="选择床位" width="400px">
      <el-card>
        <el-form ref="changeBedFormRef" label-width="100px" :model="changeBedForm" :rules="changeBedrule">
          <el-form-item label="当前床位">
            <el-input v-model="contextMenuPatient" disabled placeholder="" />
          </el-form-item>
          <el-form-item label="更换到" prop="BED_ID">
            <el-select v-model="changeBedForm.BED_ID" filterable placeholder="">
              <el-option v-for="item in bedMessage" :key="item.BED_ID" :label="item.BED_NO" :value="item.BED_ID" />
            </el-select>
          </el-form-item>
        </el-form>
        <div class="flexdiv center">
          <el-button class="btnSave" @click="changeBedCommit">确定</el-button>
          <el-button class="btnCancel" @click="changeBedClose">取消</el-button>
        </div>
      </el-card>
    </el-dialog>

    <inpatient-case-history :key="deliveryRow?.INPATIENT_NO" ref="inpatientCaseHistoryRef" />
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
// import { ElMessage, ElMessageBox, ElTree } from 'element-plus'
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
// 导入API

// ===================== 类型定义 =====================
// 用户信息类型
interface UserInfo {
  userid: string
}

// 患者列表项类型
interface PatientItem {
  PATIENT_ID: string | number
  PATIENT_NAME: string
  VWebMedIpRegisters?: PatientItem[]
  TOTAL_COUNT?: number
  patientType?: string | number
  IN_TIME?: string
}

// 床位信息类型
interface BedItem {
  BED_STATE: string
  BED_STATE_NAME: string
  PATIENT_NAME: string
  INPATIENT_NO: string | number
  SEX_NAME: string
  AGE: string | number
  PATIENT_MEDICALTYPE_NAME: string
  ORDER_CARELEVEL: string
  DIAG_NAME: string
  RESIDENT_NURSE_NAME: string
  RESIDENT_DOCT_NAME: string
  PHONE: string
  DEPT_NAME: string
  CRITICAL_FLAG: string
  BED_ID: string | number
  REGISTER_ID?: string | number
}

// 床位统计信息类型
interface BedRatioMessage {
  bedTotal: number
  occupyBed: number
  occupyProportion: string
  badyCount: number
  adultCount: number
}

// 更换床位表单类型
interface ChangeBedForm {
  BED_ID: string | number
}

// ===================== 响应式数据 =====================
// 树组件Ref
const treeRef = ref<InstanceType<typeof ElTree> | null>(null)
// 更换床位表单Ref
const changeBedFormRef = ref<any>(null)
// 住院病历组件Ref
const inpatientCaseHistoryRef = ref<any>(null)

// 搜索输入框
const input = ref('')
// 患者列表
const patientList = ref<PatientItem[]>([])
// 树配置
const setProps = reactive({
  children: 'VWebMedIpRegisters',
  label: 'PATIENT_NAME',
})
// 床位统计信息
const bedRatioMessage = reactive<BedRatioMessage>({
  bedTotal: 0,
  occupyBed: 0,
  occupyProportion: '',
  badyCount: 0,
  adultCount: 0,
})
// 双击选中的行
const clickRow = ref<PatientItem | null>(null)
// 床位信息列表
const bedMessage = ref<BedItem[]>([])
// 是否显示卡片视图
const isCard = ref(true)
// 传给子组件的患者数据
const deliveryRow = ref<BedItem | {}>({})
// 视图切换（卡片/简易）
const radio = ref('卡片')
// 右键菜单显示状态
const menuVisible = ref(false)
// 是否显示婴儿登记页面
const badyPageShow = ref(false)
// 字典数据
const dictionary = ref<any[]>([])
// 当前护士站ID
const deptid = ref('')
// 右键选中的患者
const contextMenuPatient = ref<BedItem | null>(null)
// 更换床位弹窗显示状态
const changBedShow = ref(false)
// 更换床位表单
const changeBedForm = reactive<ChangeBedForm>({
  BED_ID: '',
})
// 更换床位表单校验规则
const changeBedrule = reactive({
  BED_ID: [{ required: true, message: '请选择床号', trigger: 'change' }],
})

// 模拟从store获取用户信息（实际项目中替换为真实的store调用）
const userInfo = computed<UserInfo>(() => {
  // 这里仅做示例，实际需要从pinia/vuex获取
  return {
    userid: 'admin', // 示例值，根据实际情况修改
  }
})

// ===================== 方法定义 =====================
/**
 * 打开住院病历
 */
const openInpatientCaseHistory = async () => {
  try {
    const Loading = (window as any).$baseColorfullLoading?.(1, '查询中...')
    const res = await RecordCreateNewRecordSet({
      ParamValue: (deliveryRow.value as BedItem).REGISTER_ID,
    })
    if (res.code !== 200) return
    await Promise.resolve() // 替代$nextTick
    inpatientCaseHistoryRef.value?.open(
      {
        ...deliveryRow.value,
        INPATIENT_NO: (deliveryRow.value as BedItem).REGISTER_ID,
        PATIENT_ID: (deliveryRow.value as BedItem).PATIENT_ID,
        DeptID: (deliveryRow.value as BedItem).DEPT_ID,
        Name: (deliveryRow.value as BedItem).PATIENT_NAME,
        Age: (deliveryRow.value as BedItem).AGE,
        BedNo: (deliveryRow.value as BedItem).BED_NO,
        Sex: (deliveryRow.value as BedItem).SEX_CODE,
        DeptName: (deliveryRow.value as BedItem).DEPT_NAME,
        HisInpatientNo: (deliveryRow.value as BedItem).REGISTER_ID,
        PatientNo: (deliveryRow.value as BedItem).INPATIENT_NO,
        DeptCode: (deliveryRow.value as BedItem).DEPT_ID,
        IsSealed: true,
      },
      false
    )
    Loading?.close()
  } catch (error) {
    console.error('打开住院病历失败:', error)
  }
}

/**
 * 打开床位预约页面
 */
const bedReservation = () => {
  window.open('http://172.172.10.32:8013/#/begcenter/myapply?Account=admin&HospitalWard=01')
}

/**
 * 交换床位
 * @param TO_REGISTER_ID 目标患者登记ID
 */
const exchangeBedFn = async (TO_REGISTER_ID: string | number) => {
  try {
    const Loading = (window as any).$baseColorfullLoading?.(1, '加载中...')
    const res = await exchangeBed({
      FROM_REGISTER_ID: contextMenuPatient.value?.REGISTER_ID,
      TO_REGISTER_ID,
    })
    if (res.code !== 200) return
    ElMessage({
      type: 'success',
      message: '更换成功!',
    })
    changeBedClose()
    refresh()
    Loading?.close()
  } catch (error) {
    console.error('交换床位失败:', error)
  }
}

/**
 * 更换到空床
 */
const commitBed = async () => {
  try {
    const Loading = (window as any).$baseColorfullLoading?.(1, '加载中...')
    const res = await changeBed({
      FROM_REGISTER_ID: contextMenuPatient.value?.REGISTER_ID,
      BED_ID: changeBedForm.BED_ID,
    })
    if (res.code !== 200) {
      ElMessage({
        type: 'warning',
        message: res.msg,
      })
      return
    }
    ElMessage({
      type: 'success',
      message: '更换成功!',
    })
    changeBedClose()
    refresh()
    Loading?.close()
  } catch (error) {
    console.error('更换床位失败:', error)
  }
}

/**
 * 关闭更换床位弹窗
 */
const changeBedClose = () => {
  changBedShow.value = false
  // 重置表单
  changeBedForm.BED_ID = ''
  changeBedFormRef.value?.resetFields()
}

/**
 * 打开更换床位弹窗
 */
const changeBed = () => {
  if (!contextMenuPatient.value) return
  changBedShow.value = true
}

/**
 * 取消病危
 */
const cancelCritical = async () => {
  if (!contextMenuPatient.value) return
  try {
    const Loading = (window as any).$baseColorfullLoading?.(1, '加载中...')
    const res = await setCritical({
      REGISTER_ID: contextMenuPatient.value.REGISTER_ID,
      CRITICAL_FLAG: '2',
      IS_CANCEL: 1,
    })
    if (res.code !== 200) return
    ElMessage({
      type: 'success',
      message: '设置成功!',
    })
    refresh()
    Loading?.close()
  } catch (error) {
    console.error('取消病危失败:', error)
  }
}

/**
 * 取消病重
 */
const cancelCritical2 = async () => {
  if (!contextMenuPatient.value) return
  try {
    const Loading = (window as any).$baseColorfullLoading?.(1, '加载中...')
    const res = await setCritical({
      REGISTER_ID: contextMenuPatient.value.REGISTER_ID,
      CRITICAL_FLAG: '1',
      IS_CANCEL: 1,
    })
    if (res.code !== 200) {
      ElMessage({
        type: 'warning',
        message: res.msg,
      })
      return
    }
    ElMessage({
      type: 'success',
      message: '设置成功!',
    })
    refresh()
    Loading?.close()
  } catch (error) {
    console.error('取消病重失败:', error)
  }
}

/**
 * 设置病重
 */
const setCritical2 = async () => {
  if (!contextMenuPatient.value) return
  try {
    const Loading = (window as any).$baseColorfullLoading?.(1, '加载中...')
    const res = await setCritical({
      REGISTER_ID: contextMenuPatient.value.REGISTER_ID,
      CRITICAL_FLAG: '1',
      IS_CANCEL: 0,
    })
    if (res.code !== 200) return
    ElMessage({
      type: 'success',
      message: '设置成功!',
    })
    refresh()
    Loading?.close()
  } catch (error) {
    console.error('设置病重失败:', error)
  }
}

/**
 * 设置病危
 */
const setCritical = async () => {
  if (!contextMenuPatient.value) return
  try {
    const Loading = (window as any).$baseColorfullLoading?.(1, '加载中...')
    const res = await setCritical({
      REGISTER_ID: contextMenuPatient.value.REGISTER_ID,
      CRITICAL_FLAG: '2',
      IS_CANCEL: 0,
    })
    if (res.code !== 200) {
      ElMessage({
        type: 'warning',
        message: res.msg,
      })
      return
    }
    ElMessage({
      type: 'success',
      message: '设置成功!',
    })
    refresh()
    Loading?.close()
  } catch (error) {
    console.error('设置病危失败:', error)
  }
}

/**
 * 设置表格行颜色
 * @param param0 行数据
 * @returns 样式类名
 */
const tableRowFontColor = ({ row }: { row: BedItem }) => {
  if (row.CRITICAL_FLAG === '1') return 'orange'
  else if (row.CRITICAL_FLAG === '2') return 'red'
  else return ''
}

/**
 * 处理树节点点击（模拟双击）
 * @param row 节点数据
 * @param node 节点对象
 */
const handleNodeClick = async (row: PatientItem, node: any) => {
  if (node.level === 1) return
  // 模拟双击
  const DIAG_NAME = (await queryByPatient(row.PATIENT_ID as string, row.INPATIENT_NO as string)) || '-'
  if (clickRow.value === row) {
    clickRow.value = null
    isCard.value = false
    deliveryRow.value = {
      ...row,
      DIAG_NAME,
    }
  } else {
    clickRow.value = row
  }
  setTimeout(() => {
    clickRow.value = null
  }, 700)
}

/**
 * 查询患者信息
 * @param PatientID 患者ID
 * @param InPatientNO 住院号
 * @returns 诊断名称
 */
const queryByPatient = async (PatientID: string, InPatientNO: string) => {
  try {
    const res = await QueryByPatient({
      PatientID,
      InPatientNO,
    })
    if (res.code === 200 && res.data?.ResultList?.length) {
      return res.data.ResultList.find((item: any) => item.Diagnose.IsMainDiagnose)?.Diagnose?.IcdDiseaseName
    }
    return ''
  } catch (error) {
    console.error('查询患者信息失败:', error)
    return ''
  }
}

/**
 * 获取病房数据
 */

/**
 * 设置床位信息列表
 * @param array 床位数据数组
 */
const setpPtientCollection = (array: BedItem[]) => {
  bedMessage.value = array
  bedMessage.value.forEach((value) => {
    if (value.IN_TIME) {
      value.IN_TIME = dayjs(value.IN_TIME).format('YYYY-MM-DD')
    }
  })
}

/**
 * 设置字典数据
 */
const setDictionaries = async () => {
  try {
    const res = await getDropListItemForWardInfo()
    if (res.code === 200) {
      Object.assign(dictionary.value, res.data)
    }
  } catch (err) {
    console.error(err)
  }
}

/**
 * 获取字典数据
 */
const getDictionary2 = async () => {
  try {
    const res = await getDeptForWardInfo()
    if (res.code === 200) {
      Object.assign(dictionary.value, res.data)
    }
  } catch (err) {
    console.error(err)
  }
}

/**
 * 双击患者卡片
 * @param item 床位数据
 */
const cardDBClick = async (item: BedItem) => {
  if (item.BED_STATE !== 'O') {
    ElMessage({
      type: 'warning',
      message: '该病床没有患者!!',
    })
    return
  }
  isCard.value = false
  item.patientType = '0'
  const DIAG_NAME = await queryByPatient(item.PATIENT_ID as string, item.INPATIENT_NO as string)
  deliveryRow.value = {
    ...item,
    DIAG_NAME,
  }
}

/**
 * 处理搜索输入
 * @param value 搜索值
 */
const handleChange = (value: string) => {
  treeRef.value?.filter(value)
}

/**
 * 树节点过滤方法
 * @param value 搜索值
 * @param data 节点数据
 * @returns 是否匹配
 */
const filterNode = (value: string, data: PatientItem) => {
  if (!value || data.VWebMedIpRegisters) return true
  return data.PATIENT_NAME.indexOf(value) !== -1
}

/**
 * 刷新页面数据
 */
const refresh = () => {
  getWard()
  setBebMessage()
  isCard.value = true
}

/**
 * 刷新数据但不重置页面
 */
const refresh2 = () => {
  getWard()
  setBebMessage()
}

/**
 * 返回卡片视图
 */
const back = () => {
  isCard.value = true
}

/**
 * 获取床位信息
 */
const setBebMessage = async () => {
  try {
    const res = await getBedInfo()
    if (res.code === 200) {
      setpPtientCollection(res.data)
      bedRatioMessage.bedTotal = res.data.length
      bedRatioMessage.occupyBed = 0
      res.data.forEach((item: BedItem) => {
        if (item.BED_STATE === 'O') {
          bedRatioMessage.occupyBed++
        }
      })
      // 计算床位占用率
      const proportion = bedRatioMessage.bedTotal > 0 ? ((bedRatioMessage.occupyBed / bedRatioMessage.bedTotal) * 100).toFixed(2) : '0.00'
      bedRatioMessage.occupyProportion = `${proportion}%`
    }
  } catch (err) {
    console.error(err, 2333)
  }
}

/**
 * 拖拽开始
 * @param e 事件对象
 * @param message 床位数据
 */
const dragstart = (e: DragEvent, message: BedItem) => {
  console.log(message)
  console.log('拖拽开始')
}

/**
 * 拖拽结束
 * @param e 事件对象
 * @param message 床位数据
 */
const drop = (e: DragEvent, message: BedItem) => {
  console.log(message)
  console.log('结束拖拽')
}

/**
 * 阻止拖拽默认行为
 * @param event 事件对象
 */
const onDragover = (event: DragEvent) => {
  event.preventDefault()
}

/**
 * 表格行右键菜单
 * @param row 行数据
 * @param column 列数据
 * @param event 事件对象
 */
const rowContextmenu = (row: BedItem, column: any, event: MouseEvent) => {
  if (row.BED_STATE === 'U') return
  contextMenuPatient.value = row
  event.preventDefault()
  menuVisible.value = false
  menuVisible.value = true
  const menu = document.querySelector('#menu') as HTMLElement
  if (menu) {
    menu.style.left = `${event.clientX + 10}px`
    Promise.resolve().then(() => {
      if (event.clientY + menu.offsetHeight + 150 > window.screen.height) {
        menu.style.top = `${event.clientY - menu.offsetHeight}px`
      } else {
        menu.style.top = `${event.clientY}px`
      }
    })
    // 添加点击关闭事件
    document.addEventListener('click', foo)
  }
}

/**
 * 关闭右键菜单
 */
const foo = () => {
  menuVisible.value = false
  document.removeEventListener('click', foo)
}

/**
 * 住院号格式化
 * @param row 行数据
 * @param column 列数据
 * @param cellValue 单元格值
 * @returns 格式化后的值
 */
const REGISTER_IDFormatter = (row: BedItem, column: any, cellValue: number) => {
  if (cellValue === 0) {
    return ''
  }
  return cellValue
}

/**
 * 判断是否显示婴儿登记页面
 */
const SetBadyPageShow = () => {
  for (let i = 0; i < (dictionary.value?.USEBABYDEPT || []).length; i++) {
    if (dictionary.value.USEBABYDEPT[i].Id === deptid.value) {
      badyPageShow.value = true
      computeBadyAndAdult()
      return
    }
  }
  badyPageShow.value = false
}

/**
 * 计算婴儿和成人数量
 */
const computeBadyAndAdult = () => {
  bedRatioMessage.badyCount = (patientList.value[0]?.VWebMedIpRegisters?.length || 0) - bedRatioMessage.occupyBed
  bedRatioMessage.adultCount = bedRatioMessage.occupyBed
}

// ===================== 生命周期 =====================
/**
 * 组件挂载时
 */
onMounted(async () => {
  try {
    const Loading = (window as any).$baseColorfullLoading?.(1, '加载中...')
    await setDictionaries()
    await getDictionary2()
    await setBebMessage()
    await getWard()
    SetBadyPageShow()
    Loading?.close()
  } catch (error) {
    console.error('组件初始化失败:', error)
  }
})

/**
 * 组件卸载时
 */
onUnmounted(() => {
  // 移除事件监听
  document.removeEventListener('click', foo)
    // 移除bus事件（如果项目中使用了bus）
    ; (window as any).$bus?.off('getDictionary')
})
</script>

<style scoped lang="scss">
.hfcontent {
  padding: 0;
  background-color: #f6f8f9 !important;
  height: 100%;

  :deep() {
    .el-main {
      padding: 0 0 0 10px;
    }

    .el-card {
      padding: 5px;
    }

    .orange {
      .cell {
        color: orange;
      }
    }

    .el-card__body {
      padding: 10px;
    }

    .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
      background-color: var(--el-color-primary-light-3);
      color: white;
    }
  }
}

.carddiv1 {
  height: 100%;
  margin-bottom: 0 !important;

  :deep(.el-card__body) {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .tree,
  .cardrow {
    overflow: auto;
  }
}

.babyBlue {
  color: #1b9eda;
  font-size: 18px;
}

#tipdiv:deep(.el-descriptions__body) {
  background-color: rgba(0, 0, 0, 0);
}

.pink {
  color: pink;
  font-size: 18px;
}

.blue1 {
  color: blue;
  font-size: 16px;
}

.card {
  height: 200px;
  font-weight: 600;
}

.menu {
  width: 120px;
  position: fixed;
  border: 1px solid #999999;
  background-color: #f4f4f4;
  z-index: 99999;
  padding-inline-start: 0px;
}
</style>

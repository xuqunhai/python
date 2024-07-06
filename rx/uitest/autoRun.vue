<template>
  <div class="relative z-10 flex h-full w-72 flex-col overflow-auto bg-white">
    <div class="p-4">
      <el-button
        v-if="isElectron === 'Y'"
        class="w-20"
        type="primary"
        @click="testPreview()"
      >
        预览
      </el-button>
    </div>
    <div class="mb-5 pl-4 text-xs text-[#909399]">设置步骤内容</div>
    <div class="flex-1 overflow-auto px-4">
      <el-form
        ref="formRef"
        v-loading="detailLoading"
        :model="stepModel"
        :rules="rules"
        label-width="110px"
        :inline="false"
        size="default"
      >
        <el-form-item label="动作名称：" prop="stepName">
          <el-input v-model="stepModel.stepName" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="处理动作：">
          <el-select v-model="stepModel.stepType" @change="stepTypeChange">
            <el-option
              v-for="item in stepTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <template v-if="stepModel.stepType === 9">
          <el-form-item label="数据来源：">
            <el-select
              v-model="stepModel.stepDataSource"
              @change="stepDataSourceChange"
            >
              <el-option
                v-for="item in stepDataSourceOpts"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item> </template
      ></el-form>
    </div>
  </div>
</template>
<el-form-item
v-if="isShowDomPath"
label="元素路径："
prop="stepDomPath"
>
<el-autocomplete
v-model="stepModel.stepDomPath"
placeholder="请输入"
:fetch-suggestions="querySearch"
/>
</el-form-item>
<el-form-item v-if="isUploadType" label="选中文件：">
<el-select v-model="stepModel.stepValue" @change="stepTypeChange">
<el-option
v-for="item in fileList"
:key="item.id"
:label="item.fileDesc"
:value="item.filePath"
/>
</el-select>
</el-form-item>
<el-form-item v-if="stepModel.stepType === 3" label="断言类型：">
<el-select v-model="stepModel.patternType">
<el-option
v-for="item in patternTypes"
:key="item.value"
:label="item.label"
:value="stepModel.isFunPreDefined ? item.value : item.label"
/>
</el-select>
</el-form-item>
<el-form-item
v-if="stepModel.stepType === 3 && stepModel.patternType !== 'text'"
label="是否选中："
>
<el-radio-group v-model="stepModel.isChecked">
<el-radio :label="true"> 是 </el-radio>
<el-radio :label="false"> 否 </el-radio>
</el-radio-group>
</el-form-item>
<el-form-item v-if="stepModel.stepType === 2" label="选择值：">
<el-radio-group
v-model="stepModel.isSelected"
@change="changeIsSelected"
>
<el-radio :label="true"> 是 </el-radio>
<el-radio :label="false"> 否 </el-radio>
</el-radio-group>
</el-form-item>
<el-form-item v-if="stepModel.stepType === 4" label="选项值：">
<el-input v-model="stepModel.stepSelect" placeholder="请输入" />
</el-form-item>
<el-form-item v-if="stepModel.stepType === 4" label="选项内容：">
<el-input v-model="stepModel.stepSelectVal" placeholder="请输入" />
</el-form-item>
<el-form-item v-if="stepModel.stepType === 5" label="手动录入：">
<el-radio-group v-model="stepModel.isHandle">
<el-radio :label="true"> 是 </el-radio>
<el-radio :label="false"> 否 </el-radio>
</el-radio-group>
</el-form-item>
<el-form-item
v-if="stepModel.stepType === 5 && stepModel.isHandle"
label="下滑个数："
>
<el-input-number
v-model="stepModel.slides"
:min="0"
:step="1"
:controls="true"
/>
</el-form-item>
<el-form-item
v-if="stepModel.stepType === 5 && !stepModel.isHandle"
label="滑动距离："
>
<div>合计：</div>
<div class="mr-2">X:0</div>
<div>Y:0</div>
</el-form-item>
<template v-if="stepModel.stepType === 7">
  <el-form-item label="函数类型：">
    <el-radio-group
      v-model="stepModel.isFunPreDefined"
      @change="changeFunDefined"
    >
      <el-radio :label="true"> 预定义 </el-radio>
      <el-radio :label="false"> 自定义 </el-radio>
    </el-radio-group>
  </el-form-item>
  <el-form-item label="选择函数：">
    <el-select v-model="stepModel.funName" @change="selectFun">
      <el-option
        v-for="item in funTypes"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </el-form-item>
  <el-form-item label="函数参数：">
    <el-input
      v-model="stepModel.funParams"
      type="textarea"
      :placeholder="
        stepModel.isFunPreDefined
          ? '{a1:123, b:{b1:1,b2:2}}'
          : '[实参1,实参数2...]其中[,]必须为英文字符'
      "
    />
  </el-form-item>
</template>
<el-form-item
v-if="stepModel.stepType === 2 && stepModel.isSelected"
label="请选择："
>
<el-select v-model="stepModel.stepValue">
<el-option
v-for="item in varTypes"
:key="item.value"
:value="item.value"
>
<el-tooltip
placement="top"
:content="item.label + '=' + item.value"
>
{{ item.label + '=' + item.value }}
</el-tooltip>
</el-option>
</el-select>
</el-form-item>
<el-form-item
v-if="
(stepModel.stepType === 3 && stepModel.patternType === 'text') ||
(stepModel.stepType === 2 && !stepModel.isSelected) ||
stepModel.stepType === 8
"
label="输入值："
>
<el-input
v-model="stepModel.stepValue"
:placeholder="
stepModel.stepType === 8 ? '格式YYYY-MM-DD' : '请输入'
"
/>
</el-form-item>
<el-form-item label="延时(s)：">
<el-input
v-model="stepModel.stepSleep"
type="number"
placeholder="请输入"
/>
</el-form-item>
<el-form-item v-if="!stepModel.id" label="插入序号：">
<el-input v-model.number="stepModel.order" placeholder="请输入" />
</el-form-item>
<el-form-item v-if="route.query.isLoginCase === 'Y'" label="步骤类型：">
<el-radio-group v-model="stepModel.stepFlag">
<el-radio :label="0"> 普通 </el-radio>
<el-radio :label="1"> 录账号步骤 </el-radio>
<el-radio :label="2"> 录密码步骤 </el-radio>
</el-radio-group>
</el-form-item>
<el-form-item label="是否豁免步骤：">
<el-radio-group
v-model="stepModel.isExempt"
:disabled="disableExempt"
>
<el-radio label="Y"> 是 </el-radio>
<el-radio label="N"> 否 </el-radio>
</el-radio-group>
</el-form-item>
<el-form-item v-if="stepModel.isExempt === 'Y'" label="是否为子步骤：">
<el-radio-group
v-model="stepModel.isExemptChild"
:disabled="disableExempt"
>
<el-radio label="Y"> 是 </el-radio>
<el-radio label="N"> 否 </el-radio>
</el-radio-group>
</el-form-item>
<el-form-item
v-if="stepModel.isExemptChild === 'Y'"
label="选择父步骤："
prop="exemptFatherId"
>
<el-select
v-model="stepModel.exemptFatherId"
:disabled="disableExempt"
clearable
>
<el-option
v-for="item of exemptFatherOptions"
:key="item.id"
:value="item.id || ''"
:label="`${item.index}、${item.stepName}`"
/>
</el-select>
</el-form-item>
<el-form-item
v-if="stepModel.isExemptChild === 'Y'"
label="指定插入序号："
>
<el-select
v-model="stepModel.exemptSerial"
:disabled="disableExempt"
clearable
>
<el-option
v-for="item in exemptSerialOptions"
:key="`serial${item.value}`"
:value="item.value"
:label="item.label"
/>
</el-select>
</el-form-item>
<div class="flex justify-center pt-1">
<el-button class="w-20" type="primary" @click="onSubmit(formRef)">
{{ stepModel.id ? '保存' : '添加' }}
</el-button>
</div>
</el-form>
</div>
</div>
</template>
  

<script setup lang="ts">
import { ElMessage } from "element-plus";
import { computed, ref, watch, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { getStepFileList } from "@/api/file-management";
import {
  queryStepDetail,
  updateCaseStep,
  createCaseStep,
  queryByCaseIdForDebug,
} from "@/api/steps-management";
import { useStepStore, InitStepObj, StepModel } from "@/stores/step";
import { sleep, sendMessageToEditPage } from "@/util";
import { queryVariablePage } from "@/api/data-management";
import { queryFunctionPage } from "@/api/function-management";
import type { FormRules, FormInstance } from "element-plus";
import type {
  IGetStepFileListResult,
  Step,
} from "@/api/models/steps-management";
import type { VariableDataInfo } from "@/api/models/data-management";
const stepTypes = [
  { label: "点击", value: 1 },
  { label: "输入", value: 2 },
  { label: "断言", value: 3 },
  { label: "下拉列表", value: 4 },
  // { label: 'slide', value: 5 },
  { label: "文件上传", value: 6 },
  { label: "函数设置", value: 7 },
  { label: "日期设置", value: 8 },
  { label: "神兵接口处理数据", value: 9 },
];
// TODO stepDataSourceOpts 数据需从接口获取
const stepDataSourceOpts = ref<any[]>([]);
const patternTypes = [
  { label: "文本", value: "text" },
  { label: "单选", value: "radio" },
  { label: "多选", value: "checkbox" },
];
const preDefinedFunTypes = [
  { label: "getRandomId", value: "getRandomId" },
  { label: "setLocalStorage", value: "setLocalStorage" },
  { label: "removeLocalStorage", value: "removeLocalStorage" },
];
const fileList = ref<IGetStepFileListResult["list"]>([]);
const isElectron = window.electron ? "Y" : "";
interface DompathItem {
  value: string;
}
interface FunTypeItem {
  label: string;
  value: string;
  params?: string;
}
interface VarTypeItem {
  label: string;
  value: string;
}
const route = useRoute();
const stepStore = useStepStore();
const stepModel = ref<StepModel>(InitStepObj);
const rules: FormRules = {
  stepName: [{ required: true, message: "请输入动作名称", trigger: "blur" }],
  stepDomPath: [{ required: true, message: "请输入元素路径", trigger: "blur" }],
  exemptFatherId: [
    { required: true, message: "请选择父步骤", trigger: "change" },
  ],
};
const formRef = ref<FormInstance>();
const isUploadType = computed(() => stepModel.value.stepType === 6);
const isShowDomPath = computed(() => {
  return ![7, 9].includes(stepModel.value.stepType as number);
});
const detailLoading = ref(false);
const funTypes = ref<FunTypeItem[]>([]);
const definedFunTypes = ref<FunTypeItem[]>([]);
const varTypes = ref<VarTypeItem[]>([]);
const domPaths = ref<DompathItem[]>([]);
const stepDomObj = ref<Record<string, any>>({});
// 「选择父步骤」筛选当前url的所有父步骤
const exemptFatherOptions = computed(() =>
  stepStore.allSteps.filter(
    (step) =>
      step.isExempt === "Y" &&
      step.isExemptChild !== "Y" &&
      stepStore.activeCurrentUrl === step.stepUrl
  )
);
// 「指定插入序号」筛选所选父步骤所有可能的子步骤序号
const exemptSerialOptions = computed(() => {
  // 子步骤总长度
  const length =
    stepStore.allSteps.filter(
      (step) => step.exemptFatherId === stepModel.value.exemptFatherId
    ).length + 1;
  // 父步骤第一个子步骤的索引（index属性）
  const firstChild = stepStore.allSteps.find(
    (step) => step.exemptFatherId === stepModel.value.exemptFatherId
  )?.index;
  const options = firstChild
    ? Array.from({ length }, (_, index) => ({
        value: index + 1, // 位置可以选末尾 所以+1
        label: firstChild + index,
      }))
    : [];
  return options;
});
const disableExempt = false;
const resetForm = () => {
  formRef.value?.resetFields();
  stepModel.value.id = "";
};
async function getStepDetail() {
  try {
    detailLoading.value = true;
    const data = await queryStepDetail({
      id: stepStore.activeStep.id || 0,
      projectId: Number(route.query.projectId),
    });
    const parseValue = JSON.parse(data.stepValue || "{}");
    const stDom = data.stepDom ? JSON.parse(data.stepDom) : {};
    stepModel.value = {
      ...data,
      ...parseValue,
      stepDataSource: data.stepType === 9 ? parseValue.stepId : "",
      stepDomPath: stDom.dom || stDom, // 旧数据兼容，部分数据是dom字符串，不是对象字符串{dom:''}
      stepValue: parseValue.stepValue || "",
    };
    stepDomObj.value = typeof stDom === "object" ? stDom : {};
    domPaths.value = (stDom.domPaths || [stDom.dom || stDom]).map(
      (e: string) => ({ value: e })
    );
    sendMessageToEditPage({
      type: "UI-SELECTED-EDIT",
      dom: stDom.dom || stDom,
    });
    await sleep(300);
    detailLoading.value = false;
  } catch (error) {
    detailLoading.value = false;
    ElMessage.error("查询步骤详情失败，请重试");
    console.log(error);
  }
}
async function getVariableList() {
  const { list } = await queryVariablePage({
    projectId: Number(route.query.projectId),
    varName: "",
    varValue: "",
  });
  const options = list.reduce<
    Array<{
      label: string;
      value: string;
    }>
  >((acc, item) => {
    if (item.statusFlag !== 1) return acc;
    if (item.varValue === "api2.case.runCase") {
      const subItems = (item.field || "").split(",");
      subItems.forEach((subItem) => {
        acc.push({ label: item.varName, value: subItem });
      });
    } else {
      acc.push({ label: item.varName, value: item.varValue });
    }
    return acc;
  }, []);
  varTypes.value = options;
  getStepDataSourceOpts(list);
}
async function getFuncList() {
  const data = await queryFunctionPage({
    projectId: Number(route.query.projectId),
    fnName: "",
    fnValue: "",
  });
  const status1Data = data.list.filter((obj) => obj.statusFlag === 1);
  definedFunTypes.value = status1Data.map((item) => ({
    label: item.fnName,
    value: item.fnValue,
  }));
  if (!stepModel.value.isFunPreDefined) {
    funTypes.value = definedFunTypes.value;
  }
}
// 「是否豁免步骤、是否为子步骤」选否清除元素的同时清除表单
watchEffect(() => {
  if (stepModel.value.isExempt === "N") {
    stepModel.value.isExemptChild = undefined;
    stepModel.value.exemptFatherId = undefined;
    stepModel.value.exemptSerial = undefined;
  }
  if (stepModel.value.isExemptChild === "N") {
    stepModel.value.exemptFatherId = undefined;
    stepModel.value.exemptSerial = undefined;
  }
});
getVariableList();
getFuncList();
watch(
  () => stepStore.activeStep,
  async (obj: Record<string, any>) => {
    // 如果是保存过的豁免步骤则「是否为子步骤、选择父步骤、指定插入序号」不能编辑
    // disableExempt = obj.id != null
    if (Object.prototype.hasOwnProperty.call(obj, "id")) {
      getStepDetail();
    } else {
      stepModel.value = {
        ...InitStepObj,
        ...obj,
        stepDomPath: obj.stepDom?.dom,
      };
      domPaths.value = (stepStore.selectDom.domPaths || []).map(
        (e: string) => ({ value: e })
      );
      stepDomObj.value = obj.stepDom;
      if (domPaths.value.length === 0) {
        domPaths.value.push({ value: stepStore.selectDom.dom });
      }
    }
  },
  { deep: true, immediate: true }
);
// 处理动作为 function ，函数类型切换时
watch(
  () => stepModel.value.isFunPreDefined,
  (val) => {
    if (val) {
      funTypes.value = preDefinedFunTypes;
    } else {
      funTypes.value = definedFunTypes.value;
    }
  }
);
watch(isUploadType, async (nv) => {
  if (nv !== true) return;
  const { list } = await getStepFileList(String(route.query.projectId));
  fileList.value = list;
  console.log("fileList.value", fileList.value);
});
function stepTypeChange(val: number) {
  if (val === 6) {
    if (!stepStore.selectDom.domFile) {
      ElMessage.warning("选定元素未找到上传文本框，请扩大待添加元素范围");
      stepModel.value.stepType = 1;
    } else if (stepStore.selectDom.domFile?.length > 1) {
      ElMessage.warning("选定元素包含多个上传文本框，请缩小待添加元素范围");
      stepModel.value.stepType = 1;
    }
  }
}
const getStepDataSourceOpts = (listData: VariableDataInfo[]) => {
  const formatter = (list: any[], item: VariableDataInfo) => {
    const { type, varName: label, id: value, statusFlag: sF } = item;
    const opt = type === 3 && sF === 1 ? { label, value, ...item } : null;
    return opt ? [...list, opt] : list;
  };
  stepDataSourceOpts.value = listData.reduce(formatter, []);
};
const stepDataSourceChange = (val: number) => {
  console.log("[stepDataSourceChange] ==> ", val);
};
function selectFun(val: string) {
  if (!stepModel.value.isFunPreDefined) {
    const funObj = funTypes.value.filter((item) => item.label === val)[0] || {};
    stepModel.value.funValue = funObj.value;
  }
}
function changeFunDefined() {
  stepModel.value.funName = "";
}
function changeIsSelected() {
  stepModel.value.stepValue = "";
}
// 获取滑动距离 type:start 开始滑动；end 确认滑动距离
/* function slideDrag(type: 'start' | 'end') {
if (type == 'start') {
let _stepDom = unref(stepStore.selectDom)
if (stepModel.value.id) {
_stepDom = JSON.parse(stepModel.value.stepDomPath)
}
// 提交后selectDomData不会清空
if (!_stepDom.slideDom || !stepModel.value.stepName) {
ElMessage.warning('请先选择滑动元素')
return
}
  

stepStore.setSelectDom({
distanceX: 0,
distanceY: 0,
countDistanceY: 0,
countDistanceX: 0
})
}
  

canSlide.value = !canSlide.value
sendMessageToEditPage({
type: 'UI-SELECTED_DRAG',
data: {
type,
selectDomData: stepStore.selectDom
}
})
} */
function querySearch(str: string, cb: any) {
  cb(domPaths.value);
}
const getStepUrl = () => {
  const stepUrlMap = {
    "9": "数据处理步骤",
  };
  const type = stepModel.value.stepType as unknown as keyof typeof stepUrlMap;
  return stepUrlMap[type] ?? stepStore.iframeCurrentUrl.split("?")[0];
};
function makeStepParams(): Step {
  const {
    id,
    stepName,
    stepType,
    stepValue,
    stepDomPath,
    stepSleep,
    order,
    isSelected,
    patternType,
    isChecked,
    stepSelect,
    stepSelectVal,
    isHandle,
    slides,
    isFunPreDefined,
    funName,
    funParams,
    funValue,
    stepFlag,
    isExempt,
    isExemptChild,
    exemptFatherId,
    exemptSerial,
    stepDataSource,
  } = stepModel.value;
  const params = {
    id,
    stepName,
    stepType,
    stepUrl: getStepUrl(),
    stepDom: JSON.stringify({
      ...stepDomObj.value,
      dom: stepDomPath,
    }),
    stepSleep,
    stepFlag,
    caseId: route.query.caseId,
    order,
    projectId: route.query.projectId,
    isExempt,
    isExemptChild,
    exemptFatherId,
    exemptSerial,
    stepDataSource,
  };
  let paramStepValue = stepValue;
  switch (stepType) {
    case 1: // click，无输入值
      paramStepValue = "";
      break;
    case 2: // input,是否选择值和输入值
      paramStepValue = JSON.stringify({
        isSelected,
        stepValue,
      });
      break;
    case 3: // pattern,断言类型和输入值
      paramStepValue = JSON.stringify({
        patternType,
        isChecked,
        stepValue: patternType === "text" ? stepValue : "",
      });
      break;
    case 4: // 系统select,输入选项值和选项内容
      paramStepValue = JSON.stringify({ stepSelect, stepSelectVal });
      break;
    case 5: // slide,手动输入、下滑个数、滑动距离
      paramStepValue = JSON.stringify({ slides, isHandle });
      break;
    case 6: // uploadFile，无输入值
      paramStepValue = JSON.stringify({
        filePathText: stepModel.value.stepValue,
        uploadDom: stepModel.value.stepDomPath,
      });
      break;
    case 7: // function,函数类型，函数名，参数
      params.stepDom = "{}";
      paramStepValue = JSON.stringify({
        isFunPreDefined,
        funName,
        funParams,
        funValue,
      });
      break;
    case 8: // setDate,只读数据
      paramStepValue = JSON.stringify({ readOnly: true, stepValue });
      break;
    case 9: {
      // 神兵接口处理数据
      params.stepDom = "";
      const target = stepDataSourceOpts.value.find(
        (item: any) => item.id === stepDataSource
      );
      paramStepValue = JSON.stringify({
        api: target.varValue,
        stepId: stepDataSource,
        method: target.method, // 请求方式
        field: target.field, // 接口返回数据中的取值字段名。例如：字段名 field 的值为 msg，则取接口返回值 res.data 中的 msg 字段
        requestBody: target.requestBody, // 请求体
        timeout: target.estimatedTime,
        header: {
          contentType: target.contentType,
        },
      });
      break;
    }
    default:
  }
  return { ...params, stepValue: paramStepValue };
}
async function buildCaseStep() {
  try {
    detailLoading.value = true;
    await createCaseStep(makeStepParams());
    detailLoading.value = false;
    ElMessage.success("添加成功");
    stepStore.setActiveStep({ ...InitStepObj });
    stepStore.doFreshStepTime();
    stepStore.setActiveCurrentUrl(stepStore.iframeCurrentUrl);
  } catch (error) {
    detailLoading.value = false;
    ElMessage.error("添加失败，请重试");
    console.log(error);
  }
}
async function editCaseStep() {
  try {
    detailLoading.value = true;
    await updateCaseStep({
      caseId: Number(route.query.caseId),
      ...makeStepParams(),
    });
    detailLoading.value = false;
    ElMessage.success("修改成功");
    stepStore.doFreshStepTime();
    stepStore.setActiveStep({ ...InitStepObj });
  } catch (error) {
    detailLoading.value = false;
    ElMessage.error("修改失败，请重试");
    console.log(error);
  }
}
async function onSubmit(formEl: FormInstance | undefined) {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      if (stepModel.value.id) {
        editCaseStep();
      } else {
        buildCaseStep();
      }
    }
  });
}
async function testPreview() {
  if (!window.electron) return;
  const data = await queryByCaseIdForDebug(Number(route.query.caseId));
  window.electron.sendTestCaseData(data);
}
defineExpose({
  resetForm,
});
</script>
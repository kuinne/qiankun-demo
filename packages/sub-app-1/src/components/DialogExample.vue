<template>
  <div class="dialog-example">
    <el-button type="primary" @click="dialogVisible = true">打开弹窗</el-button>

    <el-dialog
      v-model="dialogVisible"
      title="子应用1弹窗示例"
      width="30%"
      :before-close="handleClose"
    >
      <div class="dialog-content">
        <p class="dialog-content-text">
          这是子应用1中的弹窗示例，使用了Element Plus组件库。
        </p>
        <el-form :model="form" label-width="80px">
          <el-form-item label="姓名">
            <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="地区">
            <el-select
              v-model="form.region"
              placeholder="请选择地区"
              style="width: 100%"
            >
              <el-option label="北京" value="beijing"></el-option>
              <el-option label="上海" value="shanghai"></el-option>
              <el-option label="广州" value="guangzhou"></el-option>
              <el-option label="深圳" value="shenzhen"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker
              v-model="form.date"
              type="date"
              placeholder="选择日期"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="form.desc"
              type="textarea"
              placeholder="请输入备注信息"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  ElMessage,
  ElMessageBox,
  ElDialog,
  ElForm,
  ElFormItem,
  ElButton,
  ElInput,
  ElSelect,
  ElOption,
  ElDatePicker,
} from 'element-plus'

const dialogVisible = ref(false)
const form = ref({
  name: '',
  region: '',
  date: '',
  desc: '',
})

const handleClose = (done: () => void) => {
  ElMessageBox.confirm('确认关闭弹窗吗？未保存的数据将丢失。')
    .then(() => {
      done()
    })
    .catch(() => {
      // 取消关闭
    })
}

const submitForm = () => {
  ElMessage({
    type: 'success',
    message: '表单提交成功！',
  })
  dialogVisible.value = false
}
</script>

<style scoped>
.dialog-example {
  margin: 20px 0;
}

.dialog-content {
  margin-bottom: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.dialog-content-text {
  color: red;
}
</style>

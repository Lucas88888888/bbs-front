<script setup>
const props = defineProps({
  show: {
    tpye: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: "标题",
  },
  showClose: {
    tpye: Boolean,
    default: true,
  },
  width: {
    tpye: String,
    default: "30%",
  },
  top: {
    tpye: String,
    default: "30px",
  },
  buttons: {
    type: Array,
  },
  showCancel: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["close"]);
const close = () => {
  emit("close");
};
</script>

<template>
  <div>
    <el-dialog
      :model-value="show"
      :show-close="showClose"
      :title="title"
      :draggable="true"
      :close-on-click-modal="false"
      width="30%"
      class="cust-dialog"
      :width="width"
      :top="top"
      @close="close"
    >
      <div class="dialog-body">
        <!-- 这是对话框的主内容区 -->
        <slot></slot>
      </div>
      <template v-if="(buttons && buttons.length > 0) || showCancel">
        <div class="dialog-footer">
          <el-button link @click="close" v-if="showCancel">取消</el-button>
          <el-button
            v-for="btn in buttons"
            :type="btn.type || 'primary'"
            @click="btn.click"
          >
            {{ btn.text }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss">
.cust-dialog {
  margin-bottom: 10px;
  .el-dialog__body {
    padding: 0;
  }
  .dialog-body {
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    padding: 15px;
    min-height: 100px;
    max-height: calc(100vh - 250px);
    overflow: auto;
  }

  .dialog-footer {
    text-align: right;
    padding: 10px 20px;
  }
}
</style>

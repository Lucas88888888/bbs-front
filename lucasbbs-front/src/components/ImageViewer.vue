<script setup>
import { ref } from "vue";
const props = defineProps({
  imageList: {
    type: Array,
  },
});

const previewImgIndex = ref(null);

const show = (index) => {
  stopScroll();
  previewImgIndex.value = index;
};
defineExpose({
  show,
});
const closeImgViewer = () => {
  startScroll();
  previewImgIndex.value = null;
};

const stopScroll = () => {
  document.body.style.overflowY = "hidden";
};

const startScroll = () => {
  document.body.style.overflowY = "scroll";
};
</script>

<template>
  <div class="imge-viewer">
    <el-image-viewer
      :initial-index="previewImgIndex"
      hide-on-click-modal
      :url-list="imageList"
      @close="closeImgViewer"
      v-if="previewImgIndex != null"
    >
    </el-image-viewer>
  </div>
</template>

<style lang="scss" scoped>
.image-viewer {
  .el-image-viewer__mask {
    opacity: 0.7;
  }
}
</style>

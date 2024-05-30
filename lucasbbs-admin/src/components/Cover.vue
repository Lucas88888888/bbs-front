<script setup>
import { getCurrentInstance } from "vue";

const default_cover = new URL("@/assets/default_cover.jpg", import.meta.url)
  .href;
const { proxy } = getCurrentInstance();
const props = defineProps({
  cover: {
    type: String,
  },
  width: {
    type: Number,
    default: 50,
  },
});
</script>

<template>
  <div class="cover" :style="{ width: width + 'px', height: width + 'px' }">
    <el-image
      v-if="cover"
      :style="{ width: width + 'px', height: width + 'px' }"
      fit="scale-down"
      loading="lazy"
      :src="cover ? proxy.globalInfo.api.getImage + cover : default_cover"
    >
    </el-image>
    <img
      src="../assets/default_cover.jpg"
      v-else
      :style="{ width: width + 'px', height: width + 'px' }"
    />
  </div>
</template>

<style lang="scss" scoped>
.cover {
  background: #ddd;
  border-radius: 5px;
  overflow: hidden;
}
</style>

<script setup>
import { ref, reactive, getCurrentInstance } from "vue";
import { useRoute, useRouter } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const props = defineProps({
  imageUrlPrefix: {
    type: String,
  },
  modelValue: {
    type: Object,
    default: null,
  },
});

const localFile = ref(null);
const emit = defineEmits();
const uploadImage = async (file) => {
  file = file.file;
  let img = new FileReader();
  img.readAsDataURL(file);
  img.onload = ({ target }) => {
    localFile.value = target.result;
  };
  emit("update:modelValue", file);
};
</script>

<template>
  <div class="cover-upload">
    <el-upload
      name="file"
      :show-file-list="false"
      accept=".png,.PNG,.jpg,.JPG,.jpeg,.JPEG,.gif,.GIF,.bmp,.BMP"
      :multiple="false"
      :http-request="uploadImage"
    >
      <div class="cover-upload-btn">
        <template v-if="localFile">
          <img :src="localFile" />
        </template>
        <template v-else>
          <img
            :src="
              (imageUrlPrefix
                ? imageUrlPrefix
                : proxy.globalInfo.api.getImage) + modelValue.imageUrl
            "
            v-if="modelValue && modelValue.imageUrl"
          />
          <span class="iconfont icon-add" v-else></span>
        </template>
      </div>
    </el-upload>
  </div>
</template>

<style lang="scss" scoped>
.cover-upload {
  .cover-upload-btn {
    background: #fbfbfb;
    width: 150px;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    .iconfont {
      font-size: 50px;
      color: #ddd;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
}
</style>

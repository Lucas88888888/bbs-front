<script setup>
import { getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();

const props = defineProps({
  userId: {
    type: String,
  },
  width: {
    type: Number,
    default: 6,
  },
  addLink: {
    type: Boolean,
    default: true,
  },
});

const goToUcenter = () => {
  if (props.addLink) {
    router.push("/user/" + proxy.userId);
  }
};
</script>

<template>
  <div
    class="avatar"
    :style="{
      width: width + 'rem',
      height: width + 'rem',
      borderRadius: '50%,',
    }"
  >
    <img
      v-if="userId"
      :style="{
        width: width + 'rem',
        height: width + 'rem',
        borderRadius: '50%',
      }"
      :src="proxy.globalInfo.api.avatarUrl + userId"
      @click="goToUcenter"
    />
  </div>
</template>

<style lang="scss" scoped></style>

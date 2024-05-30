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
      width: width + 'px',
      height: width + 'px',
      borderRadius: '50%,',
    }"
  >
    <img
      v-if="userId"
      :style="{
        width: width + 'px',
        height: width + 'px',
        borderRadius: '50%',
      }"
      :src="proxy.globalInfo.api.avatarUrl + userId"
      @click="goToUcenter"
    />
    <div v-else class="no-login" :style="{ fontSize: width + 8 + 'px' }">
      未登录
    </div>
  </div>
</template>

<style lang="scss" scoped>
.avatar {
  cursor: pointer;
  display: flex;
  background: #f0f0f0;
  align-items: center;
  overflow: hidden;
  border-radius: 50%;
  .no-login {
    width: 100%;
    text-align: center;
    font-size: 13px;
    // border-radius: 50%;
  }
}
</style>

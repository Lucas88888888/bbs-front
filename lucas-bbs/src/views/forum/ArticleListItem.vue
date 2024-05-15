<script setup>
import Avatar from "@/components/Avatar.vue";
import { ref, reactive, getCurrentInstance } from "vue";
import { useRoute, useRouter } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const props = defineProps({
  data: {
    type: Object,
  },
});
</script>

<template>
  <div class="article-tiem">
    <div class="article-item-inner">
      <div class="article-body">
        <div class="user-info">
          <Avatar :userId="data.userId"></Avatar>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

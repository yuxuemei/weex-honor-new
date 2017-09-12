<template>
  <div class="wrapper">
    <router-view></router-view>
  </div>
</template>
<script>
  import router from './router.js'
  export default {
    data: {
    },
    created:function(){
      router.push('/');
    }
  }
</script>

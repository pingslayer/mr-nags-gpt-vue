<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const isLogin = computed(() => route.name === 'login');

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
});

const handleSubmit = async () => {
  let success = false;
  if (isLogin.value) {
    success = await auth.login(form.value.email, form.value.password);
  } else {
    success = await auth.register(form.value);
  }

  if (success) {
    router.push('/');
  }
};
</script>

<template>
  <div class="auth-container d-flex align-items-center justify-content-center min-vh-100">
    <div class="glass-card p-4 shadow-lg" style="width: 100%; max-width: 400px;">
      <div class="text-center mb-3">
        <h1 class="h3 fw-bold mb-0">
          <span style="color: var(--mrnags-saffron)">Mr.</span>
          <span style="color: var(--mrnags-gold)"> Nags</span>
        </h1>
        <p class="text-info small mb-0" style="font-size: 0.75rem;">Official Fan-Made AI Chat</p>
      </div>

      <h2 class="h5 mb-3 text-center text-white">{{ isLogin ? 'Namaste! Welcome Back' : 'Join the Fun' }}</h2>

      <div v-if="auth.error" class="alert alert-danger py-2 small mb-3" role="alert" style="font-size: 0.8rem;">
        {{ auth.error }}
      </div>

      <form @submit.prevent="handleSubmit">
        <div v-if="!isLogin" class="mb-2">
          <label class="form-label small text-light opacity-75 mb-1">Full Name</label>
          <input 
            v-model="form.name" 
            type="text" 
            class="form-control chat-input form-control-sm" 
            placeholder="Your name" 
            required
          >
        </div>

        <div class="mb-2">
          <label class="form-label small text-light opacity-75 mb-1">Email Address</label>
          <input 
            v-model="form.email" 
            type="email" 
            class="form-control chat-input form-control-sm" 
            placeholder="name@example.com" 
            required
          >
        </div>

        <div class="mb-2">
          <label class="form-label small text-light opacity-75 mb-1">Password</label>
          <input 
            v-model="form.password" 
            type="password" 
            class="form-control chat-input form-control-sm" 
            placeholder="••••••••" 
            required
          >
        </div>

        <div v-if="!isLogin" class="mb-3">
          <label class="form-label small text-light opacity-75 mb-1">Confirm Password</label>
          <input 
            v-model="form.password_confirmation" 
            type="password" 
            class="form-control chat-input form-control-sm" 
            placeholder="••••••••" 
            required
          >
        </div>

        <button 
          type="submit" 
          class="btn btn-nags-primary w-100 py-2 mb-2 mt-2"
          :disabled="auth.loading"
        >
          <span v-if="auth.loading" class="spinner-border spinner-border-sm me-2"></span>
          {{ isLogin ? 'Enter The Shed' : 'Sign Up Now' }}
        </button>

        <div class="text-center" style="font-size: 0.8rem;">
          <template v-if="isLogin">
            <span class="text-light opacity-75">Don't have an account? </span>
            <router-link to="/register" class="text-warning text-decoration-none fw-bold">Register</router-link>
          </template>
          <template v-else>
            <span class="text-light opacity-75">Already have an account? </span>
            <router-link to="/login" class="text-warning text-decoration-none fw-bold">Login</router-link>
          </template>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  background: radial-gradient(circle at center, #1a1a1a 0%, #0a0a0a 100%);
}
</style>

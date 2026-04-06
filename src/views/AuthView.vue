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
    <div class="glass-card p-5 shadow-lg" style="width: 100%; max-width: 450px;">
      <div class="text-center mb-4">
        <h1 class="display-6 fw-bold mb-0">
          <span style="color: var(--mrnags-saffron)">Mr.</span>
          <span style="color: var(--mrnags-gold)"> Nags</span>
        </h1>
        <p class="text-muted small">Official Fan-Made AI Chat</p>
      </div>

      <h2 class="h4 mb-4 text-center">{{ isLogin ? 'Namaste! Welcome Back' : 'Join the Fun' }}</h2>

      <div v-if="auth.error" class="alert alert-danger py-2 small mb-4" role="alert">
        {{ auth.error }}
      </div>

      <form @submit.prevent="handleSubmit">
        <div v-if="!isLogin" class="mb-3">
          <label class="form-label small text-muted">Full Name</label>
          <input 
            v-model="form.name" 
            type="text" 
            class="form-control chat-input" 
            placeholder="Your name" 
            required
          >
        </div>

        <div class="mb-3">
          <label class="form-label small text-muted">Email Address</label>
          <input 
            v-model="form.email" 
            type="email" 
            class="form-control chat-input" 
            placeholder="name@example.com" 
            required
          >
        </div>

        <div class="mb-3">
          <label class="form-label small text-muted">Password</label>
          <input 
            v-model="form.password" 
            type="password" 
            class="form-control chat-input" 
            placeholder="••••••••" 
            required
          >
        </div>

        <div v-if="!isLogin" class="mb-4">
          <label class="form-label small text-muted">Confirm Password</label>
          <input 
            v-model="form.password_confirmation" 
            type="password" 
            class="form-control chat-input" 
            placeholder="••••••••" 
            required
          >
        </div>

        <button 
          type="submit" 
          class="btn btn-nags-primary w-100 py-2 mb-3"
          :disabled="auth.loading"
        >
          <span v-if="auth.loading" class="spinner-border spinner-border-sm me-2"></span>
          {{ isLogin ? 'Enter The Shed' : 'Sign Up Now' }}
        </button>

        <div class="text-center small">
          <template v-if="isLogin">
            <span class="text-muted">Don't have an account? </span>
            <router-link to="/register" class="text-info text-decoration-none fw-bold">Register</router-link>
          </template>
          <template v-else>
            <span class="text-muted">Already have an account? </span>
            <router-link to="/login" class="text-info text-decoration-none fw-bold">Login</router-link>
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

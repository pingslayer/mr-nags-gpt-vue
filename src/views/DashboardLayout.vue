<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useChatStore } from '../stores/chat';
import Sidebar from '../components/Sidebar.vue';
import ChatWindow from '../components/ChatWindow.vue';

const auth = useAuthStore();
const chat = useChatStore();

onMounted(() => {
  chat.fetchConversations();
});
</script>

<template>
  <div class="container-fluid p-0 d-flex vh-100 overflow-hidden">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <main class="flex-grow-1 d-flex flex-column h-100 position-relative">
      <!-- Header -->
      <header class="p-3 d-flex align-items-center justify-content-between glass-card border-0 rounded-0 border-bottom">
        <div class="d-flex align-items-center">
          <button class="btn btn-link text-white d-md-none me-2 p-0">
            <i class="bi bi-list fs-3"></i>
          </button>
          <div class="ms-1">
            <h5 class="mb-0 fw-bold">
              <span style="color: var(--mrnags-saffron)">Mr.</span>
              <span style="color: var(--mrnags-gold)"> Nags</span>
            </h5>
            <span class="badge rounded-pill bg-success p-1 pe-2 small fw-normal" style="font-size: 10px;">
              <span class="d-inline-block bg-white rounded-circle me-1" style="width: 5px; height: 5px;"></span>
              Online
            </span>
          </div>
        </div>

        <div class="dropdown">
          <button 
            class="btn btn-nags-primary btn-sm rounded-pill px-3" 
            type="button" 
            data-bs-toggle="dropdown"
          >
            {{ auth.user?.name || 'User' }}
          </button>
          <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end glass-card shadow">
            <li><a class="dropdown-item py-2" href="#" @click.prevent="auth.logout()"><i class="bi bi-box-arrow-right me-2"></i>Logout</a></li>
          </ul>
        </div>
      </header>

      <!-- Chat Area -->
      <ChatWindow />
    </main>
  </div>
</template>

<style scoped>
header {
  height: 70px;
  background: var(--mrnags-dark);
}
</style>

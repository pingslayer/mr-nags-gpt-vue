<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useChatStore } from '../stores/chat';
import Sidebar from '../components/Sidebar.vue';
import ChatWindow from '../components/ChatWindow.vue';

const auth = useAuthStore();
const chat = useChatStore();
const router = useRouter();

onMounted(() => {
  chat.fetchConversations();
});

const handleLogout = async () => {
  console.log('Logout button clicked, initiating logout...');
  await auth.logout();
  console.log('Client state cleared, navigating to /login');
  router.push('/login');
};
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

        <div class="d-flex align-items-center gap-3">
          <span class="text-light small d-none d-lg-inline opacity-75">
            {{ auth.user?.email }}
          </span>
          <button 
            class="btn btn-danger btn-sm px-3 fw-bold" 
            @click="handleLogout"
          >
            Logout
          </button>
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

.dropdown-item:hover {
  background: rgba(220, 53, 69, 0.1);
  color: #ff4d4d !important;
}

.hover-bg-danger-soft:hover {
  background: rgba(220, 53, 69, 0.1) !important;
}
</style>

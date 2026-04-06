<script setup>
import { useChatStore } from '../stores/chat';

const chat = useChatStore();

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};
</script>

<template>
  <aside class="sidebar-glass d-none d-md-flex flex-column h-100" style="width: 280px;">
    <div class="p-4 border-bottom border-light border-opacity-10">
      <button 
        class="btn btn-nags-primary w-100 py-2 d-flex align-items-center justify-content-center"
        @click="chat.startNewChat()"
      >
        <i class="bi bi-plus-lg me-2"></i>
        New Chat
      </button>
    </div>

    <div class="flex-grow-1 overflow-auto p-3">
      <p class="text-muted small text-uppercase fw-bold mb-3 px-2">History</p>
      
      <div v-if="chat.loading && !chat.conversations.length" class="text-center py-4">
        <div class="spinner-border spinner-border-sm text-warning" role="status"></div>
      </div>

      <div v-else-if="!chat.conversations.length" class="text-center py-4">
        <p class="text-muted small">No chats yet!</p>
      </div>

      <div v-else>
        <div 
          v-for="conv in chat.conversations" 
          :key="conv.id"
          class="nav-link-nags d-flex align-items-center justify-content-between cursor-pointer"
          :class="{ 'active': chat.activeConversationId === conv.id }"
          @click="chat.fetchConversation(conv.id)"
        >
          <div class="text-truncate flex-grow-1 me-2">
            <i class="bi bi-chat-left-dots me-2"></i>
            {{ conv.title || 'Ongoing Chat' }}
          </div>
          <div class="d-flex align-items-center">
            <span class="small opacity-50 me-2" style="font-size: 0.7rem;">
              {{ formatDate(conv.updated_at) }}
            </span>
            <button 
              class="btn btn-link p-0 text-danger opacity-0 hover-opacity-100"
              @click.stop="chat.deleteConversation(conv.id)"
            >
              <i class="bi bi-trash3 small"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="p-4 bg-dark bg-opacity-25 mt-auto border-top border-light border-opacity-10">
      <div class="d-flex align-items-center glass-card p-2 border-0">
        <div class="flex-grow-1 ms-2">
          <p class="mb-0 small fw-bold">PRO Member</p>
          <p class="mb-0 text-muted" style="font-size: 10px;">Unlimited Dosa Access</p>
        </div>
        <i class="bi bi-shield-check text-warning fs-5"></i>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.hover-opacity-100 {
  transition: opacity 0.2s ease;
}

.nav-link-nags:hover .hover-opacity-100 {
  opacity: 1 !important;
}
</style>

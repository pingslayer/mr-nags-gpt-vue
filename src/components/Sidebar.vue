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
      <p class="text-light small text-uppercase fw-bold mb-3 px-2 opacity-50">History</p>
      
      <div v-if="chat.loading && !chat.conversations.length" class="text-center py-4">
        <div class="spinner-border spinner-border-sm text-warning" role="status"></div>
      </div>

      <div v-else-if="!chat.conversations.length" class="text-center py-4">
        <p class="text-light small opacity-50">No chats yet!</p>
      </div>

      <div v-else>
        <div 
          v-for="conv in chat.conversations" 
          :key="conv.id"
          class="nav-link-nags d-flex align-items-center cursor-pointer mb-1"
          :class="{ 'active': chat.activeConversationId === conv.id }"
          @click="chat.fetchConversation(conv.id)"
        >
          <i class="bi bi-chat-left-text me-3 flex-shrink-0 opacity-100" style="color: var(--mrnags-saffron)"></i>
          
          <div class="flex-grow-1 overflow-hidden min-width-0">
            <div class="text-truncate fw-medium" style="font-size: 0.85rem;">
              {{ conv.title || 'Ongoing Chat' }}
            </div>
          </div>

          <div class="ms-2 flex-shrink-0 position-relative metadata-area" style="min-width: 45px; text-align: right;">
            <span class="small opacity-75 date-label" style="font-size: 0.65rem;">
              {{ formatDate(conv.updated_at) }}
            </span>
            <button 
              class="btn btn-link p-0 text-danger delete-btn position-absolute top-50 start-50 translate-middle"
              @click.stop="chat.deleteConversation(conv.id)"
            >
              <i class="bi bi-trash3-fill"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>

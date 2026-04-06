<script setup>
import { ref, onUpdated, nextTick } from 'vue';
import { useChatStore } from '../stores/chat';

const chat = useChatStore();
const messageInput = ref('');
const scrollContainer = ref(null);

const scrollToBottom = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
  }
};

onUpdated(() => {
  nextTick(() => {
    scrollToBottom();
  });
});

const handleSend = async () => {
  if (!messageInput.value.trim() || chat.sending) return;
  
  const msg = messageInput.value;
  messageInput.value = '';
  await chat.sendMessage(msg);
};

const handleKeydown = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
};
</script>

<template>
  <div class="flex-grow-1 d-flex flex-column overflow-hidden position-relative h-100">
    <!-- Empty State -->
    <div 
      v-if="!chat.activeConversationId && !chat.messages.length" 
      class="flex-grow-1 d-flex flex-column align-items-center justify-content-center p-4 text-center"
    >
      <div 
        class="bg-nags-saffron rounded-circle mb-4 d-flex align-items-center justify-content-center shadow-lg" 
        style="width: 120px; height: 120px; background: linear-gradient(var(--mrnags-saffron), var(--mrnags-gold))"
      >
        <span class="display-1 fw-bold text-dark">N</span>
      </div>
      <h2 class="fw-bold mb-2">Namaste! Mr. Nags here!</h2>
      <p class="text-muted col-md-6 mb-4">
        Don't ask too many questions, ok? I am very busy. 
        But since you are here, tell me what you want to talk about?
      </p>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-warning rounded-pill px-4 btn-sm" @click="messageInput = 'Who is King Kohli?'">King Kohli?</button>
        <button class="btn btn-outline-warning rounded-pill px-4 btn-sm" @click="messageInput = 'Best Dosa in Bangalore?'">Best Dosa?</button>
        <button class="btn btn-outline-warning rounded-pill px-4 btn-sm" @click="messageInput = 'Why RCB will win?'">RCB Win?</button>
      </div>
    </div>

    <!-- Messages Container -->
    <div 
      v-else 
      ref="scrollContainer"
      class="flex-grow-1 overflow-auto p-4 d-flex flex-column"
    >
      <div 
        v-for="msg in chat.messages" 
        :key="msg.id"
        class="message-bubble"
        :class="msg.role === 'user' ? 'message-user' : 'message-assistant'"
      >
        <div class="fw-bold small mb-1 opacity-75">
          {{ msg.role === 'user' ? 'You' : 'Mr. Nags' }}
        </div>
        <div class="content whitespace-pre-wrap">{{ msg.content }}</div>
      </div>

      <!-- Thinking Animation -->
      <div v-if="chat.sending" class="message-bubble message-assistant">
        <div class="fw-bold small mb-1 opacity-75">Mr. Nags</div>
        <div class="thinking-pulse">
          <div class="thinking-dot"></div>
          <div class="thinking-dot"></div>
          <div class="thinking-dot"></div>
        </div>
      </div>
    </div>

    <!-- Input Bar -->
    <div class="chat-input-container">
      <div class="container-fluid max-width-800">
        <div class="position-relative">
          <textarea 
            v-model="messageInput"
            @keydown="handleKeydown"
            class="form-control chat-input w-100 pr-5" 
            placeholder="Type your message here..." 
            rows="1"
            :disabled="chat.loading"
          ></textarea>
          <button 
            @click="handleSend"
            class="btn btn-nags-primary rounded-circle position-absolute end-0 top-50 translate-middle-y me-2 p-0 d-flex align-items-center justify-content-center"
            style="width: 40px; height: 40px;"
            :disabled="!messageInput.trim() || chat.sending"
          >
            <i class="bi bi-send-fill"></i>
          </button>
        </div>
        <div class="text-center mt-2">
          <span class="text-muted" style="font-size: 10px;">
            Press Enter to send, Shift + Enter for new line.
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.whitespace-pre-wrap {
  white-space: pre-wrap;
}

.max-width-800 {
  max-width: 800px;
  margin: 0 auto;
}

textarea {
  min-height: 50px;
  max-height: 200px;
  border-radius: 25px !important;
  padding-right: 50px !important;
}
</style>

import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './auth';

const BASE_URL = 'http://mrnagsgpt.local/api';

export const useChatStore = defineStore('chat', {
  state: () => ({
    conversations: [],
    messages: [],
    activeConversationId: null,
    loading: false,
    sending: false,
    error: null,
  }),

  actions: {
    getAxios() {
      const auth = useAuthStore();
      return axios.create({
        baseURL: BASE_URL,
        headers: {
          Authorization: `Bearer ${auth.token}`,
          Accept: 'application/json',
        },
      });
    },

    async fetchConversations() {
      this.loading = true;
      try {
        const response = await this.getAxios().get('/conversations');
        this.conversations = response.data.data;
      } catch (err) {
        console.error('Failed to fetch conversations', err);
      } finally {
        this.loading = false;
      }
    },

    async fetchConversation(id) {
      this.loading = true;
      this.activeConversationId = id;
      try {
        const response = await this.getAxios().get(`/conversations/${id}`);
        this.messages = response.data.data.messages;
      } catch (err) {
        console.error('Failed to fetch conversation history', err);
      } finally {
        this.loading = false;
      }
    },

    async sendMessage(message) {
      if (!message.trim()) return;

      this.sending = true;
      // Optimistic update
      const userMessage = {
        id: Date.now(),
        role: 'user',
        content: message,
      };
      this.messages.push(userMessage);

      try {
        const response = await this.getAxios().post('/chat', {
          message,
          conversation_id: this.activeConversationId,
        });

        // Add assistant response
        this.messages.push({
          id: response.data.id || Date.now() + 1,
          role: 'assistant',
          content: response.data.message,
        });

        // Capture conversation_id if it's a new chat
        if (!this.activeConversationId) {
          this.activeConversationId = response.data.conversation_id;
          await this.fetchConversations(); // Refresh list to show new chat
        }
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to send message';
        // Remove the user message if it failed? Or mark as error
        console.error('Failed to send message', err);
      } finally {
        this.sending = false;
      }
    },

    async deleteConversation(id) {
      try {
        await this.getAxios().delete(`/conversations/${id}`);
        this.conversations = this.conversations.filter(c => c.id !== id);
        if (this.activeConversationId === id) {
          this.activeConversationId = null;
          this.messages = [];
        }
      } catch (err) {
        console.error('Failed to delete conversation', err);
      }
    },

    startNewChat() {
      this.activeConversationId = null;
      this.messages = [];
    }
  }
});

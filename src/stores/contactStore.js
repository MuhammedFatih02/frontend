import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './authStore';

export const useContactStore = defineStore('contact', {
    state: () => ({
        contacts: []
    }),

    actions: {
        async fetchContacts() {
            try {
                const response = await axios.get('https://backend-1jjd.onrender.com/api/contacts');
                this.contacts = response.data;
            } catch (error) {
                console.error('Mesajlar yüklenirken bir hata oluştu:', error);
                throw error;
            }
        },

        async createContact(contactData) {
            try {
                const response = await axios.post('https://backend-1jjd.onrender.com/api/contacts', contactData);
                this.contacts.unshift(response.data);
                return response.data;
            } catch (error) {
                console.error('Mesaj gönderilirken bir hata oluştu:', error);
                throw error;
            }
        },

        async markAsRead(id) {
            try {
                const response = await axios.put(`https://backend-1jjd.onrender.com/api/contacts/${id}`);
                const index = this.contacts.findIndex(c => c._id === response.data._id);
                if (index !== -1) {
                    this.contacts[index] = response.data;
                }
            } catch (error) {
                console.error('Mesaj durumu güncellenirken bir hata oluştu:', error);
                throw error;
            }
        },

        async deleteContact(id) {
            try {
                await axios.delete(`https://backend-1jjd.onrender.com/api/contacts/${id}`);
                this.contacts = this.contacts.filter(c => c._id !== id);
            } catch (error) {
                console.error('Mesaj silinirken bir hata oluştu:', error);
                throw error;
            }
        }
    },

    getters: {
        getContacts: (state) => state.contacts,
        isAdmin: () => {
            const authStore = useAuthStore();
            return authStore.isAdmin;
        },
        unreadMessagesCount: (state) => {
            return state.contacts.filter(contact => contact.status === 'unread').length;
        }
    }
});
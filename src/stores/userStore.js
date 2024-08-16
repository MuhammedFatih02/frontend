import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        users: [],
        currentUser: null,
        loading: false,
        error: null,
        form: {
            username: '',
            email: '',
            password: '',
            admin: false,
        },
        pagination: {
            currentPage: 1,
            totalPages: 1,
            totalUsers: 0,
        },
        search: '',
    }),
    actions: {
        async fetchAllUsers(page = 1, limit = 25) {
            this.loading = true;
            this.error = null;
            try {
                const response = await fetch(`https://backend-1jjd.onrender.com/api/users?page=${page}&limit=${limit}&search=${this.search}`);
                if (!response.ok) {
                    throw new Error('Kullanıcılar getirilemedi');
                }
                const data = await response.json();
                this.users = data.users;
                this.pagination = {
                    currentPage: data.currentPage,
                    totalPages: data.totalPages,
                    totalUsers: data.totalUsers,
                };
            } catch (error) {
                this.error = error.message;
            } finally {
                this.loading = false;
            }
        },
        async fetchUserById(userId) {
            this.loading = true;
            this.error = null;
            try {
                const response = await fetch(`https://backend-1jjd.onrender.com/api/users/${userId}`);
                if (!response.ok) {
                    throw new Error('Kullanıcı getirilemedi');
                }
                this.currentUser = await response.json();
            } catch (error) {
                this.error = error.message;
            } finally {
                this.loading = false;
            }
        },
        async updateUser(updatedUser, userId) {
            this.loading = true;
            this.error = null;
            try {
                const response = await fetch(`https://backend-1jjd.onrender.com/api/users/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedUser),
                });
                if (!response.ok) {
                    throw new Error('Kullanıcı güncellenemedi');
                }
                const updatedData = await response.json();
                this.currentUser = updatedData.user;
                // Kullanıcı listesini güncelle
                const index = this.users.findIndex(user => user._id === userId);
                if (index !== -1) {
                    this.users[index] = updatedData.user;
                }
            } catch (error) {
                this.error = error.message;
            } finally {
                this.loading = false;
            }
        },
        updateForm(data) {
            this.form = { ...this.form, ...data };
        },
        setSearch(searchTerm) {
            this.search = searchTerm;
        },
    },
    getters: {
        getFormData: (state) => state.form,
    },
});
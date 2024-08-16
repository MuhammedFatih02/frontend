<template>
  <div v-if="authStore.isAdmin" class="admin-contact-management">
    <h1 class="fw-bold fs-1">Admin İletişim Yönetimi</h1>
    <div class="col-md-6 text-md-end d-flex justify-content-start">
      <router-link to="/admin/" class="btn btn-outline-primary">
        <i class="bi bi-house-door"></i> Ana Sayfa
      </router-link>
    </div>

    <div v-if="contactStore.getContacts.length > 0">
      <table class="responsive-table">
        <thead>
          <tr>
            <th>İsim</th>
            <th>E-posta</th>
            <th>Telefon</th>
            <th>Mesaj</th>
            <th>Tarih</th>
            <th>Durum</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="contact in contactStore.getContacts"
            :key="contact._id"
            :class="{ unread: contact.status === 'unread' }"
          >
            <td>{{ contact.name }}</td>
            <td>{{ contact.email }}</td>
            <td>{{ contact.phone }}</td>
            <td>{{ contact.message }}</td>
            <td>{{ new Date(contact.createdAt).toLocaleString() }}</td>
            <td>{{ contact.status === "unread" ? "Okunmadı" : "Okundu" }}</td>
            <td>
              <button
                v-if="contact.status === 'unread'"
                class="mark-as-read-btn"
                @click="markAsRead(contact._id)"
              >
                Okundu olarak işaretle
              </button>
              <button class="delete-btn" @click="deleteContact(contact._id)">
                Sil
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="no-contacts">
      <p>Henüz iletişim mesajı bulunmamaktadır.</p>
    </div>
  </div>
  <div v-else class="access-denied">
    <h2>Erişim Reddedildi</h2>
    <p>
      Bu sayfayı görüntülemek için admin yetkisine sahip olmanız gerekmektedir.
    </p>
  </div>
</template>
  
  <script>
import { onMounted } from "vue";
import { useContactStore } from "@/stores/contactStore.js";
import { useAuthStore } from "@/stores/authStore";

export default {
  setup() {
    const contactStore = useContactStore();
    const authStore = useAuthStore();

    onMounted(() => {
      if (authStore.isAdmin) {
        contactStore.fetchContacts();
      }
    });

    const markAsRead = async (id) => {
      try {
        await contactStore.markAsRead(id);
      } catch (error) {
        alert("Mesaj durumu güncellenirken bir hata oluştu.");
      }
    };

    const deleteContact = async (id) => {
      if (confirm("Bu mesajı silmek istediğinizden emin misiniz?")) {
        try {
          await contactStore.deleteContact(id);
        } catch (error) {
          alert("Mesaj silinirken bir hata oluştu.");
        }
      }
    };

    return {
      contactStore,
      authStore,
      markAsRead,
      deleteContact,
    };
  },
};
</script>
  
  <style scoped>
.admin-contact-management {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.responsive-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.responsive-table th,
.responsive-table td {
  padding: 12px 15px;
  border: 1px solid #ddd;
}

.responsive-table th {
  background-color: #007bff;
  color: #ffffff;
  text-transform: uppercase;
}

.responsive-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.unread {
  font-weight: bold;
  background-color: #f0f0f0;
}

button {
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.mark-as-read-btn {
  background-color: #28a745;
  color: white;
}

.mark-as-read-btn:hover {
  background-color: #218838;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.delete-btn:hover {
  background-color: #c82333;
}

.no-contacts,
.access-denied {
  text-align: center;
  color: #666;
}

@media (max-width: 768px) {
  .responsive-table thead {
    display: none;
  }

  .responsive-table tr {
    margin-bottom: 10px;
    display: block;
    border: 1px solid #ddd;
  }

  .responsive-table td {
    display: block;
    text-align: right;
    font-size: 14px;
    border-bottom: 1px solid #ddd;
  }

  .responsive-table td::before {
    content: attr(data-label);
    float: left;
    font-weight: bold;
    text-transform: uppercase;
  }

  .responsive-table td:last-child {
    border-bottom: 0;
  }
}
</style>
  
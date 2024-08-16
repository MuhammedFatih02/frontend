<template>
  <div class="contact-form-container">
    <h2 class="form-title">Bize Ulaşın</h2>
    <form @submit.prevent="submitForm" class="contact-form">
      <div class="form-group">
        <label for="name">Adınız</label>
        <input
          v-model="form.name"
          type="text"
          id="name"
          required
          placeholder="Adınızı giriniz"
        />
      </div>
      <div class="form-group">
        <label for="email">E-posta adresiniz</label>
        <input
          v-model="form.email"
          type="email"
          id="email"
          required
          placeholder="E-posta adresinizi giriniz"
        />
      </div>
      <div class="form-group">
        <label for="phone">Telefon numaranız</label>
        <input
          v-model="form.phone"
          type="tel"
          id="phone"
          required
          placeholder="05xxxxxxxxx"
          @input="validatePhone"
        />
        <small v-if="phoneError" class="error-message">{{ phoneError }}</small>
      </div>
      <div class="form-group">
        <label for="message">Mesajınız</label>
        <textarea
          v-model="form.message"
          id="message"
          required
          rows="4"
          placeholder="Mesajınızı buraya yazın"
        ></textarea>
      </div>
      <button type="submit" :disabled="isLoading" class="submit-button">
        <span v-if="isLoading" class="spinner"></span>
        {{ isLoading ? "Gönderiliyor..." : "Gönder" }}
      </button>
    </form>

    <div v-if="alertMessage" :class="['alert', alertClass]">
      {{ alertMessage }}
    </div>

    <div v-if="contacts.length > 0" class="previous-messages">
      <h3 @click="togglePreviousMessages" class="toggle-messages">
        {{
          showPreviousMessages
            ? "Önceki Mesajlarınızı Gizle"
            : "Önceki Mesajlarınızı Göster"
        }}
      </h3>
      <transition name="fade">
        <ul v-show="showPreviousMessages" class="message-list">
          <li
            v-for="contact in contacts"
            :key="contact._id"
            class="message-item"
          >
            <div class="message-content">
              <strong>{{ formatDate(contact.createdAt) }}</strong>
              <p>{{ contact.message.substring(0, 50) }}...</p>
            </div>
            <span
              :class="[
                'status-badge',
                contact.status === 'read' ? 'read' : 'unread',
              ]"
            >
              {{ contact.status === "read" ? "Okundu" : "Okunmadı" }}
            </span>
          </li>
        </ul>
      </transition>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import { useContactStore } from "@/stores/contactStore";

export default {
  setup() {
    const contactStore = useContactStore();
    const form = reactive({
      name: "",
      email: "",
      phone: "",
      message: "",
    });
    const isLoading = ref(false);
    const phoneError = ref("");
    const contacts = ref([]);
    const showPreviousMessages = ref(false);
    const alertMessage = ref("");
    const alertClass = ref("");

    const phoneRegex = /^0[5-9][0-9]{9}$/;

    const validatePhone = () => {
      if (!phoneRegex.test(form.phone)) {
        phoneError.value =
          "Geçerli bir Türkiye telefon numarası giriniz (05xxxxxxxxx)";
      } else {
        phoneError.value = "";
      }
    };

    const submitForm = async () => {
      if (phoneError.value) return;

      isLoading.value = true;
      try {
        await contactStore.createContact(form);
        resetForm();
        fetchContacts();
        showAlert("Mesaj başarıyla gönderildi.", "success");
      } catch (error) {
        showAlert(
          "Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.",
          "error"
        );
      } finally {
        isLoading.value = false;
      }
    };

    const resetForm = () => {
      Object.keys(form).forEach((key) => (form[key] = ""));
    };

    const fetchContacts = async () => {
      try {
        await contactStore.fetchContacts();
        contacts.value = contactStore.getContacts;
      } catch (error) {
        console.error("Mesajlar yüklenirken bir hata oluştu:", error);
      }
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString("tr-TR");
    };

    const togglePreviousMessages = () => {
      showPreviousMessages.value = !showPreviousMessages.value;
    };

    const showAlert = (message, type) => {
      alertMessage.value = message;
      alertClass.value = type;
      setTimeout(() => {
        alertMessage.value = "";
        alertClass.value = "";
      }, 3000);
    };

    onMounted(fetchContacts);

    return {
      form,
      isLoading,
      phoneError,
      contacts,
      showPreviousMessages,
      submitForm,
      validatePhone,
      formatDate,
      togglePreviousMessages,
      alertMessage,
      alertClass,
    };
  },
};
</script>

<style scoped>
.contact-form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-title {
  font-size: 2rem;
  color: #0056b3;
  margin-bottom: 1.5rem;
  text-align: center;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #495057;
}

input,
textarea {
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #0056b3;
  box-shadow: 0 0 0 2px rgba(0, 86, 179, 0.25);
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.submit-button {
  background-color: #0056b3;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover:not(:disabled) {
  background-color: #004494;
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid #ffffff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.alert {
  padding: 1rem;
  border-radius: 5px;
  margin-top: 1.5rem;
  font-weight: bold;
}

.success {
  background-color: #d4edda;
  color: #155724;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
}

.previous-messages {
  margin-top: 2rem;
}

.toggle-messages {
  cursor: pointer;
  color: #0056b3;
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.message-list {
  list-style-type: none;
  padding: 0;
}

.message-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: white;
  border-radius: 5px;
  margin-bottom: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.message-content {
  flex-grow: 1;
}

.message-content p {
  margin: 0.5rem 0 0 0;
  color: #6c757d;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: bold;
}

.read {
  background-color: #28a745;
  color: white;
}

.unread {
  background-color: #ffc107;
  color: #212529;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .contact-form-container {
    padding: 1.5rem;
  }

  .form-title {
    font-size: 1.75rem;
  }

  .submit-button {
    width: 100%;
  }
}
</style>
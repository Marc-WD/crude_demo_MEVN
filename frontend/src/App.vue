<template>
  <div class="container">
    <h1>Task Manager</h1>

    <!-- Add Item Form -->
    <form @submit.prevent="addItem" class="form-inline">
      <input v-model="newItem.name" placeholder="Name" required />
      <input v-model="newItem.description" placeholder="Description" required />
      <button type="submit" class="add-btn">Add</button>
    </form>

    <!-- Items Table -->
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item._id">
          <td class="center">{{ item.name }}</td>
          <td class="center">{{ item.description }}</td>
          <td class="center actions">
            <button @click="editItem(item)" class="edit-btn">✏️</button>
            <button @click="deleteItem(item._id)" class="delete-btn">🗑️</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Edit Row -->
    <div v-if="editing" class="form-inline edit-row">
      <input v-model="editData.name" placeholder="Name" />
      <input v-model="editData.description" placeholder="Description" />
      <button @click.prevent="updateItem" class="update-btn">Update</button>
      <button @click="cancelEdit" class="cancel-btn">Cancel</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      items: [],
      newItem: { name: "", description: "" },
      editing: false,
      editData: {},
      api: process.env.VUE_APP_API_URL || "http://localhost:5000/api/items",
    };
  },
  methods: {
    async fetchItems() {
      this.items = (await axios.get(this.api)).data;
    },
    async addItem() {
      await axios.post(this.api, this.newItem);
      this.newItem = { name: "", description: "" };
      this.fetchItems();
    },
    editItem(item) {
      this.editing = true;
      this.editData = { ...item };
    },
    async updateItem() {
      await axios.put(`${this.api}/${this.editData._id}`, this.editData);
      this.cancelEdit();
      this.fetchItems();
    },
    async deleteItem(id) {
      if (confirm("Delete this item?")) {
        await axios.delete(`${this.api}/${id}`);
        this.fetchItems();
      }
    },
    cancelEdit() {
      this.editing = false;
      this.editData = {};
    },
  },
  mounted() {
    this.fetchItems();
  },
};
</script>

<style>
.container {
  max-width: 700px;
  margin: 40px auto;
  font-family: "Segoe UI", sans-serif;
  text-align: center;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}

.form-inline {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
}

input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  transition: border 0.2s;
}
input:focus {
  outline: none;
  border-color: #007bff;
}

button {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
  color: #fff;
}

.add-btn {
  background-color: #28a745;
}
.add-btn:hover {
  background-color: #218838;
}
.edit-btn {
  background-color: #ffc107;
  color: #333;
}
.edit-btn:hover {
  background-color: #e0a800;
}
.delete-btn {
  background-color: #dc3545;
}
.delete-btn:hover {
  background-color: #c82333;
}
.update-btn {
  background-color: #007bff;
}
.update-btn:hover {
  background-color: #0069d9;
}
.cancel-btn {
  background-color: #6c757d;
}
.cancel-btn:hover {
  background-color: #5a6268;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
}

th,
td {
  padding: 12px 16px;
  text-align: center;
}

th {
  background-color: #f8f9fa;
  color: #333;
  font-weight: 600;
}

tbody tr {
  background-color: #fff;
  transition: background 0.2s;
}
tbody tr:nth-child(even) {
  background-color: #f1f3f5;
}
tbody tr:hover {
  background-color: #e9ecef;
}

/* Center content and add gap between action buttons */
td.actions button {
  margin: 0 4px;
}

.edit-row {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
}
</style>

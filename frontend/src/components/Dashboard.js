import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchUsers, createUser, updateUser, deleteUser } from '../services/api';
import UserForm from './UserForm';
import UserTable from './UserTable';

const Dashboard = () => {
  const { auth } = useAuth();
  const token = auth?.token;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);

  const loadUsers = useCallback(async () => {
    if (!token) {
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetchUsers(token);
      setUsers(response.data.users);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load users.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleCreate = async (payload) => {
    setError('');
    try {
      const response = await createUser(token, payload);
      setUsers((prev) => [response.data.user, ...prev]);
      setStatus('User created successfully.');
      setTimeout(() => setStatus(''), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create user.');
    }
  };

  const handleUpdate = async (id, payload) => {
    setError('');
    try {
      const response = await updateUser(token, id, payload);
      setUsers((prev) => prev.map((user) => (user.id === id ? response.data.user : user)));
      setEditing(null);
      setStatus('User updated successfully.');
      setTimeout(() => setStatus(''), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update user.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) {
      return;
    }
    setError('');
    try {
      await deleteUser(token, id);
      setUsers((prev) => prev.filter((user) => user.id !== id));
      setStatus('User deleted.');
      setTimeout(() => setStatus(''), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete user.');
    }
  };

  return (
    <section>
      <div className="panel">
        <h2>HR User Management</h2>
        {status && <p className="status">{status}</p>}
        {error && <p className="error">{error}</p>}
        <div className="dashboard-grid">
          <div>
            <h3>Create new HR user</h3>
            <UserForm submitLabel="Create user" onSubmit={handleCreate} />
          </div>
          <div>
            <h3>Current HR users{loading && ' • loading...'}</h3>
            <UserTable users={users} onEdit={setEditing} onDelete={handleDelete} />
          </div>
        </div>
      </div>
      {editing && (
        <div className="panel">
          <h3>Edit {editing.firstName}</h3>
          <UserForm
            initialData={editing}
            submitLabel="Save changes"
            onSubmit={(payload) => handleUpdate(editing.id, payload)}
            onCancel={() => setEditing(null)}
          />
        </div>
      )}
    </section>
  );
};

export default Dashboard;

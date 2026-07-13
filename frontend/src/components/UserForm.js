import { useEffect, useState } from 'react';

const emptyForm = { firstName: '', lastName: '', email: '', password: '' };

const UserForm = ({ initialData = null, submitLabel, onSubmit, onCancel }) => {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        email: initialData.email || '',
        password: '',
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialData]);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password.trim(),
      };

      if (initialData) {
        const filtered = Object.entries(payload).reduce((acc, [key, value]) => {
          if (value) {
            acc[key] = value;
          }
          return acc;
        }, {});
        await onSubmit(filtered);
      } else {
        await onSubmit(payload);
        setForm(emptyForm);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save user at the moment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <div className="form-field">
        <label htmlFor="user-first">First name</label>
        <input
          id="user-first"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-field">
        <label htmlFor="user-last">Last name</label>
        <input
          id="user-last"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-field">
        <label htmlFor="user-email">Email</label>
        <input
          id="user-email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-field">
        <label htmlFor="user-password">Password</label>
        <input
          id="user-password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder={initialData ? 'Leave blank to keep existing password' : 'Strong password'}
          minLength={initialData ? 0 : 8}
          required={!initialData}
        />
      </div>
      <div className="form-field" style={{ gap: '0.5rem', display: 'flex', flexWrap: 'wrap' }}>
        <button type="submit" disabled={loading}>
          {loading ? 'Working…' : submitLabel}
        </button>
        {initialData && onCancel && (
          <button type="button" className="ghost-button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default UserForm;

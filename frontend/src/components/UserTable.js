const UserTable = ({ users = [], onEdit, onDelete }) => (
  <div>
    <table className="user-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.length === 0 && (
          <tr>
            <td colSpan={4} style={{ color: '#64748b' }}>
              No HR users found yet.
            </td>
          </tr>
        )}
        {users.map((user) => (
          <tr key={user.id}>
            <td>
              {user.firstName} {user.lastName}
            </td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>
              <button type="button" onClick={() => onEdit(user)}>
                Edit
              </button>
              <button type="button" className="ghost-button" onClick={() => onDelete(user.id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default UserTable;

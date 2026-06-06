import { useEffect, useState } from 'react';
import type { UserItem } from '../../types';

import './style.scss';
import AddUserForm from '../../components/AddUserForm';

const Users = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        const res = await fetch('http://localhost:3000/api/users', { headers });

        if (!res.ok) {
          throw new Error('Foydalanuvchilarni yuklashda xatolik yuz berdi');
        }

        const data = await res.json();
        const usersArray = Array.isArray(data) ? data : data.data || [];

        const activeAndInactiveUsers = usersArray.filter((u: UserItem) => !u.isDeleted);

        setUsers(activeAndInactiveUsers);
      }
      catch (err) {
        setError(err instanceof Error ? err.message : 'Xatolik yuz berdi')
      }
      finally {
        setLoading(false)
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div className="loading">Yuklanmoqda...</div>;
  if (error) return <div className="error">Xatolik: {error}</div>;

  return (
    <div className="users-container">
      <div className='title__button__wrapper'>
        <h1>Foydalanuvchilar boshqaruvi</h1>
        <button onClick={() => setIsModalOpen(true)}>Add user</button>
      </div>

      {
        isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>✕</button>
              <AddUserForm onSuccess={() => setIsModalOpen(false)} />
            </div>
          </div>
        )
      }

      <div className="table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>F.I.Sh (Full Name)</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Holati (Status)</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="no-data">Foydalanuvchilar mavjud emas.</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="name-cell">{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className="role-text">{user.role}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.status}`}>
                      {user.status === 'active' ? 'Faol' : 'Bloklangan'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
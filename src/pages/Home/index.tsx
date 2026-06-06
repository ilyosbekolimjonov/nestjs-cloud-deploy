import { useEffect, useState } from 'react';
import type { Stats, UserItem } from '../../types';

import './style.scss';

const Home = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    deletedUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        const usersRes = await fetch('http://localhost:3000/api/users', { headers });

        if (!usersRes.ok) {
          throw new Error('Ma\'lumotlarni yuklashda xatolik yuz berdi');
        }

        const usersData = await usersRes.json();
        const usersArray = Array.isArray(usersData) ? usersData : usersData.data || [];

        const active = usersArray.filter((u: UserItem) => u.status === 'active' && !u.isDeleted).length;
        const inactive = usersArray.filter((u: UserItem) => u.status === 'inactive' && !u.isDeleted).length;
        const deleted = usersArray.filter((u: UserItem) => u.isDeleted).length;

        setStats({
          totalUsers: usersArray.length,
          activeUsers: active,
          inactiveUsers: inactive,
          deletedUsers: deleted,
        });

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ma\'lumotlarni yuklashda xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="loading">Yuklanmoqda...</div>;
  if (error) return <div className="error">Xatolik: {error}</div>;

  return (
    <div className="container">
      <h1 className='container__title'>Tizim tahlili (Dashboard)</h1>

      <div className="stats-grid">
        <div className="stat-card total">
          <h3>Foydalanuvchilar</h3>
          <p className="number">{stats.totalUsers}</p>
        </div>
        <div className="stat-card active">
          <h3>Faol (Active)</h3>
          <p className="number">{stats.activeUsers}</p>
        </div>
        <div className="stat-card inactive">
          <h3>Bloklangan (Inactive)</h3>
          <p className="number">{stats.inactiveUsers}</p>
        </div>
        <div className="stat-card deleted">
          <h3>O'chirilgan (Deleted)</h3>
          <p className="number">{stats.deletedUsers}</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
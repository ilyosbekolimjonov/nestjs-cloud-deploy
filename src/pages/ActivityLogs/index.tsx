import { useEffect, useState } from 'react';
import type { LogItem } from '../../types';
import './style.scss';

const ActivityLogs = () => {
    const [logs, setLogs] = useState<LogItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const limit = 10;

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('token');
                const headers = {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                };

                const res = await fetch(`http://localhost:3000/api/activity-logs?page=${currentPage}&limit=${limit}`, { headers });

                if (!res.ok) {
                    throw new Error('Tizim harakatlarini yuklashda xatolik yuz berdi');
                }

                const data = await res.json();

                const logsArray = Array.isArray(data) ? data : data.data || [];
                setLogs(logsArray);

                const total = data.meta?.totalPages || Math.ceil((data.total || logsArray.length) / limit) || 1;
                setTotalPages(total);

            } catch (err) {
                setError(err instanceof Error ? err.message : 'Xatolik yuz berdi');
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, [currentPage]);

    if (loading) return <div className="loading">Yuklanmoqda...</div>;
    if (error) return <div className="error">Xatolik: {error}</div>;

    return (
        <div className="logs-container">
            <h1>Tizim harakatlari tarixi (Activity Logs)</h1>

            <div className="logs-table-wrapper">
                <table className="logs-table">
                    <thead>
                        <tr>
                            <th>Vaqt</th>
                            <th>Foydalanuvchi</th>
                            <th>Amal turi</th>
                            <th>Tavsif</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="no-data">Harakatlar topilmadi.</td>
                            </tr>
                        ) : (
                            logs.map((log) => (
                                <tr key={log.id} className={`log-row ${log.activityType}`}>
                                    <td className="time-cell">
                                        {new Date(log.createdAt).toLocaleString([], {
                                            dateStyle: 'short',
                                            timeStyle: 'short',
                                        })}
                                    </td>
                                    <td className="user-cell">
                                        <strong>{log.user?.fullName || 'Tizim'}</strong>
                                    </td>
                                    <td className="type-cell">
                                        <span className={`badge ${log.activityType}`}>{log.activityType}</span>
                                    </td>
                                    <td className="desc-cell">{log.description}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="pagination-wrapper">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="page-btn"
                >
                    ◄ Oldingi
                </button>

                <span className="page-info">
                    Sahifa {currentPage} / {totalPages}
                </span>

                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="page-btn"
                >
                    Keyingi ►
                </button>
            </div>
        </div>
    );
};

export default ActivityLogs;
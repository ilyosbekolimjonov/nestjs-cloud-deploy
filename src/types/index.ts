export interface Stats {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    deletedUsers: number;
}

export type LogItem = {
    id: string | number;
    activityType?: string;
    createdAt: string;
    description: string;
    user?: {
        fullName?: string;
    };
};

export interface UserItem {
    id: string; 
    fullName: string;
    email: string;
    role: string;
    status: 'active' | 'inactive';
    isDeleted: boolean;
}
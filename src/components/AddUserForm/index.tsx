import { useForm } from 'react-hook-form';

import './style.scss';

type UserFormData = {
    fullName: string;
    email: string;
    role: 'admin' | 'user';
    status: 'active' | 'inactive';
    password: string;
}

type AddUserFormProps = {
    onSuccess: () => void;
}

const AddUserForm = ({ onSuccess }: AddUserFormProps) => {
    const { register, handleSubmit, formState: { errors } } = useForm<UserFormData>()

    const onSubmit = async (data: UserFormData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            })

            if (!response.ok) {
                throw new Error('Xatolik yuz berdi')
            }

            const result = await response.json()
            console.log('Muvaffaqiyatli qo\'shildi:', result)
            onSuccess()
        } catch (error) {
            console.log('Backendga yuborishda xato:', error)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label>Ism-familiya: </label>
                <input {...register("fullName", { required: "Ismni kiritish shart!" })} />
                {errors.fullName && <p style={{ color: 'red' }}>{errors.fullName.message}</p>}
            </div>

            <div>
                <label>Email: </label>
                <input {...register("email", {
                    required: "Email shart!",
                    pattern: { value: /^\S+@\S+$/, message: "Noto'g'ri email format!" }
                })} />
                {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
            </div>

            <div>
                <label>Password: </label>
                <input {...register("password", { required: "Password kiritish shart!" })} />
                {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
            </div>
                
            <div>
                <label>Role: </label>
                <select {...register("role", { required: "Roleni kiritish shart!" })} name="role" id="">
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                </select>
                {errors.role && <p style={{ color: 'red' }}>{errors.role.message}</p>}
            </div>

            <div>
                <label>Status: </label>
                <select {...register("status", { required: "Statusni kiritish shart!" })} name="status" id="">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
                {errors.status && <p style={{ color: 'red' }}>{errors.status.message}</p>}
            </div>
            <button type='submit'>Qo'shish</button>
        </form>
    )
}

export default AddUserForm;

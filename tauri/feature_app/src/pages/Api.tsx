import { Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

interface CreateUserForm {
  name: string;
  email: string;
}

const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  if (!response.ok) throw new Error("Failed to fetch users");
  return response.json();
};

const createUser = async (data: CreateUserForm): Promise<User> => {
  const response = await fetch("https://jsonplaceholder.typicode.com/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create user");
  return response.json();
};

export default function Api() {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateUserForm>();

  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: (newUser) => {
      setMessage(`ユーザー "${newUser.name}" を作成しました（ID: ${newUser.id}）`);
      reset();
      setTimeout(() => setMessage(null), 3000);
    },
    onError: (error) => {
      setMessage(`エラー: ${error.message}`);
      setTimeout(() => setMessage(null), 3000);
    },
  });

  const onSubmit = (data: CreateUserForm) => {
    mutation.mutate(data);
  };

  return (
    <div className="page">
      <header className="header">
        <Link to="/" className="back-button">
          ← 戻る
        </Link>
        <h1>API</h1>
        <button onClick={() => refetch()} className="reset-button">
          再取得
        </button>
      </header>

      <main className="api-content">
        {message && <div className="message">{message}</div>}

        <div className="create-form">
          <h2>ユーザー作成</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-field">
              <input
                {...register("name", { required: "名前は必須です" })}
                placeholder="名前"
                className="form-input"
              />
              {errors.name && <span className="error">{errors.name.message}</span>}
            </div>
            <div className="form-field">
              <input
                {...register("email", {
                  required: "メールアドレスは必須です",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "有効なメールアドレスを入力してください",
                  },
                })}
                placeholder="メールアドレス"
                className="form-input"
              />
              {errors.email && <span className="error">{errors.email.message}</span>}
            </div>
            <button type="submit" className="submit-btn" disabled={mutation.isPending}>
              {mutation.isPending ? "作成中..." : "作成"}
            </button>
          </form>
        </div>

        <div className="user-list">
          <h2>ユーザー一覧</h2>
          {isLoading && <div className="loading">読み込み中...</div>}
          {error && (
            <div className="error-container">
              <p>エラー: {error.message}</p>
              <button onClick={() => refetch()}>再試行</button>
            </div>
          )}
          {users && (
            <ul>
              {users.map((user) => (
                <li key={user.id} className="user-item">
                  <span className="user-avatar">{user.id}</span>
                  <div className="user-info">
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

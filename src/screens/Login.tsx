import { useState } from "react";
import { useAuthContext } from "../providers/AuthProvider";
import Input from "../components/Input";
import Button from "../components/Button";
import { useTranslation } from 'react-i18next';

const Login = () => {
    const { login } = useAuthContext();
    const { t } = useTranslation();
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isSending, setSending] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        setSending(true);
        const response = await login(username, password);

        if (response.status !== 200) {
            setSending(false);
            setError(t('login_error'));
        } else {
            setError(null);
        }
    }

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-7 text-center">
                        <h1>{t('login_welcome')}</h1>
                        <p>{t('login_introtext')}</p>
                    </div>
                </div>

                <div className="row mt-5 justify-content-center">
                    <div className="col-md-7 col-lg-4">
                        <form onSubmit={undefined}>
                            <div className="row gy-4">
                                <Input
                                    value={username}
                                    onChange={value => setUsername(value)}
                                    name="login_email"
                                    label={t('login_email_label')}
                                    autoComplete="email"
                                />

                                <Input
                                    value={password}
                                    onChange={value => setPassword(value)}
                                    name="login_password"
                                    label={t('login_password_label')}
                                    type="password"
                                    autoComplete="current-password"
                                />

                                {error && (
                                    <div className="text-danger text-center">
                                        <span>{error}</span>
                                    </div>
                                )}

                                <div className="col-12 text-center">
                                    <Button
                                        text={t('general_login')}
                                        onClick={handleLogin}
                                        disabled={isSending}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;
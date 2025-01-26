import { useTranslation } from 'react-i18next';
import { useAuthContext } from '../provider/AuthProvider';

const Login = () => {
    const { signIn } = useAuthContext();
    const { t } = useTranslation();

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-7 text-center">
                        <h1>{t('login_welcome')}</h1>
                        <p>{t('login_introtext')}</p>
                    </div>
                </div>

                <div className="row mt-2 justify-content-center">
                    <div className="col-auto">
                        <button className="btn btn-primary" onClick={signIn}>
                            Logg inn
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;
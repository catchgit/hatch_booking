import { useTranslation } from 'react-i18next';
import { useAuthContext } from '../provider/AuthProvider';
import Numpad from '../components/Numpad';
import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
    const { t } = useTranslation();
    const { apiCall, updateAccessToken } = useAuthContext();
    const [combination, setCombination] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showNumpad, setShowNumpad] = useState(true);

    const login = async (code) => {
        setShowNumpad(false);
        setIsSubmitting(true);

        setTimeout(async () => {
            const response = await apiCall({
                action: 'login',
                code
            });

            setIsSubmitting(false);

            if (response.status === 200) {
                updateAccessToken(response.accessToken);
                localStorage.setItem('bookingAccessToken', response.accessToken);
            } else {
                setCombination('');
                setShowNumpad(true);
            }
        }, 1000);
    };

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-7 text-center">
                        <h1>{t('enter_pin')}</h1>

                        <AnimatePresence mode="wait">
                            {showNumpad && (
                                <motion.div
                                    key="numpad"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Numpad
                                        value={combination}
                                        onChange={setCombination}
                                        onSubmit={(code) => login(code)}
                                        length={6}
                                    />
                                </motion.div>
                            )}

                            {isSubmitting && (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    transition={{ duration: 0.3 }}
                                    className="d-flex justify-content-center align-items-center"
                                    style={{ height: 100 }}
                                >
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 1,
                                            ease: "linear"
                                        }}
                                        style={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: '50%',
                                            border: '5px solid #ccc',
                                            borderTop: '5px solid var(--bs-primary)'
                                        }}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;
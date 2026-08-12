import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa6";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import LogoRegister from "../../img/DivulgAÍ-removebg-preview.png";

import "./NewPassword.css";

const passwordRules = [
    { label: 'Letra maiúscula', test: (value = '') => /[A-Z]/.test(value) },
    { label: 'Letra minúscula', test: (value = '') => /[a-z]/.test(value) },
    { label: 'Número', test: (value = '') => /\d/.test(value) },
    { label: 'Pontuação', test: (value = '') => /[^A-Za-z0-9]/.test(value) },
];

const isStrongPassword = (value = '') => passwordRules.every((rule) => rule.test(value));

export default function NewPassword() {
    const navigate = useNavigate();
    const email = sessionStorage.getItem("emailRecuperacao");

    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef([]);

    const [codigoValidado, setCodigoValidado] = useState(false);
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loadingCodigo, setLoadingCodigo] = useState(false);
    const [loadingSenha, setLoadingSenha] = useState(false);
    const [loadingResend, setLoadingResend] = useState(false);

    const [timeLeft, setTimeLeft] = useState(600);
    const [resendTimer, setResendTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const [resendAttempt, setResendAttempt] = useState(0);

    useEffect(() => {
        if (timeLeft <= 0 || codigoValidado) return;
        const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, codigoValidado]);

    useEffect(() => {
        if (resendTimer <= 0) {
            setCanResend(true);
            return;
        }
        const resendInterval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
        return () => clearInterval(resendInterval);
    }, [resendTimer]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    const handleInputChange = (value, index) => {
        if (/^[0-9]?$/.test(value)) {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);

            if (value && index < 5) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const validarCodigo = async () => {
        const codigoCompleto = code.join("");
        if (codigoCompleto.length < 6) {
            toast.error("Digite o código completo de 6 dígitos.");
            return;
        }

        setLoadingCodigo(true);
        try {
            await axios.post(
                "http://localhost:8080/api/v1/usuario/recuperar-senha/validar-codigo",
                null,
                { params: { email, codigo: codigoCompleto } }
            );
            toast.success("Código validado com sucesso.");
            setCodigoValidado(true);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data || "Código inválido.");
        } finally {
            setLoadingCodigo(false);
        }
    };

    const reenviarCodigo = async () => {
        if (!email || !canResend || loadingResend) return;

        setCanResend(false);
        setLoadingResend(true);

        try {
            await axios.post(
                "http://localhost:8080/api/v1/usuario/recuperar-senha/enviar-codigo",
                null,
                { params: { email } }
            );
            
            toast.success("Novo código reenviado para seu e-mail.");
            
            const nextAttempt = resendAttempt + 1;
            setResendAttempt(nextAttempt);

            let nextTime = 30;
            if (nextAttempt === 1) nextTime = 60;
            else if (nextAttempt === 2) nextTime = 120;
            else if (nextAttempt >= 3) nextTime = 180;

            setTimeLeft(600); 
            setResendTimer(nextTime);
            setCode(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data || "Erro ao reenviar o código.");
        } finally {
            setLoadingResend(false);
        }
    };

    const alterarSenha = async () => {
        if (!isStrongPassword(novaSenha)) {
            toast.error("A senha precisa cumprir todos os requisitos de segurança.");
            return;
        }

        if (novaSenha !== confirmarSenha) {
            toast.error("As senhas não coincidem.");
            return;
        }

        setLoadingSenha(true);
        try {
            await axios.post(
                "http://localhost:8080/api/v1/usuario/recuperar-senha/alterar-senha",
                null,
                {
                    params: {
                        email,
                        codigo: code.join(""),
                        novaSenha
                    }
                }
            );

            toast.success("Senha alterada com sucesso!");
            sessionStorage.removeItem("emailRecuperacao");
            navigate("/login");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data || "Erro ao alterar senha.");
        } finally {
            setLoadingSenha(false);
        }
    };

    return (
        <div className="container-newpassword">
            {codigoValidado && (
                <div className="newpassword-image-wrapper">
                    <img src={LogoRegister} alt="Logo DivulgAí" className="newpassword-logo" />
                </div>
            )}

            <div className={`newpassword-box ${!codigoValidado ? "card-framed" : ""}`}>
                {!codigoValidado ? (
                    <>
                        <button className="btn-voltar" onClick={() => navigate(-1)}>
                            <ArrowLeft size={24} />
                        </button>

                        <h2 className="newpassword-title">DIGITE O CÓDIGO DE VERIFICAÇÃO</h2>

                        <div className="code-inputs-container">
                            {code.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleInputChange(e.target.value, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    className="code-input"
                                />
                            ))}
                        </div>

                        <div className="instructions-newpassword">
                            <p>ENVIAMOS O CÓDIGO DE 6 DÍGITOS PARA O E-MAIL CADASTRADO. VERIFIQUE SUA CAIXA DE ENTRADA OU SPAM.</p>
                            <p className="expiration-text">
                                {timeLeft > 0 
                                    ? `O CÓDIGO EXPIRA EM ${formatTime(timeLeft)}.` 
                                    : "O CÓDIGO EXPIROU. CLIQUE EM REENVIAR."}
                            </p>
                        </div>

                        <button
                            className="btn-verificar"
                            onClick={validarCodigo}
                            disabled={loadingCodigo || timeLeft === 0}
                        >
                            {loadingCodigo ? "VALIDANDO..." : "VERIFICAR CÓDIGO"}
                        </button>

                        <button
                            className={`btn-reenviar ${(!canResend || loadingResend) ? "disabled" : ""}`}
                            onClick={reenviarCodigo}
                            type="button"
                            disabled={!canResend || loadingResend}
                        >
                            {loadingResend 
                                ? "ENVIANDO..." 
                                : canResend 
                                    ? "REENVIAR CÓDIGO" 
                                    : `REENVIAR CÓDIGO (${formatTime(resendTimer)})`}
                        </button>
                    </>
                ) : (
                    <>
                        <h2 className="newpassword-title-register">Redefinição de senha</h2>

                        <div className="register-form">
                            <label className="register-label">
                                <div>Password</div>
                                <div className="register-input-icon-wrapper">
                                    <FaLock className="register-input-icon" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Crie uma nova senha"
                                        value={novaSenha}
                                        onChange={(e) => setNovaSenha(e.target.value)}
                                    />
                                    {showPassword ? (
                                        <FaEyeSlash className="register-eye-icon" onClick={() => setShowPassword(!showPassword)} />
                                    ) : (
                                        <FaEye className="register-eye-icon" onClick={() => setShowPassword(!showPassword)} />
                                    )}
                                </div>
                                <div className="password-rules" aria-live="polite">
                                    {passwordRules.map((rule) => {
                                        const valid = rule.test(novaSenha);
                                        return (
                                            <span
                                                key={rule.label}
                                                className={`password-rule ${valid ? 'password-rule--valid' : ''}`}
                                            >
                                                {valid ? <FaCheckCircle /> : <FaTimesCircle />}
                                                {rule.label}
                                            </span>
                                        );
                                    })}
                                </div>
                            </label>

                            <label className="register-label">
                                <div>Confirm Password</div>
                                <div className="register-input-icon-wrapper">
                                    <FaLock className="register-input-icon" />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Confirme sua nova senha"
                                        value={confirmarSenha}
                                        onChange={(e) => setConfirmarSenha(e.target.value)}
                                    />
                                    {showConfirmPassword ? (
                                        <FaEyeSlash className="register-eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
                                    ) : (
                                        <FaEye className="register-eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
                                    )}
                                </div>
                            </label>

                            <button
                                className="register-button"
                                onClick={alterarSenha}
                                disabled={loadingSenha}
                            >
                                {loadingSenha ? "ALTERANDO..." : "SALVAR SENHA"}
                            </button>

                            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                                <Link to={'/login'} className="register-link">Voltar para o login</Link>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
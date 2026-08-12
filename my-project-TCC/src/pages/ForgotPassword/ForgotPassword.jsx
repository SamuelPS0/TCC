import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { FaRegEnvelope } from "react-icons/fa";
import LogoRegister from "../../img/DivulgAÍ-removebg-preview.png";

import "./ForgotPassword.css";

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleEnviarCodigo = async (e) => {
        e.preventDefault();
        const emailTrimmed = email?.trim();

        if (!emailTrimmed) {
            toast.error("Informe seu e-mail.");
            return;
        }

        setLoading(true);

        try {
            await axios.post(
                "http://localhost:8080/api/v1/usuario/recuperar-senha/enviar-codigo",
                null,
                {
                    params: {
                        email: emailTrimmed
                    }
                }
            );

            sessionStorage.setItem("emailRecuperacao", emailTrimmed);
            toast.success("Código enviado para seu e-mail.");
            navigate("/new-password");

        } catch (error) {
            console.error(error);
            toast.error(
                error.response?.data ||
                "Erro ao enviar o código."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-forgotpassword">
            <div className="forgotpassword-card">
                <button className="btn-voltar" onClick={() => navigate(-1)} type="button">
                    <ArrowLeft size={24} />
                </button>

                <div className="forgotpassword-logo-wrapper">
                    <img src={LogoRegister} alt="Logo DivulgAí" className="forgotpassword-logo" />
                </div>

                <div className="forgotpassword-header">
                    <h2>REDEFINIR SUA SENHA</h2>
                    <p>
                        PREENCHA SEU E-MAIL E ENVIAREMOS UM CÓDIGO DE VERIFICAÇÃO PARA QUE VOCÊ POSSA CRIAR UMA NOVA SENHA.
                    </p>
                </div>

                <form onSubmit={handleEnviarCodigo} className="forgotpassword-form">
                    <label className="forgotpassword-label">
                        <div>Email</div>
                        <div className="forgotpassword-input-wrapper">
                            <FaRegEnvelope className="forgotpassword-input-icon" />
                            <input
                                type="email"
                                placeholder="Adicione seu Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </label>

                    <button type="submit" className="forgotpassword-button" disabled={loading}>
                        {loading ? "ENVIANDO..." : "ENVIAR CÓDIGO"}
                    </button>
                </form>
            </div>
        </div>
    );
}
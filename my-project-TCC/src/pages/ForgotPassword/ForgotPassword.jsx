import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import "./ForgotPassword.css";
import Login from "../../Components/Login/Login";

export default function ForgotPassword() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const handleEnviarCodigo = async (formData) => {

        const email = formData.email?.trim();

        if (!email) {
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
                        email
                    }
                }
            );

            sessionStorage.setItem("emailRecuperacao", email);

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

            <Login
                buttonText="Enviar código"
                loadingText="Enviando..."
                passwordVisible={false}
                passwordRequired={false}
                onSubmit={handleEnviarCodigo}
                isSubmitting={loading}
            />

        </div>

    );

}
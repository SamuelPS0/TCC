import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import "./NewPassword.css";

export default function NewPassword() {

    const navigate = useNavigate();

    const email = sessionStorage.getItem("emailRecuperacao");

    const [codigo, setCodigo] = useState("");

    const [codigoValidado, setCodigoValidado] = useState(false);

    const [novaSenha, setNovaSenha] = useState("");

    const [confirmarSenha, setConfirmarSenha] = useState("");

    const [loadingCodigo, setLoadingCodigo] = useState(false);

    const [loadingSenha, setLoadingSenha] = useState(false);

    const validarCodigo = async () => {

        if (!codigo) {
            toast.error("Digite o código.");
            return;
        }

        setLoadingCodigo(true);

        try {

            await axios.post(
                "http://localhost:8080/api/v1/usuario/recuperar-senha/validar-codigo",
                null,
                {
                    params: {
                        email,
                        codigo
                    }
                }
            );

            toast.success("Código validado.");

            setCodigoValidado(true);

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data ||
                "Código inválido."
            );

        } finally {

            setLoadingCodigo(false);

        }

    };

    const alterarSenha = async () => {

        if (!novaSenha || !confirmarSenha) {

            toast.error("Preencha todos os campos.");

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
                        codigo,
                        novaSenha
                    }
                }
            );

            toast.success("Senha alterada com sucesso!");

            sessionStorage.removeItem("emailRecuperacao");

            navigate("/login");

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data ||
                "Erro ao alterar senha."
            );

        } finally {

            setLoadingSenha(false);

        }

    };

    return (

        <div className="container-newpassword">

            <div className="newpassword-box">

                <h2>Recuperação de senha</h2>

                <input
                    type="text"
                    placeholder="Código recebido por e-mail"
                    value={codigo}
                    disabled={codigoValidado}
                    onChange={(e) => setCodigo(e.target.value)}
                />

                {!codigoValidado && (

                    <button
                        onClick={validarCodigo}
                        disabled={loadingCodigo}
                    >

                        {
                            loadingCodigo
                                ? "Validando..."
                                : "Validar código"
                        }

                    </button>

                )}

                {codigoValidado && (

                    <>

                        <input
                            type="password"
                            placeholder="Nova senha"
                            value={novaSenha}
                            onChange={(e) => setNovaSenha(e.target.value)}
                        />

                        <input
                            type="password"
                            placeholder="Confirmar senha"
                            value={confirmarSenha}
                            onChange={(e) => setConfirmarSenha(e.target.value)}
                        />

                        <button
                            onClick={alterarSenha}
                            disabled={loadingSenha}
                        >

                            {
                                loadingSenha
                                    ? "Alterando..."
                                    : "Alterar senha"
                            }

                        </button>

                    </>

                )}

            </div>

        </div>

    );

}
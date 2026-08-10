import React, { useState, useEffect } from 'react';
import SideMenuCLIENT from '../../Components/SideMenu/SideMenuCLIENT/SideMenuCLIENT';
import { useAuth } from '../../Components/AuthContext';
import { toast } from 'sonner';
import { usuarioService } from '../../services/usuarioService';
import Loading from '../../Components/Loading/Loading';
import './ClientAccInfo.css';

import {
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaTimesCircle,
  FaUser,
  FaEnvelope,
  FaLock,
  FaSave,
  FaCheck
} from 'react-icons/fa';

const passwordRules = [
  {
    label: 'Letra maiúscula',
    test: (value = '') => /[A-Z]/.test(value)
  },
  {
    label: 'Letra minúscula',
    test: (value = '') => /[a-z]/.test(value)
  },
  {
    label: 'Número',
    test: (value = '') => /\d/.test(value)
  },
  {
    label: 'Pontuação',
    test: (value = '') => /[^A-Za-z0-9]/.test(value)
  }
];

const isStrongPassword = (value = '') =>
  passwordRules.every((rule) => rule.test(value));

function ClientAccInfo() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    id: null,
    nome: '',
    email: '',
    senha: '',
    nivelAcesso: '',
    statusUsuario: ''
  });

  const [originalData, setOriginalData] = useState({
    id: null,
    nome: '',
    email: '',
    senha: '',
    nivelAcesso: '',
    statusUsuario: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const [showLoader, setShowLoader] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  /*
   * ============================================================
   * LOADING INICIAL
   * ============================================================
   */

  useEffect(() => {
    console.log('[ClientAccInfo] Componente iniciado.');

    const timer = setTimeout(() => {
      console.log('[ClientAccInfo] Iniciando fade-out do loading.');

      setFadeOut(true);

      setTimeout(() => {
        console.log('[ClientAccInfo] Loading finalizado.');

        setShowLoader(false);
      }, 500);
    }, 1000);

    return () => {
      console.log('[ClientAccInfo] Limpando timer do loading.');
      clearTimeout(timer);
    };
  }, []);

  /*
   * ============================================================
   * CARREGAR USUÁRIO LOGADO
   * ============================================================
   */

  useEffect(() => {
    console.log('[ClientAccInfo] useEffect do usuário executado.');
    console.log('[ClientAccInfo] Usuário recebido pelo AuthContext:', user);

    if (!user) {
      console.warn('[ClientAccInfo] Usuário ainda não disponível.');
      return;
    }

    if (!user.email && !user.username) {
      console.warn(
        '[ClientAccInfo] Usuário não possui email/username no AuthContext.'
      );
      return;
    }

    console.log('[ClientAccInfo] Buscando /usuario/me...');

    usuarioService
      .me()
      .then((response) => {
        console.log(
          '[ClientAccInfo] Resposta recebida de /usuario/me:',
          response
        );

        const usuarioLogado = response.data;

        console.log(
          '[ClientAccInfo] Dados do usuário logado:',
          usuarioLogado
        );

        const data = {
          id: usuarioLogado.id ?? null,
          nome: usuarioLogado.nome ?? '',
          email: usuarioLogado.username ?? '',
          senha: '',
          nivelAcesso: usuarioLogado.nivelAcesso ?? '',
          statusUsuario: usuarioLogado.statusUsuario ?? ''
        };

        console.log(
          '[ClientAccInfo] Dados preparados para o formulário:',
          data
        );

        setFormData(data);

        setOriginalData({
          ...data,
          senha: ''
        });

        console.log(
          '[ClientAccInfo] Formulário preenchido com sucesso.'
        );
      })
      .catch((error) => {
        console.error(
          '[ClientAccInfo] Erro ao buscar /usuario/me:',
          error
        );

        if (error.response) {
          console.error(
            '[ClientAccInfo] Status HTTP:',
            error.response.status
          );

          console.error(
            '[ClientAccInfo] Dados do erro:',
            error.response.data
          );
        }

        toast.error(
          'Não foi possível carregar suas informações.'
        );
      });
  }, [user]);

  /*
   * ============================================================
   * ALTERAÇÃO DOS CAMPOS
   * ============================================================
   */

  const handleChange = (e) => {
    const { name, value } = e.target;

    console.log(
      `[ClientAccInfo] Campo alterado: ${name}`
    );

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (saveSuccess) {
      setSaveSuccess(false);
    }
  };

  /*
   * ============================================================
   * SALVAR ALTERAÇÕES
   * ============================================================
   */

  const handleSave = async () => {
    console.log(
      '============================================================'
    );

    console.log('[ClientAccInfo] Iniciando processo de salvamento.');

    console.log(
      '[ClientAccInfo] Estado atual do formulário:',
      formData
    );

    console.log(
      '[ClientAccInfo] Estado original:',
      originalData
    );

    if (!formData.id) {
      console.error(
        '[ClientAccInfo] ID do usuário não encontrado.'
      );

      toast.error(
        'Não foi possível identificar o usuário.'
      );

      return;
    }

    const nomeAlterado =
      formData.nome !== originalData.nome;

    const senhaAlterada =
      formData.senha.trim() !== '';

    console.log(
      '[ClientAccInfo] Nome alterado:',
      nomeAlterado
    );

    console.log(
      '[ClientAccInfo] Senha alterada:',
      senhaAlterada
    );

    /*
     * Nenhuma alteração
     */

    if (!nomeAlterado && !senhaAlterada) {
      console.warn(
        '[ClientAccInfo] Nenhuma alteração detectada.'
      );

      toast.warning(
        'Nenhuma alteração detectada.'
      );

      return;
    }

    /*
     * Validação da senha
     */

    if (senhaAlterada) {
      console.log(
        '[ClientAccInfo] Validando nova senha...'
      );

      if (!isStrongPassword(formData.senha)) {
        console.warn(
          '[ClientAccInfo] Senha reprovada na validação.'
        );

        toast.error(
          'A senha não atende aos requisitos.'
        );

        return;
      }

      console.log(
        '[ClientAccInfo] Senha aprovada na validação.'
      );
    }

    setSaving(true);
    setSaveSuccess(false);

    const toastId = toast.loading(
      'Salvando alterações...'
    );

    try {
      /*
       * ========================================================
       * ALTERAR DADOS DO USUÁRIO
       * ========================================================
       */

      if (nomeAlterado) {
        console.log(
          '[ClientAccInfo] Iniciando atualização dos dados do usuário.'
        );

        const usuarioPayload = {
          nome: formData.nome,
          username: formData.email,
          nivelAcesso:
            formData.nivelAcesso ||
            user?.accessLevel ||
            user?.nivelAcesso ||
            'USER'
        };

        console.log(
          '[ClientAccInfo] Payload enviado para usuarioService.editar:',
          usuarioPayload
        );

        const responseUsuario =
          await usuarioService.editar(
            formData.id,
            usuarioPayload
          );

        console.log(
          '[ClientAccInfo] Resposta da edição do usuário:',
          responseUsuario
        );
      }

      /*
       * ========================================================
       * ALTERAR SENHA
       * ========================================================
       */

      if (senhaAlterada) {
        console.log(
          '[ClientAccInfo] Iniciando alteração da senha.'
        );

        const responseSenha =
          await usuarioService.alterarSenha(
            formData.id,
            formData.senha
          );

        console.log(
          '[ClientAccInfo] Resposta da alteração da senha:',
          responseSenha
        );
      }

      /*
       * ========================================================
       * ATUALIZAÇÃO LOCAL
       * ========================================================
       */

      const novoEstadoOriginal = {
        ...formData,
        senha: ''
      };

      console.log(
        '[ClientAccInfo] Atualizando estado original:',
        novoEstadoOriginal
      );

      setOriginalData(novoEstadoOriginal);

      setFormData((prev) => ({
        ...prev,
        senha: ''
      }));

      setSaveSuccess(true);
      setSaving(false);

      toast.success(
        'Informações alteradas com sucesso!',
        {
          id: toastId
        }
      );

      console.log(
        '[ClientAccInfo] Alterações salvas com sucesso.'
      );

      console.log(
        '============================================================'
      );
    } catch (error) {
      console.error(
        '[ClientAccInfo] Erro ao salvar alterações:',
        error
      );

      if (error.response) {
        console.error(
          '[ClientAccInfo] Status HTTP:',
          error.response.status
        );

        console.error(
          '[ClientAccInfo] Resposta do servidor:',
          error.response.data
        );

        console.error(
          '[ClientAccInfo] Headers:',
          error.response.headers
        );
      }

      setSaving(false);
      setSaveSuccess(false);

      toast.error(
        'Erro ao salvar alterações.',
        {
          id: toastId
        }
      );

      console.log(
        '============================================================'
      );
    }
  };

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <>
      {showLoader && (
        <div
          className={`clientinfo-loader ${
            fadeOut
              ? 'clientinfo-loader--fadeout'
              : ''
          }`}
        >
          <Loading />
        </div>
      )}

      {!showLoader && (
        <div className="clientinfo-page">

          <div className="clientinfo-sidemenu">
            <SideMenuCLIENT />
          </div>

          <div className="clientinfo-container">

            <div className="clientinfo-inputs-container">

              <div className="cic">

                <h1>INFORMAÇÕES DA CONTA</h1>

                <h3>
                  Apenas você tem acesso a estas
                  <br />
                  informações pessoais.
                </h3>

                {/* ==================================================
                    NOME
                ================================================== */}

                <p className="clientinfo-label">
                  NOME
                </p>

                <div className="clientinfo-field-wrapper">

                  <FaUser className="clientinfo-field-icon" />

                  <input
                    className="clientinfo-input clientinfo-input-with-icon"
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Digite seu nome"
                    disabled={saving}
                  />

                </div>

                {/* ==================================================
                    EMAIL
                ================================================== */}

                <p className="clientinfo-label">
                  EMAIL
                </p>

                <div className="clientinfo-field-wrapper">

                  <FaEnvelope className="clientinfo-field-icon" />

                  <input
                    className="clientinfo-input clientinfo-input-with-icon clientinfo-input-disabled"
                    type="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    disabled
                  />

                </div>

                <small className="clientinfo-input-help">
                  O e-mail da conta não pode ser alterado.
                </small>

                {/* ==================================================
                    SENHA
                ================================================== */}

                <p className="clientinfo-label">
                  NOVA SENHA
                </p>

                <div className="clientinfo-password-wrapper">

                  <FaLock className="clientinfo-password-icon" />

                  <input
                    className="clientinfo-input clientinfo-password-input"
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    name="senha"
                    value={formData.senha}
                    onChange={handleChange}
                    placeholder="Digite uma nova senha"
                    disabled={saving}
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="clientinfo-password-toggle"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                    disabled={saving}
                    aria-label={
                      showPassword
                        ? 'Ocultar senha'
                        : 'Mostrar senha'
                    }
                  >
                    {showPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>

                </div>

                {/* ==================================================
                    REGRAS DA SENHA
                ================================================== */}

                <div className="clientinfo-password-rules-container">

                  <span className="clientinfo-password-rules-title">
                    Requisitos da senha
                  </span>

                  <div className="clientinfo-password-rules">

                    {passwordRules.map((rule) => {

                      const valid =
                        rule.test(
                          formData.senha
                        );

                      return (
                        <span
                          key={rule.label}
                          className={`clientinfo-password-rule ${
                            valid
                              ? 'clientinfo-password-rule--valid'
                              : ''
                          }`}
                        >

                          {valid ? (
                            <FaCheckCircle />
                          ) : (
                            <FaTimesCircle />
                          )}

                          {rule.label}

                        </span>
                      );
                    })}

                  </div>

                </div>


                {/* ==================================================
                    BOTÃO SALVAR
                ================================================== */}

                <button
                  className={`clientinfo-save-button ${
                    saving
                      ? 'clientinfo-save-button--loading'
                      : ''
                  } ${
                    saveSuccess
                      ? 'clientinfo-save-button--success'
                      : ''
                  }`}
                  onClick={handleSave}
                  disabled={saving}
                >

                  {saving ? (
                    <>
                      <span className="clientinfo-button-spinner" />
                      Salvando...
                    </>
                  ) : saveSuccess ? (
                    <>
                      <FaCheck />
                      Alterações salvas
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Salvar alterações
                    </>
                  )}

                </button>

                {saveSuccess && (
                  <div className="clientinfo-success-message">
                    <FaCheckCircle />
                    <span>
                      Suas informações foram atualizadas
                      com sucesso.
                    </span>
                  </div>
                )}

              </div>

            </div>

          </div>

        </div>
      )}
    </>
  );
}

export default ClientAccInfo;
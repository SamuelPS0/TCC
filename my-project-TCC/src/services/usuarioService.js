import axios from 'axios';

const API_BASE_URL =
  'http://localhost:8080/api/v1';

console.log(
  '[usuarioService] API_BASE_URL:',
  API_BASE_URL
);

export const normalizeStatusUsuario = (
  status,
  fallback = 'INATIVO'
) => {
  const normalized = String(
    status ?? fallback
  )
    .trim()
    .toUpperCase();

  if (normalized === 'ATIVO') {
    return 'ATIVO';
  }

  if (normalized === 'INATIVO') {
    return 'INATIVO';
  }

  if (normalized === 'TROCAR_SENHA') {
    return 'TROCAR_SENHA';
  }

  return fallback;
};

/*
 * O backend utiliza USER.
 * O frontend utiliza CLIENTE.
 */
export const normalizeNivelAcessoUsuario = (
  nivel,
  fallback = ''
) => {
  const normalized = String(
    nivel ?? fallback
  )
    .trim()
    .toUpperCase();

  if (normalized === 'USER') {
    return 'CLIENTE';
  }

  if (normalized === 'CLIENTE') {
    return 'CLIENTE';
  }

  if (normalized === 'ADMIN') {
    return 'ADMIN';
  }

  return fallback;
};

/*
 * Converte o nível usado visualmente pelo frontend
 * para o nível esperado pelo backend.
 */
export const nivelAcessoParaBackend = (
  nivel
) => {
  const normalized = String(
    nivel ?? ''
  )
    .trim()
    .toUpperCase();

  if (normalized === 'CLIENTE') {
    return 'USER';
  }

  if (normalized === 'USER') {
    return 'USER';
  }

  if (normalized === 'ADMIN') {
    return 'ADMIN';
  }

  return normalized;
};

export const getUsuarioEmail = (
  usuario = {}
) => {
  return usuario.username || usuario.email || '';
};

const buildUsuarioFormData = (
  usuario,
  file
) => {
  console.log(
    '[usuarioService] Construindo FormData.'
  );

  console.log(
    '[usuarioService] Dados do usuário:',
    usuario
  );

  console.log(
    '[usuarioService] Arquivo recebido:',
    file
  );

  const body = new FormData();

  body.append(
    'usuario',
    new Blob(
      [JSON.stringify(usuario)],
      {
        type: 'application/json'
      }
    )
  );

  if (file) {
    console.log(
      '[usuarioService] Adicionando arquivo ao FormData.'
    );

    body.append(
      'file',
      file
    );
  } else {
    console.log(
      '[usuarioService] Nenhum arquivo enviado.'
    );
  }

  return body;
};

export const usuarioService = {

  me() {
    const url =
      `${API_BASE_URL}/usuario/me`;

    console.log(
      '[usuarioService.me] GET:',
      url
    );

    return axios.get(url, {
      withCredentials: true
    });
  },

  listarTodos() {
    const url =
      `${API_BASE_URL}/usuario/all`;

    console.log(
      '[usuarioService.listarTodos] GET:',
      url
    );

    return axios.get(url, {
      withCredentials: true
    });
  },

  buscarPorId(id) {
    const url =
      `${API_BASE_URL}/usuario/${id}`;

    console.log(
      '[usuarioService.buscarPorId] GET:',
      url
    );

    return axios.get(url, {
      withCredentials: true
    });
  },

  editar(id, usuario, file) {
    const url =
      `${API_BASE_URL}/usuario/${id}`;

    console.log(
      '[usuarioService.editar] PUT:',
      url
    );

    console.log(
      '[usuarioService.editar] ID:',
      id
    );

    console.log(
      '[usuarioService.editar] Usuário:',
      usuario
    );

    const formData =
      buildUsuarioFormData(
        usuario,
        file
      );

    console.log(
      '[usuarioService.editar] Enviando FormData.'
    );

    return axios.put(
      url,
      formData,
      {
        headers: {
          'Content-Type':
            'multipart/form-data'
        },
        withCredentials: true
      }
    );
  },

  alterarSenha(
    id,
    newPassword
  ) {
    const url =
      `${API_BASE_URL}/usuario/${id}/alterar-senha`;

    console.log(
      '[usuarioService.alterarSenha] PUT:',
      url
    );

    console.log(
      '[usuarioService.alterarSenha] ID:',
      id
    );

    console.log(
      '[usuarioService.alterarSenha] Nova senha enviada: [OCULTA]'
    );

    return axios.put(
      url,
      null,
      {
        params: {
          newPassword
        },
        withCredentials: true
      }
    );
  },

  ativar(id) {
    const url =
      `${API_BASE_URL}/usuario/${id}/ativar`;

    console.log(
      '[usuarioService.ativar] PUT:',
      url
    );

    return axios.put(
      url,
      null,
      {
        withCredentials: true
      }
    );
  },

  inativar(id) {
    const url =
      `${API_BASE_URL}/usuario/${id}/inativar`;

    console.log(
      '[usuarioService.inativar] PUT:',
      url
    );

    return axios.put(
      url,
      null,
      {
        withCredentials: true
      }
    );
  }
};
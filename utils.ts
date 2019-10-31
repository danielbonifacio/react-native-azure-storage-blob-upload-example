export interface AuthorizedHeader {
  Authorization: string;
  [key: string]: string;
}

/**
 * Retorna o header de autenticação formatado
 * @param {String} token token do usuário logado
 */
const headerWithAuthorization = (token: String): AuthorizedHeader => ({
  Authorization: `Bearer ${token}`,
});

/**
 * Recupera o token do usuário logado (estado da aplicação)
 * @returns {String} token do usuário
 */
const getToken = () => {
  // TODO: recuperar o token do usuário logado
  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTU0MTgzOTcxNCIsImp0aSI6IjBmM2Y5ZDRkLTcyNWUtNDMzMy1hYmVmLTFmYTdhYmQ2MDY0OSIsImlhdCI6MTU3MjM1Nzk5OCwicm9sIjoiYXBpX2FjY2VzcyIsImlkIjoiNjU3MGY3MzQtMWYzMi00NzhlLTgxNTktMTA4MWU2OWNlYzIyIiwiaWR1IjoiNjc3ODYtMTM0MjYtODgwMzUtNjkxMzkiLCJuYmYiOjE1NzIzNTc5OTgsImV4cCI6MTY1ODc1Nzk5OCwiaXNzIjoid2ViQXBpIiwiYXVkIjoiTm9zc29HcnVwb0FwaSJ9.ywXVGprNVKtdIrKOOkFpoS8pdSNcyEJwQDKrSHPPUTg';
};

/**
 * Solicita a SAS a API para poder executar ações no blob storage
 */
export const getSAS = async (): Promise<String> => {
  return fetch(`${api()}/Auth/sasLogin`, {
    method: 'POST',
    headers: headerWithAuthorization(await getToken()),
  }).then(res => res.text());
};

/**
 * Retorna o link da API para o ambiente solicitado
 */
export const api = (): String => `https://api-ng-prd.azurewebsites.net/api`;

/**
 * Gera a URL para inserção do blob
 * @param {String} account nome da conta do azure storage
 * @param {String} container nome do container
 * @param {String} blobName nome (com exetensão) do blob
 * @param {String} token query string do token
 */
export const blob = (
  account: String,
  container: String,
  blobName: String,
  token: String,
): String =>
  `https://${account}.blob.core.windows.net/${container}/${blobName}${token}`;

/**
 * Gera um Unique ID seguindo a RFC4122 versão 4
 */
export const uuidv4 = (): String => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    // TODO: usar algo mais seguro que o Math.random, talvez o crypto
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

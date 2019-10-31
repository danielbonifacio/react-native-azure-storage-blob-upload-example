import {DocumentPickerResponse} from 'react-native-document-picker';

export interface DocumentPickerResponseEnhanced extends DocumentPickerResponse {
  length: Number;
}

export interface BlobStorageConnectionOptions {
  account: String;
  container: String;
  sas: String;
}

class AzureBlobStorage {
  private account: String;
  private container: String;
  private sas: String;

  constructor(props: BlobStorageConnectionOptions) {
    this.account = props.account;
    this.container = props.container;
    this.sas = props.sas;
  }

  getSAS() {
    return this.sas;
  }

  getAccount() {
    return this.account;
  }

  getContainer() {
    return this.container;
  }

  /**
   * Retorna a URL de insersção do blob
   *
   * @param {String} account Nome da conta do azure blob storage
   * @param {Strgin} container Nome do container onde o blob será inserido
   * @param {String} blob Nome (e extensão) do blob
   * @param {String} sas Query string do SAS
   */
  getBlockBlobUrl(
    account: String,
    container: String,
    blob: String,
    sas: String,
  ) {
    return `https://${account}.blob.core.windows.net/${container}/${blob}${sas}`;
  }

  /**
   * Retorna os headers corretamente formatados
   * @param {import('react-native-document-picker').DocumentPickerResponse} file
   */
  getHeadersFromFile(file: DocumentPickerResponseEnhanced) {
    return {
      'Content-Type': file.type,
      'Content-Length': file.length,
      'x-ms-blob-type': 'BlockBlob', // required
    };
  }

  /**
   * Cria (ou atualiza) um blob no storage
   *
   * Referência da API:
   * https://docs.microsoft.com/en-us/rest/api/storageservices/put-blob
   *
   * @param {import('react-native-document-picker').DocumentPickerResponse} file
   * @param {String} fileName
   * @returns {Promise<String>} Nome do arquivo
   */
  async createBlockBlob(file: any, fileName: String) {
    const sas = this.getSAS();
    const account = this.getAccount();
    const container = this.getContainer();

    const url = this.getBlockBlobUrl(account, container, fileName, sas);
    const method = 'PUT';

    const requestHeaders: HeadersInit_ = new Headers();
    requestHeaders.set('Content-Type', file.type);
    requestHeaders.set('Content-Length', file.length);
    requestHeaders.set('x-ms-blob-type', 'BlockBlob');

    try {
      const res = await fetch(url, {
        method,
        headers: requestHeaders,
        body: file,
      });

      // o status esperado é 201
      if (res.status === 201) {
        return fileName;
      } else {
        throw {
          message: `The response status wasn\'t the expected.\nExpected: 201\nReceived: ${res.status}`,
          response: res,
        };
      }
    } catch (err) {
      // TODO: implementar tratativa de erro
      throw err;
    }
  }
}

export default AzureBlobStorage;

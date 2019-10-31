import React, {useState} from 'react';
import {Button, Text, StyleSheet, View} from 'react-native';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';

import AzureBlobStorage from './AzureBlobStorage.class';

import {uuidv4, getSAS} from './utils';

const Upload = () => {
  const [status, setStatus] = useState('aguardando');

  /**
   * Abre o file picker padrão do dispositivo
   * permitindo múltipla seleção de arquivos.
   *
   * Atualmente arquivos de imagem e vídeo são permitidos.
   *
   * TODO: implementar regras de validação
   *
   * OBS: A API do Document Picker da um throw caso o usuárico
   * cancele a escolha (volte). A tratativa está implementada
   * dentro do catch (ver exemplo).
   *
   */
  const selectImages = async (): Promise<DocumentPickerResponse[]> => {
    try {
      return DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.images, DocumentPicker.types.video],
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('canceled');
        return [];
      } else {
        throw err;
      }
    }
  };

  /**
   * Faz o upload dos arquivos para o Azure Blob Storage
   * @param {import('react-native-document-picker').DocumentPickerResponse[]} files Arquivos selecionados do document picker
   * @returns {Promise<void>}
   */
  const uploadImages = async (files: DocumentPickerResponse[]) => {
    setStatus('Gerando um token SAS');
    const sas = await getSAS();

    const blobService = new AzureBlobStorage({
      account: 'storagenossogrupo',
      container: 'testefoto',
      sas,
    });

    files.forEach(async (file: DocumentPickerResponse) => {
      // recupera a extensão do arquivo
      const fileNameArray = file.name.split('.');
      const fileExtension = fileNameArray[fileNameArray.length - 1];

      // faz o upload do arquivo seguindo a API do azure
      setStatus('Fazendo upload...');
      await blobService.createBlockBlob(file, `${uuidv4()}.${fileExtension}`);
    });
    setStatus('Upload finalizado...');
  };

  /**
   * Macro do processo de upload: seleciona os arquivos e faz o upload
   */
  const handleSelectImages = async () => {
    try {
      setStatus('aguardando');
      const images = await selectImages();
      images && uploadImages(images);
    } catch (err) {
      // TODO: Implementar ação do catch
    }
  };

  return (
    <>
      <Button title="Selecionar imagens" onPress={handleSelectImages} />
      <View style={styles.status}>
        <Text>{status}</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  status: {
    alignItems: 'center',
    marginTop: 18,
    width: '100%',
  },
});

export default Upload;

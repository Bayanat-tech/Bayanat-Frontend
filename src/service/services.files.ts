import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { IApiResponse } from 'types/types.services';
import axiosServices from 'utils/axios';

class FileUploadService {
  uploadFile = async (file: Blob | File, filename?: string) => {
    try {
      const chatFileUpload = new FormData();
      chatFileUpload.append(`file`, file);
      const response: IApiResponse<any> = await axiosServices.post('api/files/upload', chatFileUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response) {
        dispatch(
          openSnackbar({
            open: true,
            message: `Uploaded successfully`,
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: true
          })
        );
        return response.data;
      }
    } catch (error) {
      dispatch(
        openSnackbar({
          open: true,
          message: `The media was not uploaded.`,
          variant: 'alert',
          alert: {
            color: 'error'
          },
          close: true
        })
      );
    }
  };
  getFile = async (request_number?: string) => {
    try {
      const response: IApiResponse<any> = await axiosServices.get(`api/files/${request_number}`);
      if (response) {
        return response.data.data;
      }
    } catch (error) {
      dispatch(
        openSnackbar({
          open: true,
          message: error,
          variant: 'alert',
          alert: {
            color: 'error'
          },
          close: true
        })
      );
    }
  };
  deleteFile = async (file_name?: string) => {
    try {
      const response: IApiResponse<any> = await axiosServices.get(`api/files/delete?file_name=${file_name}`);
      if (response) {
        return response.data.data;
      }
    } catch (error) {
      dispatch(
        openSnackbar({
          open: true,
          message: error,
          variant: 'alert',
          alert: {
            color: 'error'
          },
          close: true
        })
      );
    }
  };
  exportFile = (master: string) => {
    return new Promise((resolve, reject) => {
      axiosServices
        .get(`/api/files/export?master=${master}`)
        .then((response) => {
          if (response.data) {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${master}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            resolve(true);
          } else {
            reject(response);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
}

const FileUploadServiceInstance = new FileUploadService();
export default FileUploadServiceInstance;

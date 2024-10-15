import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import axiosServices from 'utils/axios';
import { v4 as uuidv4 } from 'uuid';
import { removeExtension } from 'utils/functions';
import { IResponse } from 'types/types.services';

class FileUploadService {
  uploadFile = async (file: Blob | File, filename?: string) => {
    try {
      const originalFileType = file.type.split('/')[1];
      const chatFileUpload = new FormData();
      const customFileName = `/zippfleet-file-${removeExtension(filename ?? (file as File).name)}-&-${uuidv4()}.${originalFileType}`;
      chatFileUpload.append(`file`, file, customFileName);

      const response: IResponse = await axiosServices.post('api/widget/upload', chatFileUpload, {
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
}

const FileUploadServiceInstance = new FileUploadService();
export default FileUploadServiceInstance;

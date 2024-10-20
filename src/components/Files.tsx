import { FileOutlined, InboxOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Stack, Typography } from '@mui/material';
import useAuth from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import FileUploadServiceInstance from 'service/services.files';
import { useSelector } from 'store';
import { TFile } from 'types/types.file';
import MediaList from './MediaList';
import { useLocation } from 'react-router';
import { getPathNameList } from 'utils/functions';

const Files = ({
  existingFilesData,
  request_number,
  filesData,
  setFilesData
}: {
  existingFilesData: any[];
  request_number: string;
  filesData: TFile[];
  setFilesData: React.Dispatch<React.SetStateAction<TFile[]>>;
}) => {
  //------------------------constants---------------
  const [isFileUploading, setIsFileUploading] = useState<boolean>(false);
  const { app } = useSelector((state) => state.menuSelectionSlice);
  const location = useLocation(),
    pathNameList = getPathNameList(location.pathname);

  const { user } = useAuth();

  //---------------handlers-------------
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setIsFileUploading(true);
      const FilesData = Object.values(event.target.files);
      await Promise.all(
        FilesData.map(async (eachFile) => {
          const response = await FileUploadServiceInstance.uploadFile(eachFile);
          if (response && response.data) {
            setFilesData((prevData) => [
              ...prevData,
              {
                aws_file_locn: response.data,
                extensions: eachFile.type.split('/')[1],
                company_code: user?.company_code as string,
                request_number: pathNameList[pathNameList.length - 1].slice(0, 3).toUpperCase() + request_number,
                org_file_name: eachFile.name,
                modules: app
              }
            ]);
          }
        })
      );

      setIsFileUploading(false);
    }
  };
  //--------------------------useEffects-----------------
  useEffect(() => {
    if (!!existingFilesData && existingFilesData.length > 0) setFilesData(existingFilesData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingFilesData]);

  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <input style={{ display: 'none' }} id="upload-file" type="file" onChange={handleFileUpload} />
        <label htmlFor="upload-file">
          <Button
            variant="dashed"
            color="primary"
            component="span"
            startIcon={isFileUploading ? <LoadingOutlined /> : <FileOutlined />}
            disabled={isFileUploading}
          >
            Upload
          </Button>
        </label>
      </div>
      <div>
        {filesData.length > 0 ? (
          <MediaList mediaData={filesData} setFilesData={setFilesData} />
        ) : (
          <div className="w-full flex items-center justify-center h-96">
            <Stack className="mt-4">
              <InboxOutlined style={{ width: 50, height: 20, transform: 'scale(3)', color: 'GrayText' }} />
              <Typography color={'GrayText'}>No Data</Typography>
            </Stack>
          </div>
        )}
      </div>
    </div>
  );
};

export default Files;

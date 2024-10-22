import { DeleteOutlined, EyeFilled } from '@ant-design/icons';
import { ButtonGroup, IconButton, ImageListItem, ImageListItemBar, Typography } from '@mui/material';
import FileUploadServiceInstance from 'service/services.files';
import { TFile } from 'types/types.file';
import { getFileNameFromURL } from 'utils/functions';
import CustomTooltip from './CustomTooltip';
import { universalRenderMedia } from './UniversalRenderMedia';

const MediaList = ({ mediaData, setFilesData }: { mediaData: TFile[]; setFilesData: React.Dispatch<React.SetStateAction<TFile[]>> }) => {
  //----------------handlers----------------
  const handleDelete = async (index: number, file_name?: string) => {
    if (file_name !== undefined) {
      await FileUploadServiceInstance.deleteFile(file_name);
    }
    setFilesData((prevFiles) => prevFiles.filter((eachFile: TFile, eachFileIndex: number) => eachFileIndex !== index));
  };

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2">
      {mediaData?.map((eachFile, index) => (
        <ImageListItem
          key={getFileNameFromURL(eachFile.aws_file_locn)}
          className="border border-gray rounded-sm"
          style={{ minHeight: '200px', maxHeight: '280px' }}
        >
          {universalRenderMedia(eachFile.aws_file_locn, index)}
          <ImageListItemBar
            position={'bottom'}
            sx={{ opacity: 1 }}
            title={
              <CustomTooltip message={eachFile?.org_file_name ?? ''} props={{ placement: 'left' }}>
                <Typography className="font-semibold text-md">{eachFile?.org_file_name}</Typography>
              </CustomTooltip>
            }
            actionIcon={
              <ButtonGroup>
                <IconButton size="medium" color="error">
                  <DeleteOutlined onClick={() => handleDelete(index, eachFile.file_name ?? undefined)} />
                </IconButton>
                <IconButton size="medium" color="info" LinkComponent={'a'} href={eachFile.aws_file_locn} target="_blank">
                  <EyeFilled />
                </IconButton>
                {/* <IconButton size="medium" color="success" onClick={() => handleDownload(eachFile.aws_file_locn)}>
                  <DownloadOutlined />
                </IconButton> */}
              </ButtonGroup>
            }
            actionPosition="right"
          />
        </ImageListItem>
      ))}
    </div>
  );
};

export default MediaList;

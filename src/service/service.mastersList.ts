import { IApiResponse } from 'types/types.services';
import axiosServices from 'utils/axios';

class MasterList {
  getMastersList = async ({ level2 }: { level2: string }) => {
    try {
      const response: IApiResponse<{ label: string; value: string }[]> = await axiosServices.get(`api/get-masters/${level2}`);
      if (response.data.success) return response.data.data;
    } catch (error) {}
  };
}
const MasterListInstance = new MasterList();
export default MasterListInstance;

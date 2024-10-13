import { ISearch } from 'components/filters/SearchFilter';
import { IApiResponse } from 'types/types.services';
import axiosServices from 'utils/axios';

class Wms {
  getMasters = async (app_code: string, master: string, paginationData?: any | null, searchData?: ISearch | null) => {
    try {
      console.log(master);

      const response: IApiResponse<{ tableData: unknown[]; count: number }> = await axiosServices.get(`api/${app_code}/${master}`);
      if (response.data.success) {
        return response.data.data;
      }
    } catch (error) {}
  };
  //-------------------------------General Master(GM)---------------------
}

const WmsSerivceInstance = new Wms();
export default WmsSerivceInstance;

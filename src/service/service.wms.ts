import { ISearch } from 'components/filters/SearchFilter';
import { IApiResponse } from 'types/types.services';
import axiosServices from 'utils/axios';

class Wms {
  getMasters = async (
    app_code: string,
    master: string,
    paginationData?: { page: number; rowsPerPage: number },
    searchData?: ISearch | null
  ) => {
    try {
      console.log(master);
      const page = paginationData && paginationData?.page + 1;
      const limit = paginationData && paginationData?.rowsPerPage;
      const response: IApiResponse<{ tableData: unknown[]; count: number }> = await axiosServices.get(`api/${app_code}/${master}`, {
        params: {
          ...(page && { page }),
          ...(limit && { limit })
        }
      });
      if (response.data.success) {
        return response.data.data;
      }
    } catch (error) {}
  };
  //-------------------------------General Master(GM)---------------------
}

const WmsSerivceInstance = new Wms();
export default WmsSerivceInstance;

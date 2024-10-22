import { ISearch } from 'components/filters/SearchFilter';
import { IApiResponse } from 'types/types.services';
import axiosServices from 'utils/axios';

class pf {
  getMasters = async (
    app_code: string,
    master: string,
    paginationData?: { page: number; rowsPerPage: number },
    searchData?: ISearch | null
  ) => {
    try {
      const page = paginationData && paginationData?.page + 1;
      const limit = paginationData && paginationData?.rowsPerPage;
      //console.log(app_code);
      //console.log(master);

      // app_code = 'pf';
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

const PfSerivceInstance = new pf();
export default PfSerivceInstance;
import { Autocomplete, Stack, TextField } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import useAuth from 'hooks/useAuth';
import { SyntheticEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import MasterListInstance from 'service/service.mastersList';
import { dispatch, useSelector } from 'store';
import { setSelectedLevel2Item } from 'store/reducers/customReducer/slice.menuSelectionSlice';
import { getPathNameList } from 'utils/functions';

const MasterSelectionAutoComplete = () => {
  //---------------------------Constants-----------------

  const navigate = useNavigate();
  const location = useLocation();
  const [pathnameList, setPathNameList] = useState<string[]>(null as unknown as string[]);
  const { master } = useParams();
  const { level2 } = useSelector((state) => state.menuSelectionSlice);
  console.log(master);

  const { user_permission, permissions } = useAuth();

  //--------------------useQuery----------------------
  const { data: mastersList } = useQuery({
    queryKey: ['master_list', master],
    queryFn: () => MasterListInstance.getMastersList({ level2 }),
    enabled: !!level2 && !(!!master && !!master.length),
    refetchOnWindowFocus: false
  });

  //-----------------------useEffects------------------

  useEffect(() => {
    setPathNameList(getPathNameList(location.pathname));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (pathnameList?.length > 1 && pathnameList[2] !== level2) {
      dispatch(setSelectedLevel2Item(pathnameList[2]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathnameList]);
  useEffect(() => {
    if (!!mastersList && !!pathnameList && pathnameList.length === 3) {
      console.log('default', mastersList[0]);

      navigate(`/${pathnameList.join('/')}/${mastersList[0].value}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mastersList]);

  //--------------------------Handlers-------------------

  const handleMasterFilterChange = (event: SyntheticEvent<Element, Event>, newValue: { label: string; value: string }) => {
    navigate(`/${pathnameList.splice(0, 3).join('/')}/${newValue.value}`);
  };

  console.log(mastersList);

  return (
    <Stack spacing={3}>
      {!!mastersList && mastersList.length > 0 && (
        <Autocomplete
          id="masters"
          value={
            (mastersList ?? []).find((eachMaster) => {
              return master === eachMaster.value;
            }) || { label: '', value: '' }
          }
          disableClearable
          isOptionEqualToValue={(option, optionValue) => {
            return option.value === optionValue.value;
          }}
          getOptionLabel={(option) => option.label}
          onChange={handleMasterFilterChange}
          options={(mastersList ?? []).filter((eachMaster) => user_permission?.includes(permissions[eachMaster.value].serial_number))}
          renderInput={(params) => <TextField required {...params} />}
        />
      )}
      {/* {renderMaster(reportData)} */}
    </Stack>
  );
};

export default MasterSelectionAutoComplete;

import { useNavigate } from 'react-router';
import { dispatch } from 'store';
import { setSelectedApp } from 'store/reducers/customReducer/slice.menuSelectionSlice';
import { NavItemType } from 'types/menu';

const AppIcon = ({ item }: { item: NavItemType }) => {
  const IconComponent = item.icon;
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col  cursor-pointer p-4 rounded-sm shadow-sm border "
      onClick={() => {
        dispatch(setSelectedApp(item.url_path));
        navigate(`${item.url_path}`);
      }}
    >
      {IconComponent ? (
        <IconComponent
          style={{
            fontSize: 20,
            stroke: '1.5'
          }}
        />
      ) : (
        <></>
      )}
      <span>{item.title}</span>
    </div>
  );
};
export default AppIcon;

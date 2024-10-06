import { useNavigate } from 'react-router';
import { dispatch } from 'store';
import { setSelectedApp } from 'store/reducers/customReducer/slice.menuSelectionSlice';
import { NavItemType } from 'types/menu';
import IconComponent from './IconComponent';
import { SunOutlined } from '@ant-design/icons';
import { iconMapping } from 'utils/constants';

const AppIcon = ({ item }: { item: NavItemType }) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col  cursor-pointer p-4 rounded-sm shadow-sm border "
      onClick={() => {
        dispatch(setSelectedApp(item.url_path));
        navigate(`${item.url_path}`);
      }}
    >
      {item.icon ? (
        <IconComponent icon={item.icon as keyof typeof iconMapping} style={{ fontSize: 20 }} />
      ) : (
        <>
          <SunOutlined />
        </>
      )}
      <span>{item.title}</span>
    </div>
  );
};
export default AppIcon;

import { useDispatch } from 'react-redux';

import ListWithOptions from '../shared/ListWithOptions';
import { ThemeType } from '../../redux/reducers/settingsReducer';
import { updateSetting } from '../../redux/actions';
import { useSetting } from '../../redux/selectors';

const ListItemTheme = () => {
  const dispatch = useDispatch();
  const setting = useSetting('theme');
  const options = Object.values(ThemeType);
  const selectedIndex = options.indexOf(setting);

  return (
    <ListWithOptions
      title="Theme"
      optionLabels={options}
      selectedIndex={selectedIndex}
      setSelectedIndex={(newIndex) =>
        dispatch(updateSetting({ theme: options[newIndex] }))
      }
    />
  );
};

export default ListItemTheme;

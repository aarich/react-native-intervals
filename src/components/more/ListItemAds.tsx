import { ListItem, Toggle } from '@ui-kitten/components';
import { useDispatch } from 'react-redux';

import { AdType } from '../../redux/reducers/settingsReducer';
import { updateSetting } from '../../redux/actions';
import { useSetting } from '../../redux/selectors';

const ListItemAds = () => {
  const dispatch = useDispatch();
  const setting = useSetting('ads');

  return (
    <ListItem
      disabled
      title="Show Ads"
      description="Support the developer!"
      accessoryRight={() => (
        <Toggle
          style={{ paddingRight: 10 }}
          checked={setting !== AdType.Off}
          onChange={() =>
            dispatch(
              updateSetting({
                ads: setting === AdType.Off ? AdType.On : AdType.Off,
              })
            )
          }
        />
      )}
    />
  );
};

export default ListItemAds;

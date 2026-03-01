import { ListItem, Toggle } from '@ui-kitten/components';
import { useDispatch } from 'react-redux';

import {
  AnySetting,
  BooleanSettings,
} from '../../redux/reducers/settingsReducer';
import { updateSetting } from '../../redux/actions';
import { useSetting } from '../../redux/selectors';

const labels = {
  countUp: 'Timers Count Up',
  showTotalTime: 'Show Total Time',
  hideDescription: 'Hide Description (saves space)',
  hideLiveActivity: 'Show Live Activity',
};

const INVERTED_SETTINGS = ['hideLiveActivity'];

const ListItemToggle = ({ setting }: { setting: keyof BooleanSettings }) => {
  const dispatch = useDispatch();
  const on = useSetting(setting);
  const shouldInvert = INVERTED_SETTINGS.includes(setting);

  return (
    <ListItem
      disabled
      title={labels[setting]}
      accessoryRight={() => (
        <Toggle
          style={{ paddingRight: 10 }}
          checked={shouldInvert ? !on : on}
          onChange={(nextChecked) =>
            dispatch(
              updateSetting({
                [setting]: shouldInvert ? !nextChecked : nextChecked,
              } as AnySetting),
            )
          }
        />
      )}
    />
  );
};

export default ListItemToggle;

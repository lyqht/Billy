import {
  Autocomplete,
  AutocompleteItem,
  Icon,
  IconProps,
} from '@ui-kitten/components';
import {RenderProp} from '@ui-kitten/components/devsupport';
import React from 'react';
import {
  ImageProps,
  Keyboard,
  KeyboardEventName,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import {defaultCategoryIcons} from '../../constants/PayeeOptions';
import {Category} from '../../types/AutocompleteOption';

const showEvent: KeyboardEventName = Platform.select({
  android: 'keyboardDidShow',
  default: 'keyboardWillShow',
});

const hideEvent: KeyboardEventName = Platform.select({
  android: 'keyboardDidHide',
  default: 'keyboardWillHide',
});

const filter = (item: string, query: string) =>
  item.toLowerCase().includes(query.toLowerCase());

const getIconName = (option: string) => {
  if (Object.keys(defaultCategoryIcons).includes(option)) {
    const key = option as Category;
    return defaultCategoryIcons[key];
  }

  return 'person-outline';
};

const ItemAccesoryIcon: RenderProp<IconProps> = props => (
  <Icon {...props} name={getIconName(props.item)} />
); //TODO: use filled version if it is custom dropdown option by user

const renderOption = (item: string, index: number) => (
  <AutocompleteItem
    key={`autocomplete-item-${index}-${item}`}
    title={item}
    accessoryLeft={props => ItemAccesoryIcon({...props, item})}
  />
);
interface Props {
  label: string;
  placeholder: string;
  icon: string;
  value: string;
  options: string[];
  onChange: (x: string) => void;
}

export const CustomAutoComplete: React.FC<Props> = props => {
  const {label, icon, value, options, placeholder, onChange} = props;
  const [data, setData] = React.useState(options);
  const [placement, setPlacement] = React.useState('bottom');

  React.useEffect(() => {
    const keyboardShowListener = Keyboard.addListener(showEvent, () => {
      setPlacement('top');
    });

    const keyboardHideListener = Keyboard.addListener(hideEvent, () => {
      setPlacement('bottom');
    });

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  });

  const onChangeText = (query: string) => {
    onChange(query);
    setData(options.filter(item => filter(item, query)));
  };

  const accessoryRight: RenderProp<Partial<ImageProps>> = iconProps => {
    if (value) {
      return (
        <TouchableWithoutFeedback onPress={clearInput}>
          <Icon {...iconProps} name="close" />
        </TouchableWithoutFeedback>
      );
    }

    return <Icon {...iconProps} name={icon} />;
  };

  const clearInput = () => {
    onChange('');
    setData(options);
  };

  const autocompleteProps = {label, icon, value, placeholder, accessoryRight};

  return (
    <Autocomplete
      {...autocompleteProps}
      value={value}
      onChangeText={onChangeText}
      placement={placement}
      onSelect={index => onChange(data[index])}
    >
      {data.map(renderOption)}
    </Autocomplete>
  );
};

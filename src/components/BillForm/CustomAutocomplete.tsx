import {Autocomplete, AutocompleteItem, Icon} from '@ui-kitten/components';
import {RenderProp} from '@ui-kitten/components/devsupport';
import React from 'react';
import {
  ImageProps,
  Keyboard,
  KeyboardEventName,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import {testAutocompleteItems} from '../../mocks/bills';

interface Item {
  title: string;
}

const showEvent: KeyboardEventName = Platform.select({
  android: 'keyboardDidShow',
  default: 'keyboardWillShow',
});

const hideEvent: KeyboardEventName = Platform.select({
  android: 'keyboardDidHide',
  default: 'keyboardWillHide',
});

const filter = (item: Item, query: string) =>
  item.title.toLowerCase().includes(query.toLowerCase());

const ItemAccesoryIcon = props => <Icon {...props} name="pricetags-outline" />;
const renderOption = (item: Item, index: number) => (
  <AutocompleteItem
    key={`autocomplete-item-${index}-${item.title}`}
    title={item.title}
    accessoryLeft={ItemAccesoryIcon}
  />
);
interface Props {
  label: string;
  placeholder: string;
  icon: string;
  value: string;
  onChange: (x: string) => void;
}

export const CustomAutoComplete: React.FC<Props> = props => {
  const {label, icon, value, placeholder, onChange} = props;
  const [data, setData] = React.useState(testAutocompleteItems);
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
    setData(testAutocompleteItems.filter(item => filter(item, query)));
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
    setData(testAutocompleteItems);
  };

  const autocompleteProps = {label, icon, value, placeholder, accessoryRight};

  return (
    <Autocomplete
      {...autocompleteProps}
      value={value}
      onChangeText={onChangeText}
      placement={placement}
      onSelect={index => onChange(data[index].title)}>
      {data.map(renderOption)}
    </Autocomplete>
  );
};

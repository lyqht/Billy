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

interface Props {
  label: string;
  placeholder: string;
  icon: string;
}

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

export const CustomAutoComplete: React.FC<Props> = ({icon, ...props}) => {
  const [value, setValue] = React.useState<string>('');
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
    setValue(query);
    setData(testAutocompleteItems.filter(item => filter(item, query)));
  };

  const AccessoryIcon: RenderProp<Partial<ImageProps>> = iconProps => (
    <Icon {...iconProps} name={icon} />
  );

  const accessoryRight: RenderProp<Partial<ImageProps>> = iconProps => {
    return (
      <TouchableWithoutFeedback onPress={clearInput}>
        <Icon {...iconProps} name="close" />
      </TouchableWithoutFeedback>
    );
  };

  const clearInput = () => {
    setValue('');
    setData(testAutocompleteItems);
  };

  const extraProps = {...props, ...(value && accessoryRight)};

  return (
    <Autocomplete
      {...extraProps}
      value={value}
      accessoryRight={AccessoryIcon}
      onChangeText={onChangeText}
      placement={placement}
      onSelect={index => setValue(data[index].title)}>
      {data.map(renderOption)}
    </Autocomplete>
  );
};

/**
 * Original component is written by artyosh at this gist
 * https://gist.github.com/artyorsh/f9846c93e42a5ed45364ea747d0c4101
 * I have modified to to use dayjs in some places and fit Billy's use
 */

import React from 'react';
import {
  GestureResponderEvent,
  ImageProps,
  StyleProp,
  StyleSheet,
  TouchableOpacityProps,
  View,
  ViewProps,
  ViewStyle,
  Platform,
} from 'react-native';
import DateTimePicker, {
  TimePickerOptions,
} from '@react-native-community/datetimepicker';
import {
  EvaInputSize,
  EvaStatus,
  FalsyFC,
  FalsyText,
  RenderProp,
  TouchableWithoutFeedback,
} from '@ui-kitten/components/devsupport';
import {PopoverPlacement} from '@ui-kitten/components/ui/popover/type';
import dayjs from 'dayjs';
import {
  Interaction,
  StyledComponentProps,
  StyleType,
  TextProps,
  styled,
  Card,
  Popover,
  PopoverPlacements,
  DateService,
  NativeDateService,
} from '@ui-kitten/components';

type TimePickerOmitChangeProps = Omit<TimePickerOptions, 'onChange'>;
type TimePickerOmitProps = Omit<TimePickerOmitChangeProps, 'value'>;

export interface TimepickerProps<D = Date>
  extends StyledComponentProps,
    TouchableOpacityProps,
    TimePickerOmitProps {
  controlStyle?: StyleProp<ViewStyle>;
  date?: D;
  label?: RenderProp<TextProps> | React.ReactText;
  caption?: RenderProp<TextProps> | React.ReactText;
  captionIcon?: RenderProp<Partial<ImageProps>>;
  accessoryLeft?: RenderProp<Partial<ImageProps>>;
  accessoryRight?: RenderProp<Partial<ImageProps>>;
  status?: EvaStatus;
  size?: EvaInputSize;
  placeholder?: RenderProp<TextProps> | React.ReactText;
  placement?: PopoverPlacement | string;
  backdropStyle?: StyleProp<ViewStyle>;
  onSelect?: (date: D) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  dateService?: DateService<D>;
}

interface State {
  visible: boolean;
}

@styled('Timepicker')
class CustomTimePicker<P> extends React.Component<TimepickerProps & P, State> {
  static defaultProps: Partial<TimepickerProps> = {
    placement: PopoverPlacements.BOTTOM_START,
    dateService: new NativeDateService(),
  };

  public state: State = {
    visible: false,
  };

  private get title(): RenderProp<TextProps> | React.ReactText | undefined {
    const formattedDate =
      this.props.date && dayjs(this.props.date).format('hh:mm a');
    return formattedDate || this.props.placeholder;
  }

  private getComponentStyle = (style: StyleType) => {
    const {
      textMarginHorizontal,
      textFontFamily,
      textFontSize,
      textFontWeight,
      textColor,
      placeholderColor,
      iconWidth,
      iconHeight,
      iconMarginHorizontal,
      iconTintColor,
      labelColor,
      labelFontSize,
      labelMarginBottom,
      labelFontWeight,
      labelFontFamily,
      captionMarginTop,
      captionColor,
      captionFontSize,
      captionFontWeight,
      captionFontFamily,
      captionIconWidth,
      captionIconHeight,
      captionIconMarginRight,
      captionIconTintColor,
      popoverWidth,
      ...controlParameters
    } = style;

    return {
      control: controlParameters,
      captionContainer: {
        marginTop: captionMarginTop,
      },
      text: {
        marginHorizontal: textMarginHorizontal,
        fontFamily: textFontFamily,
        fontSize: textFontSize,
        fontWeight: textFontWeight,
        color: textColor,
      },
      placeholder: {
        marginHorizontal: textMarginHorizontal,
        color: placeholderColor,
      },
      icon: {
        width: iconWidth,
        height: iconHeight,
        marginHorizontal: iconMarginHorizontal,
        tintColor: iconTintColor,
      },
      label: {
        color: labelColor,
        fontSize: labelFontSize,
        fontFamily: labelFontFamily,
        marginBottom: labelMarginBottom,
        fontWeight: labelFontWeight,
      },
      captionIcon: {
        width: captionIconWidth,
        height: captionIconHeight,
        tintColor: captionIconTintColor,
        marginRight: captionIconMarginRight,
      },
      captionLabel: {
        fontSize: captionFontSize,
        fontWeight: captionFontWeight,
        fontFamily: captionFontFamily,
        color: captionColor,
      },
      popover: {
        width: popoverWidth,
        marginBottom: captionMarginTop,
      },
    };
  };

  private onPress = (event: GestureResponderEvent): void => {
    this.setPickerVisible();
    this.props.onPress && this.props.onPress(event);
  };

  private onPressIn = (event: GestureResponderEvent): void => {
    // @ts-ignore
    this.props.eva.dispatch([Interaction.ACTIVE]);
    this.props.onPressIn && this.props.onPressIn(event);
  };

  private onPressOut = (event: GestureResponderEvent): void => {
    // @ts-ignore
    this.props.eva.dispatch([]);
    this.props.onPressOut && this.props.onPressOut(event);
  };

  private onValueChange = (_event: any, value?: Date): void => {
    Platform.OS !== 'ios' && this.setPickerInvisible();
    value && this.props.onSelect && this.props.onSelect(value);
  };

  private onPickerVisible = (): void => {
    // @ts-ignore
    this.props.eva.dispatch([Interaction.ACTIVE]);
    this.props.onFocus && this.props.onFocus();
  };

  private onPickerInvisible = (): void => {
    // @ts-ignore
    this.props.eva.dispatch([]);
    this.props.onBlur && this.props.onBlur();
  };

  private setPickerVisible = (): void => {
    this.setState({visible: true}, this.onPickerVisible);
  };

  private setPickerInvisible = (): void => {
    this.setState({visible: false}, this.onPickerInvisible);
  };

  private renderPickerDefault = (): React.ReactElement => {
    return (
      <DateTimePicker
        mode="time"
        display={'inline'}
        value={(this.props.date as Date) || new Date()}
        onChange={this.onValueChange}
      />
    );
  };

  private renderPickerIOS = (): React.ReactElement => {
    return <Card disabled={true}>{this.renderPickerDefault()}</Card>;
  };

  private renderInputDefault = (
    props: Partial<TimepickerProps>,
    evaStyle,
  ): React.ReactElement => {
    return (
      <TouchableWithoutFeedback
        {...props}
        style={[evaStyle.control, styles.control, props.controlStyle]}
        onPress={this.onPress}
        onPressIn={this.onPressIn}
        onPressOut={this.onPressOut}
      >
        <FalsyFC style={evaStyle.icon} component={props.accessoryLeft} />
        <FalsyText
          style={evaStyle.text}
          numberOfLines={1}
          ellipsizeMode="tail"
          component={this.title}
        />
        <FalsyFC style={evaStyle.icon} component={this.props.accessoryRight} />
      </TouchableWithoutFeedback>
    );
  };

  private renderInputIOS = (
    props: Partial<TimepickerProps>,
    evaStyle,
  ): React.ReactElement => {
    return (
      <Popover
        style={[evaStyle.popover, styles.popover]}
        backdropStyle={props.backdropStyle}
        fullWidth={true}
        placement={props.placement}
        visible={this.state.visible}
        anchor={() => this.renderInputDefault(props, evaStyle)}
        onBackdropPress={this.setPickerInvisible}
      >
        {this.renderPickerIOS()}
      </Popover>
    );
  };

  private renderInput = (
    props: Partial<TimepickerProps>,
    evaStyle,
  ): React.ReactElement => {
    return Platform.select({
      ios: this.renderInputIOS(props, evaStyle),
      default: this.renderInputDefault(props, evaStyle),
    });
  };

  public render(): React.ReactElement<ViewProps> {
    const {eva, style, label, caption, captionIcon, ...inputProps} = this.props;
    const evaStyle = this.getComponentStyle(eva?.style as StyleType);

    return (
      <React.Fragment>
        <View style={style}>
          <FalsyText style={[evaStyle.label, styles.label]} component={label} />
          {this.renderInput(inputProps, evaStyle)}
          <View style={[evaStyle.captionContainer, styles.captionContainer]}>
            <FalsyFC style={evaStyle.captionIcon} component={captionIcon} />
            <FalsyText
              style={[evaStyle.captionLabel, styles.captionLabel]}
              component={caption}
            />
          </View>
        </View>
        {Platform.OS !== 'ios' &&
          this.state.visible &&
          this.renderPickerDefault()}
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  popover: {
    borderWidth: 0,
  },
  control: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    textAlign: 'left',
  },
  captionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  captionLabel: {
    textAlign: 'left',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
});

export default CustomTimePicker;

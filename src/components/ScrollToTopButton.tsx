import {Button, Icon, List} from '@ui-kitten/components';
import React, {forwardRef} from 'react';

interface Props {
  toShowButton?: boolean;
}

const ScrollToTopButton = forwardRef<List, Props>(
  ({toShowButton = true}, ref) => {
    const scrollToTop = () => {
      if (ref?.current) {
        ref.current.scrollToOffset({animated: true, offset: 0});
      }
    };

    return toShowButton ? (
      <Button
        size={'large'}
        appearance={'ghost'}
        accessoryLeft={<Icon name="corner-left-up-outline" />}
        status={'basic'}
        onPress={() => {
          scrollToTop();
        }}
      >
        Scroll back to top
      </Button>
    ) : (
      <></>
    );
  },
);

export default ScrollToTopButton;

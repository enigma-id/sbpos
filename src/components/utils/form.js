import {View} from 'react-native';
import {Text} from '@ui-kitten/components';
import {Styles} from '../theme/styles';

const renderCaption = err => {
  if (!err) {
    return null;
  }

  return (
    <View style={[Styles.flex]}>
      <Text category="s1" status="danger">
        {err}
      </Text>
    </View>
  );
};

const renderTitle = ({val, required, mode}) => {
  if (!val) {
    return null;
  }

  return (
    <View style={[Styles.flex, Styles.mb2]}>
      <Text
        category="p1"
        style={[
          Styles.inputTitle,
          mode === 'light' ? Styles.textWhite : Styles.textSecondary,
        ]}>
        {val}{' '}
        {required ? (
          <Text category="p1" status="danger">
            *
          </Text>
        ) : null}
      </Text>
    </View>
  );
};

export {renderCaption, renderTitle};

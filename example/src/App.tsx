import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import { useCountRenders } from '@romerorickyio/react-native-core-utils';

export default function App() {
  useCountRenders('App.js.');

  return (
    <View style={styles.container}>
      <Text>Result</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});

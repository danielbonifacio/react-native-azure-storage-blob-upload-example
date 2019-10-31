import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import Upload from './Upload';

const App: React.FC = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.body}>
            <View style={{...styles.sectionContainer, ...styles.title}}>
              <Text style={styles.titleText}>
                {'Upload de imagens e vídeos'}
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Upload />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  title: {
    alignItems: 'center',
  },
  titleText: {
    fontSize: 22,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lighter,
  },
});

export default App;

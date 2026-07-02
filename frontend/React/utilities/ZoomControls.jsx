import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const ZoomControls = ({webViewRef, top, style}) => {
  const zoom = delta => {
    webViewRef.current?.injectJavaScript(`
      if (window.map) {
        window.map.setZoom(window.map.getZoom() + (${delta}));
      }
      true;
    `);
  };

  return (
    <View
      style={[
        {
          position: 'absolute',
          top,
          right: 12,
          zIndex: 40,
          backgroundColor: '#fff',
          borderRadius: 12,
          elevation: 8,
          shadowColor: '#000',
          shadowOpacity: 0.15,
          shadowRadius: 6,
          shadowOffset: {width: 0, height: 2},
          overflow: 'hidden',
        },
        style,
      ]}>
      <TouchableOpacity
        onPress={() => zoom(1)}
        activeOpacity={0.7}
        style={{
          width: 40,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
          borderBottomWidth: 1,
          borderBottomColor: '#eee',
        }}>
        <FontAwesome name="plus" size={16} color="#1a1a1a" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => zoom(-1)}
        activeOpacity={0.7}
        style={{
          width: 40,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <FontAwesome name="minus" size={16} color="#1a1a1a" />
      </TouchableOpacity>
    </View>
  );
};

export default ZoomControls;

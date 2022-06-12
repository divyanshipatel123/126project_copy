import * as React from 'react';
import { Text, View, StyleSheet, Button, Image, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

export default class PickImage extends React.Component {
  state = {
    image: null,
  };
  render() {
    var { image } = this.state;
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button
          title="Pick an image from the camera"
          onPress={this._pickImage}
        />
      </View>
    );
  }
  getPermissionAsync = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry we need camera roll permission to make this work');
      }
    }
  };
  componentDidMount() {
    this.getPermissionAsync();
  }

  _pickImage = async () => {
    try {
      var result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        this.setState({ image: result.data });
      }
      console.log(result.uri);
      this.uploadImage(result.uri);
    } catch (e) {
      console.log(e);
    }
  };

  uploadImage = async (uri) => {
    const data = new FormData();
    var file_name = uri.split('/')[uri.split('/').length - 1];
    var type = `image/${uri.split('.')[uri.split('.').lenght - 1]}`;
    const file_to_upload = {
      uri: uri,
      name: file_name,
      type: type,
    };
    data.append('alphabet', file_to_upload);
    fetch('https://29b4-202-148-59-135.in.ngrok.io/pred_alphabet', {
      method: 'POST',
      body: data,
      headers: { 'content-type': 'multipart/form-data' },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log('Success : ', result);
      })
      .catch((err) => {
        console.error(err);
      });
  };
}

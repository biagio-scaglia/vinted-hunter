import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as api from '../lib/api';

export function useOcr() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
      allowsEditing: true,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      setText('');
      setError(null);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.85,
      allowsEditing: true,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      setText('');
      setError(null);
    }
  };

  const extract = async () => {
    if (!imageUri) return;
    setLoading(true);
    setError(null);
    try {
      const filename = imageUri.split('/').pop() ?? 'image.jpg';
      const extracted = await api.ocr(imageUri, filename);
      setText(extracted);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'OCR fallito');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImageUri(null);
    setText('');
    setError(null);
  };

  return { imageUri, text, setText, loading, error, pickImage, takePhoto, extract, reset };
}

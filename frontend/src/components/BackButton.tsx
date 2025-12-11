import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export const BackButton = () => {
  return (
    <TouchableOpacity  onPress={()=>router.back()}>
      <Ionicons name="arrow-back" size={24} color="black" />
    </TouchableOpacity>
  )
}

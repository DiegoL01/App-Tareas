import React from 'react'
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';import { TouchableOpacity } from 'react-native';
import { useAuth } from '@/src/hooks/useAuth';  
export const LogOut = () => {
    const { logout } = useAuth();
    
    const handleLogout = async () => {
        await logout();
    };
  return (
    <TouchableOpacity className='mr-10' onPress={handleLogout}>
      <SimpleLineIcons name="logout" size={25} color="black" />
    </TouchableOpacity>
  )
}

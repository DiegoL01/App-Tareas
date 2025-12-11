import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
//type CenterTabButtonProps 
import { useRouter } from 'expo-router';

const CenterTabButton = () => {
   const router = useRouter();
    const handlePress = () => {
        try {
          router.push('/(tabs)/AddTask');
        } catch (err) {
            console.warn('CenterTabButton onPress error', err);
        }
    };

    return (
        <View style={styles.container} pointerEvents="box-none">
            <TouchableOpacity activeOpacity={0.85} onPress={handlePress} style={styles.button}>
                <Ionicons name="add-circle-sharp" size={56} color="#2563eb" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 25,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 10,
    },
    button: {
        width: 60,
        height: 60,
        borderRadius: 36,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        // shadow (iOS)
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        // elevation (Android)
        elevation: 10,
    },
});

export default CenterTabButton;

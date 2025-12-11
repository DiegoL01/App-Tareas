import { View, Text, Pressable, TouchableOpacity } from "react-native";
import { useAuth } from "../../src/hooks/useAuth";
import { useRouter} from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
// o Ionicons si prefieres


export default function CustomHeader() {
  const { state: {user}, logout } = useAuth();
  const router = useRouter();

  return (
    <View className="w-full flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
      
      {/* Back button */}
      <TouchableOpacity 
        className="p-2 rounded-full active:opacity-70"
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={22} color="#111" />
      </TouchableOpacity>

      {/* Title */}
      <Text className="text-lg font-semibold text-gray-900">
        Hola {user?.name}
      </Text>

      {/* Logout */}
      <TouchableOpacity
        className="p-2 rounded-full active:opacity-70"
        onPress={logout}
      >
        <SimpleLineIcons name="logout" size={22} color="#111" />
      </TouchableOpacity>
    </View>
  );
}

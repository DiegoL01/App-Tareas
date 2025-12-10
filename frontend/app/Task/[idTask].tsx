import React, { useState } from "react";
import { View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import EditTask from "../../src/components/EditTask";
import ReadTask from "@/src/components/ReadTask";

export default function TaskDetail() {
	const { idTask } = useLocalSearchParams<{ idTask: string }>();
	const [isRead, setIsRead] = useState(true)
	const router = useRouter();

	if (!idTask) return <View />;

	return (
		<View className="flex-1 bg-gray-100">
			{isRead ? (
				<ReadTask
					id={idTask}
					onDone={() => {
						setIsRead(false);
					}}
				/>
			) : (
				<EditTask
					id={idTask}
					onDone={() => {
						router.back();
					}}
			/>
			)}
		</View>
	);
}

import React, { useMemo, useState } from "react";
import { SafeAreaView, View, Text, TextInput, Button, Platform } from "react-native";
import { WebView } from "react-native-webview";

export default function App() {
  const defaultBaseUrl = useMemo(() => {
    // For Android emulator use 10.0.2.2, for real phone use your PC IP
    if (Platform.OS === "android") return "http://10.0.2.2:3000";
    return "http://localhost:3000";
  }, []);

  const [baseUrl, setBaseUrl] = useState(defaultBaseUrl);
  const [topic, setTopic] = useState("circular motion");
  const [loadTopic, setLoadTopic] = useState("circular motion");

  const url = `${baseUrl}/simulate?topic=${encodeURIComponent(loadTopic)}`;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: 12, gap: 8 }}>
        <Text style={{ fontWeight: "600" }}>SimSchool (Android)</Text>

        <Text>Base URL (for real phone use PC IP like http://192.168.x.x:3000)</Text>
        <TextInput
          value={baseUrl}
          onChangeText={setBaseUrl}
          style={{ borderWidth: 1, padding: 8, borderRadius: 6 }}
          autoCapitalize="none"
        />

        <Text>Topic</Text>
        <TextInput
          value={topic}
          onChangeText={setTopic}
          style={{ borderWidth: 1, padding: 8, borderRadius: 6 }}
        />

        <Button title="Load Simulation" onPress={() => setLoadTopic(topic)} />
      </View>

      <View style={{ flex: 1, borderTopWidth: 1 }}>
        <WebView source={{ uri: url }} />
      </View>
    </SafeAreaView>
  );
}
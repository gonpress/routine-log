import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRoutines } from "../context/RoutineContext";
import type { Routine } from "../types/routine";

export default function NewRoutineScreen() {
  const { t } = useTranslation();
  const { routines, addRoutine, updateRoutine } = useRoutines();
  const { routineId } = useLocalSearchParams<{ routineId: string }>();
  const [title, setTitle] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const isEditing = !!routineId;

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    if (isEditing) {
      const routine = routines.find((r: Routine) => r.id === routineId);
      if (routine) {
        setTitle(routine.title);
      }
    } else {
      setTitle("");
    }
  }, [routineId, routines, isEditing]);

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert(
        t("routines.new.alert.title"),
        t("routines.new.alert.message")
      );
      return;
    }

    if (isEditing) {
      updateRoutine(routineId, {
        title: title.trim(),
        startDate: new Date().toISOString(),
      });
    } else {
      addRoutine({
        title: title.trim(),
        startDate: new Date().toISOString(),
      });
    }
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={
        Platform.OS === "ios" ? 80 : keyboardVisible ? 110 : 0
      }
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.label}>
            {isEditing ? t("routines.new.editTitle") : t("routines.new.title")}
          </Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder={t("routines.new.placeholder")}
            placeholderTextColor="#999"
            autoFocus
          />
          <Text style={styles.description}>
            {t("routines.new.description")}
          </Text>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, !title.trim() && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={!title.trim()}
        >
          <Text style={styles.buttonText}>
            {isEditing
              ? t("routines.new.editButton")
              : t("routines.new.addButton")}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#f8f9fa",
  },
  description: {
    marginTop: 12,
    color: "#666",
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

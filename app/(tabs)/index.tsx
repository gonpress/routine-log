import { useActionSheet } from "@expo/react-native-action-sheet";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import DateSelector from "../components/DateSelector";
import { useRoutines } from "../context/RoutineContext";

export default function DashboardScreen() {
  const { t } = useTranslation();
  const { routines, checkRoutine, uncheckRoutine, deleteRoutine } =
    useRoutines();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const selectedDateString = selectedDate.toISOString().split("T")[0];
  const { showActionSheetWithOptions } = useActionSheet();

  const handleCheckRoutine = (routineId: string) => {
    const routine = routines.find((h) => h.id === routineId);
    if (!routine) return;

    const isChecked = routine.checkDates.includes(selectedDateString);
    if (isChecked) {
      uncheckRoutine(routineId, selectedDateString);
    } else {
      checkRoutine(routineId, selectedDateString);
    }
  };

  const handleDeleteRoutine = (routineId: string) => {
    deleteRoutine(routineId);
  };

  const handleEditRoutine = (routineId: string) => {
    router.push({
      pathname: "/new-routine",
      params: { routineId },
    });
  };

  const showroutineMenu = (routineId: string) => {
    showActionSheetWithOptions(
      {
        options: [
          t("routines.menu.cancel"),
          t("routines.menu.edit"),
          t("routines.menu.delete"),
        ],
        destructiveButtonIndex: 2,
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          handleEditRoutine(routineId);
        } else if (buttonIndex === 2) {
          handleDeleteRoutine(routineId);
        }
      }
    );
  };

  const sortedroutines = [...routines].sort((a, b) => {
    const aChecked = a.checkDates.includes(selectedDateString);
    const bChecked = b.checkDates.includes(selectedDateString);
    if (aChecked === bChecked) return 0;
    return aChecked ? 1 : -1;
  });

  const checkedroutines = routines.filter((routine) =>
    routine.checkDates.includes(selectedDateString)
  ).length;
  const uncheckedroutines = routines.filter(
    (routine) => !routine.checkDates.includes(selectedDateString)
  ).length;

  const handleAddRoutine = () => {
    router.push("/new-routine");
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <DateSelector date={selectedDate} onDateChange={setSelectedDate} />
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>{t("routines.stats.checked")}</Text>
            <Text style={styles.statsNumber}>
              {t("routines.stats.count", { count: checkedroutines })}
            </Text>
          </View>
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>
              {t("routines.stats.unchecked")}
            </Text>
            <Text style={styles.statsNumber}>
              {t("routines.stats.count", { count: uncheckedroutines })}
            </Text>
          </View>
        </View>

        <View style={styles.routinesContainer}>
          {routines.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {t("routines.empty.title")}
                {"\n"}
                {t("routines.empty.subtitle")}
              </Text>
            </View>
          ) : (
            sortedroutines.map((routine) => {
              const isChecked = routine.checkDates.includes(selectedDateString);
              const lastCheckDate =
                routine.checkDates.length > 0
                  ? new Date(
                      routine.checkDates[routine.checkDates.length - 1]
                    ).toLocaleDateString()
                  : null;

              return (
                <View
                  key={routine.id}
                  style={[
                    styles.routineCard,
                    isChecked && styles.routineCardChecked,
                    routine.isCompleted && styles.routineCardCompleted,
                  ]}
                >
                  <Pressable
                    style={({ pressed }) => [
                      styles.routineContent,
                      pressed && styles.routineContentPressed,
                    ]}
                    onPress={() => handleCheckRoutine(routine.id)}
                  >
                    <View style={styles.checkboxContainer}>
                      <View
                        style={[
                          styles.checkbox,
                          isChecked && styles.checkboxChecked,
                          routine.isCompleted && styles.checkboxCompleted,
                        ]}
                      >
                        {isChecked && (
                          <FontAwesome name="check" size={12} color="#fff" />
                        )}
                      </View>
                    </View>
                    <View style={styles.routineInfo}>
                      <Text
                        style={[
                          styles.routineTitle,
                          isChecked && styles.routineTitleChecked,
                          routine.isCompleted && styles.routineTitleCompleted,
                        ]}
                      >
                        {routine.title}
                      </Text>
                      <View style={styles.progressContainer}>
                        <Text
                          style={[
                            styles.streakText,
                            isChecked && styles.streakTextChecked,
                            routine.isCompleted && styles.streakTextCompleted,
                          ]}
                        >
                          {routine.checkDates.length > 0
                            ? t("routines.progress.achieved", {
                                count: routine.checkDates.length,
                              })
                            : t("routines.progress.notStarted")}
                          {routine.isCompleted &&
                            ` (${t("routines.progress.completed")})`}
                        </Text>
                        <View style={styles.progressBar}>
                          <View
                            style={[
                              styles.progressFill,
                              {
                                width: `${Math.min(
                                  (routine.checkDates.length / 66) * 100,
                                  100
                                )}%`,
                              },
                            ]}
                          />
                        </View>
                      </View>
                      {lastCheckDate && (
                        <Text
                          style={[
                            styles.lastCheckDate,
                            isChecked && styles.lastCheckDateChecked,
                            routine.isCompleted &&
                              styles.lastCheckDateCompleted,
                          ]}
                        >
                          {t("routines.progress.lastCheck", {
                            date: lastCheckDate,
                          })}
                        </Text>
                      )}
                    </View>
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [
                      styles.menuButton,
                      pressed && styles.menuButtonPressed,
                    ]}
                    onPress={() => showroutineMenu(routine.id)}
                  >
                    <FontAwesome name="ellipsis-v" size={16} color="#666" />
                  </Pressable>
                </View>
              );
            })
          )}
        </View>
        <View style={styles.bottomSpacing} />
      </ScrollView>
      <View style={styles.fabContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.addButtonPressed,
          ]}
          onPress={handleAddRoutine}
        >
          <FontAwesome name="plus" size={24} color="#fff" />
        </Pressable>
      </View>
    </View>
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
  bottomSpacing: {
    height: 80,
  },
  fabContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    height: 80,
    alignItems: "flex-end",
    justifyContent: "flex-end",
    padding: 20,
    backgroundColor: "transparent",
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  addButtonPressed: {
    transform: [{ scale: 0.95 }],
    shadowOpacity: 0.15,
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  routinesContainer: {
    padding: 20,
    paddingTop: 0,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyStateText: {
    textAlign: "center",
    color: "#666",
    lineHeight: 24,
  },
  routineCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  routineCardChecked: {
    backgroundColor: "#F0F7FF",
  },
  routineCardCompleted: {
    backgroundColor: "#E3F2FD",
  },
  routineContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  routineContentPressed: {
    opacity: 0.7,
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#007AFF",
  },
  checkboxCompleted: {
    backgroundColor: "#2196F3",
    borderColor: "#2196F3",
  },
  routineInfo: {
    flex: 1,
  },
  routineTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  routineTitleChecked: {
    color: "#007AFF",
  },
  routineTitleCompleted: {
    color: "#1976D2",
  },
  progressContainer: {
    marginVertical: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#E9ECEF",
    borderRadius: 2,
    marginTop: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#007AFF",
  },
  streakText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  streakTextChecked: {
    color: "#007AFF",
  },
  streakTextCompleted: {
    color: "#1976D2",
  },
  lastCheckDate: {
    color: "#666",
    fontSize: 12,
    marginBottom: 8,
  },
  lastCheckDateChecked: {
    color: "#007AFF",
  },
  lastCheckDateCompleted: {
    color: "#1976D2",
  },
  menuButton: {
    padding: 8,
    borderRadius: 8,
  },
  menuButtonPressed: {
    backgroundColor: "#f0f0f0",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 0,
  },
  statsCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0.5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 1.5,
    elevation: 1,
  },
  statsTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  statsNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007AFF",
  },
  newroutineButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  newroutineButtonPressed: {
    opacity: 0.8,
  },
  newroutineButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

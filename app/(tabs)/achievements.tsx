import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useRoutines } from "../context/RoutineContext";

type FilterType = "all" | "completed" | "inProgress" | "notStarted";

export default function AchievementsScreen() {
  const { t } = useTranslation();
  const { routines } = useRoutines();
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const totalRoutines = routines.length;
  const completedRoutines = routines.filter(
    (routine) => routine.checkDates.length >= 66
  ).length;
  const inProgressRoutines = routines.filter(
    (routine) => routine.checkDates.length > 0 && routine.checkDates.length < 66
  ).length;
  const notStartedRoutines = routines.filter(
    (routine) => routine.checkDates.length === 0
  ).length;

  // 활성 루틴 달성률 계산 (진행 중인 루틴만 포함)
  const activeRoutines = routines.filter(
    (routine) => routine.checkDates.length > 0 && routine.checkDates.length < 66
  );
  const activeCheckCount = activeRoutines.reduce(
    (sum, routine) => sum + routine.checkDates.length,
    0
  );
  const activePossibleChecks = activeRoutines.length * 66;
  const activeProgress =
    activeRoutines.length > 0
      ? (activeCheckCount / activePossibleChecks) * 100
      : 0;

  const filteredRoutines = routines.filter((routine) => {
    const matchesFilter = (() => {
      switch (filter) {
        case "completed":
          return routine.checkDates.length >= 66;
        case "inProgress":
          return (
            routine.checkDates.length > 0 && routine.checkDates.length < 66
          );
        case "notStarted":
          return routine.checkDates.length === 0;
        default:
          return true;
      }
    })();

    const matchesSearch = routine.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={styles.scrollView}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollViewContent}
        >
          <View style={styles.header}>
            <View style={styles.searchContainer}>
              <FontAwesome
                name="search"
                size={16}
                color="#666"
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder={t("achievements.search.placeholder")}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#999"
              />
              {searchQuery.length > 0 && (
                <Pressable
                  onPress={() => setSearchQuery("")}
                  style={styles.clearButton}
                >
                  <FontAwesome name="times-circle" size={16} color="#666" />
                </Pressable>
              )}
            </View>
          </View>

          <View style={styles.statsContainer}>
            <Pressable
              style={[
                styles.statsCard,
                filter === "all" && styles.statsCardSelected,
              ]}
              onPress={() => setFilter("all")}
            >
              <Text style={styles.statsTitle}>
                {t("achievements.stats.total")}
              </Text>
              <Text style={styles.statsNumber}>
                {t("achievements.stats.count", { count: totalRoutines })}
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.statsCard,
                filter === "completed" && styles.statsCardSelected,
              ]}
              onPress={() => setFilter("completed")}
            >
              <Text style={styles.statsTitle}>
                {t("achievements.stats.completed")}
              </Text>
              <Text style={styles.statsNumber}>
                {t("achievements.stats.count", { count: completedRoutines })}
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.statsCard,
                filter === "inProgress" && styles.statsCardSelected,
              ]}
              onPress={() => setFilter("inProgress")}
            >
              <Text style={styles.statsTitle}>
                {t("achievements.stats.inProgress")}
              </Text>
              <Text style={styles.statsNumber}>
                {t("achievements.stats.count", { count: inProgressRoutines })}
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.statsCard,
                filter === "notStarted" && styles.statsCardSelected,
              ]}
              onPress={() => setFilter("notStarted")}
            >
              <Text style={styles.statsTitle}>
                {t("achievements.stats.notStarted")}
              </Text>
              <Text style={styles.statsNumber}>
                {t("achievements.stats.count", { count: notStartedRoutines })}
              </Text>
            </Pressable>
          </View>

          <View style={styles.progressContainer}>
            <Text style={styles.progressTitle}>
              {t("achievements.progress.title")}
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.min(activeProgress, 100)}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {t("achievements.progress.achieved", {
                percent: Math.round(activeProgress),
              })}
            </Text>
          </View>

          <View style={styles.routinesList}>
            {filteredRoutines.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  {searchQuery
                    ? t("achievements.search.noResults")
                    : t("routines.empty.title")}
                </Text>
              </View>
            ) : (
              filteredRoutines.map((routine) => (
                <View key={routine.id} style={styles.routineCard}>
                  <View style={styles.routineInfo}>
                    <Text style={styles.routineTitle}>{routine.title}</Text>
                    <Text style={styles.routineProgress}>
                      {t("routines.progress.achieved", {
                        count: routine.checkDates.length,
                      })}
                    </Text>
                    {routine.checkDates.length > 0 && (
                      <>
                        <Text style={styles.routineDate}>
                          {t("achievements.routine.startDate", {
                            date: new Date(
                              routine.checkDates[0]
                            ).toLocaleDateString(),
                          })}
                        </Text>
                        <Text style={styles.routineDate}>
                          {t("achievements.routine.expectedEndDate", {
                            date: new Date(
                              new Date(routine.checkDates[0]).getTime() +
                                65 * 24 * 60 * 60 * 1000
                            ).toLocaleDateString(),
                          })}
                        </Text>
                      </>
                    )}
                  </View>
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
              ))
            )}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
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
  scrollViewContent: {
    flexGrow: 1,
  },
  header: {
    padding: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    padding: 0,
  },
  clearButton: {
    padding: 4,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyStateText: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 0,
  },
  statsCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statsCardSelected: {
    backgroundColor: "#F0F7FF",
    borderWidth: 1,
    borderColor: "#007AFF",
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
  progressContainer: {
    padding: 20,
    paddingTop: 0,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E9ECEF",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#007AFF",
  },
  progressText: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
  routinesList: {
    padding: 20,
    paddingTop: 0,
  },
  routineCard: {
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
  routineInfo: {
    marginBottom: 12,
  },
  routineTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  routineProgress: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  routineDate: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
});

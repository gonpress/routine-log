import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface DateSelectorProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

export default function DateSelector({
  date,
  onDateChange,
}: DateSelectorProps) {
  const formattedDate = date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  const handlePrevDay = () => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() - 1);
    onDateChange(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + 1);
    onDateChange(newDate);
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  const isToday = date.toDateString() === new Date().toDateString();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePrevDay} style={styles.button}>
        <FontAwesome name="chevron-left" size={16} color="#007AFF" />
      </TouchableOpacity>

      <TouchableOpacity onPress={handleToday} style={styles.dateContainer}>
        <Text style={[styles.date, isToday && styles.today]}>
          {formattedDate}
        </Text>
        {!isToday && <Text style={styles.todayButton}>오늘로</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={handleNextDay} style={styles.button}>
        <FontAwesome name="chevron-right" size={16} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 8,
    width: "100%",
  },
  button: {
    padding: 8,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  dateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  date: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  today: {
    color: "#007AFF",
    fontWeight: "600",
  },
  todayButton: {
    fontSize: 12,
    color: "#007AFF",
    marginTop: 4,
  },
});

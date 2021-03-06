import React from "react";
import { View, Text, StyleSheet } from "react-native";
import DateHeader from "./DateHeader";
import { getMetricMetaInfo } from "../utils/helpers";
import { gray } from "../utils/colors";

export default function MetricCard({ date, metrics }) {
  return (
    <View>
      {date && <DateHeader date={date} />}
      {Object.keys(metrics).map((metric) => {
        const { getIcon, displayName, unit } = getMetricMetaInfo(metric);

        return (
          <View style={styles.metric} key={metric}>
            <View>{getIcon()}</View>
            <View>
              <Text style={{ fontSize: 20 }}>{displayName}</Text>
              <Text style={{ fontSize: 16, color: gray }}>
                {metrics[metric]} {unit}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  metric: {
    display: "flex",
    flexDirection: "row",
    marginTop: 12,
  },
});

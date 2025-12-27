import React, { useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Switch, FlatList } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { GlobalContext } from '../../context/GlobalState';
import { Plus, Trash2 } from 'lucide-react-native';
import SimpleTimePicker from '../../components/SimpleTimePicker';

const NotificationsPage = ({ navigation }) => {
  const { colors } = useTheme();
  const { notifications, addNotification, editNotification, removeNotification } = useContext(GlobalContext);

  const handleAddNotification = () => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      time: '20:00',
      message: "Remember to review today's transactions.",
      enabled: true,
      recurrence: 'daily',
    };
    addNotification(newNotif);
    Alert.alert('Success', 'Notification added');
  };

  const handleToggle = (notif) => {
    editNotification({ ...notif, enabled: !notif.enabled });
  };

  const handleTimeChange = (notif, newTime) => {
    editNotification({ ...notif, time: newTime });
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure?',
      [
        { text: 'Cancel' },
        {
          text: 'Delete',
          onPress: () => removeNotification(id),
          style: 'destructive',
        },
      ]
    );
  };

  const renderNotification = ({ item }) => (
    <View
      style={[
        styles.notifItem,
        {
          backgroundColor: colors.bgTertiary,
          borderColor: colors.borderColor,
        },
      ]}
    >
      <View style={styles.notifContent}>
        <View style={styles.notifTop}>
          <Text style={[styles.notifTime, { color: colors.textPrimary }]}>
            {item.time}
          </Text>
          <Switch
            value={item.enabled}
            onValueChange={() => handleToggle(item)}
            trackColor={{ false: colors.borderColor, true: colors.accentGreen }}
          />
        </View>
        <Text
          style={[styles.notifMessage, { color: colors.textSecondary }]}
          numberOfLines={2}
        >
          {item.message}
        </Text>
        <Text style={[styles.notifRecurrence, { color: colors.textMuted }]}>
          {item.recurrence || 'daily'}
        </Text>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item.id)}>
        <Trash2 color={colors.accentRed} size={20} />
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.bgPrimary }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        Notifications
      </Text>

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.accentPrimary }]}
        onPress={handleAddNotification}
      >
        <Plus size={20} color="#fff" />
        <Text style={styles.addButtonText}>Add Notification</Text>
      </TouchableOpacity>

      {notifications && notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        />
      ) : (
        <Text style={[styles.emptyText, { color: colors.textMuted }]}>
          No notifications yet
        </Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  notifItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  notifContent: {
    flex: 1,
    marginRight: 12,
  },
  notifTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  notifTime: {
    fontSize: 16,
    fontWeight: '700',
  },
  notifMessage: {
    fontSize: 13,
    marginBottom: 4,
  },
  notifRecurrence: {
    fontSize: 12,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
  },
});

export default NotificationsPage;

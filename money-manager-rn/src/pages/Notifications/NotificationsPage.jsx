import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
  FlatList,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { GlobalContext } from '../../context/GlobalState';
import { Plus, Trash2, X, Save as SaveIcon } from 'lucide-react-native';
import SimpleTimePicker from '../../components/SimpleTimePicker';

const NotificationsPage = ({ navigation }) => {
  const { colors } = useTheme();
  const { notifications, addNotification, editNotification, removeNotification } = useContext(GlobalContext);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    time: '20:00',
    message: "Remember to review today's transactions.",
    recurrence: 'daily',
    enabled: true,
  });

  const handleAddNotification = () => {
    setEditingItem(null);
    setFormData({
      time: '20:00',
      message: "Remember to review today's transactions.",
      recurrence: 'daily',
      enabled: true,
    });
    setModalOpen(true);
  };

  const handleEditNotification = (notif) => {
    setEditingItem(notif);
    setFormData({
      time: notif.time,
      message: notif.message,
      recurrence: notif.recurrence,
      enabled: notif.enabled,
    });
    setModalOpen(true);
  };

  const handleModalSave = () => {
    if (editingItem) {
      editNotification({ ...editingItem, ...formData });
    } else {
      addNotification({
        id: `notif-${Date.now()}`,
        ...formData,
      });
    }
    setEditingItem(null);
    setModalOpen(false);
  };

  const handleToggle = (notif) => {
    editNotification({ ...notif, enabled: !notif.enabled });
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
          {item.recurrence === 'daily' ? 'Daily' : item.recurrence === 'weekly' ? 'Weekly' : 'Monthly'}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => handleEditNotification(item)}
          style={styles.editBtn}
        >
          <Text style={[styles.editText, { color: colors.accentPrimary }]}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
          <Trash2 color={colors.accentRed} size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgPrimary }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header with title and floating add button */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: colors.bgPrimary,
              borderBottomColor: colors.borderColor,
            },
          ]}
        >
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Notifications
          </Text>
          <TouchableOpacity
            style={[
              styles.floatingAddBtn,
              { backgroundColor: colors.accentPrimary },
            ]}
            onPress={handleAddNotification}
            activeOpacity={0.8}
          >
            <Plus size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Notifications List */}
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          {notifications && notifications.length > 0 ? (
            <FlatList
              data={notifications}
              renderItem={renderNotification}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            />
          ) : (
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              No notifications yet. Tap + to add one.
            </Text>
          )}
        </ScrollView>
      </SafeAreaView>

      {/* Modal for Adding/Editing Notification */}
      <Modal
        visible={isModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setModalOpen(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgPrimary }}>
          <View
            style={[
              styles.modalHeader,
              {
                backgroundColor: colors.bgTertiary,
                borderBottomColor: colors.borderColor,
              },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
              {editingItem ? 'Edit Notification' : 'Add Notification'}
            </Text>
            <TouchableOpacity onPress={() => setModalOpen(false)}>
              <X size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalContent}
            contentContainerStyle={{ padding: 16, gap: 16 }}
          >
            {/* Time Picker */}
            <View>
              <Text style={[styles.label, { color: colors.textPrimary }]}>
                Time
              </Text>
              <SimpleTimePicker
                time={formData.time}
                onTimeChange={(time) => setFormData({ ...formData, time })}
              />
            </View>

            {/* Message Display */}
            <View>
              <Text style={[styles.label, { color: colors.textPrimary }]}>
                Message
              </Text>
              <View
                style={[
                  styles.textInput,
                  {
                    backgroundColor: colors.bgTertiary,
                    borderColor: colors.borderColor,
                  },
                ]}
              >
                <Text style={{ color: colors.textPrimary }}>
                  {formData.message}
                </Text>
              </View>
            </View>

            {/* Recurrence Selection */}
            <View>
              <Text style={[styles.label, { color: colors.textPrimary }]}>
                Recurrence
              </Text>
              <View style={styles.recurrenceGroup}>
                {['daily', 'weekly', 'monthly'].map((rec) => (
                  <TouchableOpacity
                    key={rec}
                    style={[
                      styles.recurrenceBtn,
                      {
                        backgroundColor:
                          formData.recurrence === rec
                            ? colors.accentPrimary
                            : colors.bgTertiary,
                        borderColor: colors.borderColor,
                      },
                    ]}
                    onPress={() =>
                      setFormData({ ...formData, recurrence: rec })
                    }
                  >
                    <Text
                      style={{
                        color:
                          formData.recurrence === rec
                            ? '#fff'
                            : colors.textPrimary,
                        fontWeight: '600',
                        textTransform: 'capitalize',
                      }}
                    >
                      {rec}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[
                  styles.modalBtn,
                  {
                    backgroundColor: colors.bgTertiary,
                    borderColor: colors.borderColor,
                    borderWidth: 1,
                  },
                ]}
                onPress={() => setModalOpen(false)}
              >
                <Text style={{ color: colors.textPrimary, fontWeight: '600' }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalBtn,
                  { backgroundColor: colors.accentPrimary },
                ]}
                onPress={handleModalSave}
              >
                <SaveIcon size={18} color="#fff" />
                <Text style={{ color: '#fff', fontWeight: '600' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  floatingAddBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 12,
  },
  editBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  editText: {
    fontWeight: '600',
    fontSize: 12,
  },
  deleteBtn: {
    padding: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  modalContent: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    minHeight: 100,
    justifyContent: 'flex-start',
  },
  recurrenceGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  recurrenceBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 24,
  },
  modalBtn: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});

export default NotificationsPage;

import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { collection, onSnapshot, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { database } from '../config/firebase';

function DeletePopup({ visible, onClose, onDelete }) {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.popupContainer}>
      <Text style={styles.popupText}>Are you sure you want to delete this task?</Text>
      <View style={styles.popupButtonsContainer}>
        <TouchableOpacity style={styles.popupButton} onPress={onDelete}>
          <Text style={styles.popupButtonText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ ...styles.popupButton, backgroundColor: 'blue' }} onPress={onClose}>
          <Text style={styles.popupButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function Tasks({ navigation }) {
  const [tasks, setTasks] = useState([])
  const [selectedTask, setSelectedTask] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(database, 'tasks'), orderBy('CreatedAt', 'asc')),
      (snapshot) => {
        const tasksData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(tasksData);
      }
    );
    return unsub;
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TaskCreator')}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  async function deleteTask(taskId) {
    try {
      await deleteDoc(doc(database, 'tasks', taskId));
      console.log('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <View style={styles.textContainer}>
            <TouchableOpacity onPress={() => {
              navigation.navigate('TaskEditor', { task: item })
            }}>
              <Text style={styles.itemText}>{item.Title}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.itemButton} onPress={() => {
              setSelectedTask(item);
              setPopupVisible(true);
            }}>
              <Text style={styles.itemButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <StatusBar style="auto" />
      <DeletePopup
        visible={popupVisible}
        onClose={() => setPopupVisible(false)}
        onDelete={() => {
          deleteTask(selectedTask.id)
          setPopupVisible(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  button: {
    height: 40,
    width: 40,
    marginRight: 5,
    backgroundColor: '#eaeaea',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#333',
    fontSize: 35,
    bottom: 5,
  },
  textContainer: {
    marginBottom: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderColor: 'lightgrey',
    borderBottomWidth: 1,
    marginRight: 10,
    marginLeft: 10
  },
  itemText: {
    fontSize: 18,
  },
  itemButton: {
    position: 'absolute',
    top: 5,
    right: 0,
    backgroundColor: '#DC143C',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 35,
  },
  itemButtonText: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 16,
  },
  popupContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  popupText: {
    fontSize: 18,
    marginBottom: 20,
  },
  popupButtonsContainer: {
    flexDirection: 'row',
  },
  popupButton: {
    backgroundColor: '#DC143C',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 35,
    marginHorizontal: 10,
  },
  popupButtonText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 16,
  },
});
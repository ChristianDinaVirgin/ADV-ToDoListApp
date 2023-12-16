import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, ImageBackground, Modal } from 'react-native';
import { getDatabase, ref, push, remove, set, onChildAdded, off } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../Firebase/firebase';

export default function ToDoList() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskDescription, setEditTaskDescription] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [taskChecked, setTaskChecked] = useState({});
  const [userId, setUserId] = useState(null);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const database = getDatabase(app);
  const auth = getAuth();

  useEffect(() => {
    const tasksRef = ref(database, `users/${userId}/tasks`);

    onChildAdded(tasksRef, (snapshot) => {
      const task = snapshot.val();
      setTasks((prevTasks) => [
        ...prevTasks,
        { id: snapshot.key, ...task },
      ]);
    });

    return () => {
      off(tasksRef, 'child_added');
    };
  }, [userId]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [auth]);

  const handleAddTask = () => {
    if (task.trim() === '') {
      return;
    }
  
    const newTask = {
      description: task,
      status: 0,
    };
  
    const newTaskRef = push(ref(database, `users/${userId}/tasks`), newTask);
  
    setTask('');
    setRefresh((prevRefresh) => !prevRefresh);
  };

  const handleEditTask = () => {
    if (editTaskDescription.trim() === '') {
      return;
    }
  
    const taskRef = ref(database, `users/${userId}/tasks/${editTaskId}`);
    set(taskRef, { description: editTaskDescription, status: taskChecked[editTaskId] ? 1 : 0 })
      .then(() => {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === editTaskId
              ? { ...task, description: editTaskDescription, status: taskChecked[editTaskId] ? 1 : 0 }
              : task
          )
        );
  
        setEditTaskId(null);
        setEditTaskDescription('');
        setModalVisible(false);
      })
      .catch((error) => {
        console.error('Error updating task:', error);
      });
  };

  const handleDeleteTask = (taskId) => {
    setDeleteTaskId(taskId);
    setDeleteConfirmationVisible(true);
  };

  const confirmDelete = () => {
    if (deleteTaskId !== null && deleteTaskId !== undefined) {
      const taskRef = ref(database, `users/${userId}/tasks/${deleteTaskId}`);
      remove(taskRef);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== deleteTaskId));
      setTaskChecked((prevChecked) => {
        const { [deleteTaskId]: deletedTask, ...rest } = prevChecked;
        return rest;
      });
      setDeleteTaskId(null);
    }
    setDeleteConfirmationVisible(false);
  };
  
  const cancelDelete = () => {
    setDeleteTaskId(null);
    setDeleteConfirmationVisible(false);
  };

  const handleExit = () => {
    router.replace('/HomePage'); 
  };

  const openEditModal = (taskId, taskDescription) => {
    setEditTaskId(taskId);
    setEditTaskDescription(taskDescription);
    setModalVisible(true);
  };

  const closeEditModal = () => {
    setEditTaskId(null);
    setEditTaskDescription('');
    setModalVisible(false);
  };

  return (
    <ImageBackground
      source={{
        uri:
          'https://scontent.fdvo4-1.fna.fbcdn.net/v/t1.15752-9/377241562_868391151699221_5446282403854734404_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeGiINpwHk2LIIorG3IMjM1XwPuzx-o5kUTA-7PH6jmRRJhqspM2zB4I83XWBTn0WAe1QGgiustMNEKf-YQx5psF&_nc_ohc=n5Ud94yoRTgAX9hF4qN&_nc_ht=scontent.fdvo4-1.fna&oh=03_AdRPxhbmIwkSf50gIjoVQALgOv_qJQjwmmLkBm0Q-Kujyg&oe=659F5F64',
      }}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay} />
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <Text style={styles.textTitle}>Add Task</Text>
            <TextInput
              style={styles.inputText}
              value={task}
              onChangeText={(text) => setTask(text)}
            />

            <TouchableOpacity onPress={handleAddTask} style={styles.addTask}>
              <Text style={styles.addTaskText}>Add Task</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleExit} style={styles.addTask}>
              <Text style={styles.addTaskText}>EXIT</Text> 
            </TouchableOpacity>
          </View>

          <View style={styles.taskListContainer}>
            {tasks.map((task) => (
              <View key={task.id} style={styles.taskContainer}>
              <TouchableOpacity
                onPress={() => {
                  const newChecked = !taskChecked[task.id];
                  const taskRef = ref(database, `users/${userId}/tasks/${task.id}`);
                  set(taskRef, { description: task.description, status: newChecked ? 1 : 0 });
                  setTaskChecked((prevChecked) => ({
                    ...prevChecked,
                    [task.id]: newChecked,
                  }));
                }}
                style={styles.checkboxContainer}
              >
                <View style={styles.checkbox}>
                  {taskChecked[task.id] && <View style={styles.checkboxInner}></View>}
                </View>
              </TouchableOpacity>
              {task.id === editTaskId ? (
                <TextInput
                  style={styles.taskText}
                  value={editTaskDescription}
                  onChangeText={(text) => setEditTaskDescription(text)}
                />
              ) : (
                <Text style={styles.taskText}>{task.description}</Text>
              )}
              <TouchableOpacity
                onPress={() => openEditModal(task.id, task.description)}
                style={styles.editTask}
              >
                <Text style={styles.editTaskText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteTask(task.id)}
                style={styles.deleteTask}
              >
                <Text style={styles.deleteTaskText}>Delete</Text>
              </TouchableOpacity>
            </View>  
            ))}
          </View>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeEditModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <TextInput
              style={styles.modalInputText}
              value={editTaskDescription}
              onChangeText={(text) => setEditTaskDescription(text)}
            />
            <TouchableOpacity onPress={handleEditTask} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeEditModal} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteConfirmationVisible}
        onRequestClose={cancelDelete}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>Are you sure you want to delete this task?</Text>
            <TouchableOpacity onPress={confirmDelete} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={cancelDelete} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30, 
   
    
  },

  inputContainer: {
    width: '80%',
    padding: 20,
    borderWidth: 3, 
    borderColor: '#4d5f94',
    borderRadius: 25, 
    backgroundColor: 'white',
  },

  inputText: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    
    
  },

  addTask: {
    backgroundColor: '#4d5f94',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    borderRadius: 25,
  },

  textTitle: {
    fontWeight: "bold",
    paddingBottom: 10,
    textTransform: 'uppercase',
  },

  modalText: {
    color: '#4d5f94',
    fontWeight: 'bold',
    marginBottom: 20,
    fontSize: 15,
  },

  addTaskText: {
    color: 'white',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },

  taskListContainer: {
    width: '80%',
    marginTop: 10,
    borderRadius: 25,  
  },

  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: 'white', 
    borderWidth: 3,
    borderColor: "#4d5f94", 
    borderRadius: 25,
  },

  taskText: {
    flex: 1,
    width: '100%',
    padding: 10, 
  }, 

  deleteTask: {
    backgroundColor: '#8a92c1',
    height: 30,
    width: 50,
    marginLeft: 5,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },

  deleteTaskText: {
    color: 'white',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: 8, 
  },

  editTask: {
    backgroundColor: '#4d5f94',
    height: 30,
    width: 50,  
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },

  editTaskText: {
    color: 'white',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: 8,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalBox: {
    width: '80%',
    borderWidth: 3,
    borderColor: 'white',
    borderRadius:25,
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  

  modalInputText: {
    borderWidth: 1,
    width: '100%', 
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10, 
    backgroundColor: 'white',
  },

  modalButton: {
    backgroundColor: '#4d5f94',
    width: '100%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    borderRadius: 25,
  },

  modalButtonText: {
    color: 'white',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },

  checkboxContainer: {
    marginLeft: 10 
  },

  checkbox: {
    width: 15,
    height: 15,
    borderColor: 'black',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkboxInner: {
    width: 10,
    height: 10,
    backgroundColor: '#4d5f94',
  }, 
 
});
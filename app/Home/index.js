import React, { useEffect, useState } from 'react';
import { View, Button, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TaskList from '../../components/TaskList';
import TaskModal from '../../components/TaskModal';
import { useNavigation } from '@react-navigation/native';

const STORAGE_KEY = '@tasks';

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState("");  
  const [isModalVisible, setModalVisible] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [username, setUsername] = useState("");
  const [completedTasks, setCompletedTasks] = useState(0);
  const navigation = useNavigation();

  const fetchUserData = async () => {
    try {
      const user = await AsyncStorage.getItem("usuario");
      if (user) {
        const { nome } = JSON.parse(user);
        setUsername(nome);
      }
    } catch (error) {
      console.log("Erro ao recuperar nome de usuário:", error);
    }
  };

  const loadTasks = async () => {
    try {
      const jsonTasks = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonTasks) {
        const taskList = JSON.parse(jsonTasks);
        const validatedTasks = taskList.map(task => ({
          ...task,
          creationDate: task.creationDate || new Date().toISOString()
        }));
        setTasks(validatedTasks);
        const completedCount = validatedTasks.filter(task => task.completed).length;
        setCompletedTasks(completedCount);
      }
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
    }
  };

  useEffect(() => {
    loadTasks();
    fetchUserData();
  }, []);

  const saveTasks = async (tasks) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error(error);
    }
  };

  const addTask = () => {
    if (newTaskText.trim() === "") {
      alert("Por favor, insira uma tarefa.");
      return;
    }

    const newTasks = [...tasks, {
      id: Date.now().toString(),
      text: newTaskText,  
      completed: false,
      creationDate: new Date().toISOString()
    }];

    setTasks(newTasks);
    saveTasks(newTasks);
    setNewTaskText("");  
  };

  const toggleTaskCompletion = (id) => {
    const newTasks = tasks.map(task => (task.id === id ? { ...task, completed: !task.completed } : task));
    setTasks(newTasks);
    saveTasks(newTasks);
    const completedCount = newTasks.filter(task => task.completed).length;
    setCompletedTasks(completedCount);
  };

  const deleteTask = (id) => {
    const newTasks = tasks.filter(task => task.id !== id);
    setTasks(newTasks);
    saveTasks(newTasks);
    alert('Task deletada.')
  };

  const openEditModal = (task) => {
    setTaskToEdit(task);
    setModalVisible(true);
  };

  const editTask = (id, updatedText) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, text: updatedText } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setTaskToEdit(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerText}>
      <Text style={styles.usernameText}>Olá, {username}!</Text>

      </View>

      <Text style={{fontWeight:500, fontSize:20, paddingTop:20}}>Cadastrar uma tarefa:</Text>

<View style={styles.contentSave} >
      <TextInput
        style={styles.input}
         value={newTaskText}
        onChangeText={setNewTaskText}
      />

      <TouchableOpacity style={styles.addButton} onPress={addTask}>
        <Text style={styles.addButtonText}>Salvar</Text>
      </TouchableOpacity>
      </View>
      <TaskList 
      
        tasks={tasks} 
        toggleTaskCompletion={toggleTaskCompletion} 
        deleteTask={deleteTask} 
        openEditModal={openEditModal} 
      />
      
      <TaskModal
    
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onAddTask={addTask}
        onEditTask={editTask}  
        taskToEdit={taskToEdit}
      />
      <View style={styles.taskSummary}>
        <TouchableOpacity style={styles.summaryCardCadastradas} onPress={() => navigation.navigate('RegisteredTasksScreen', { tasks, setTasks })}>
          <Text style={styles.summaryText}> Cadastradas</Text>
          <Text style={styles.summaryCount}>{tasks.length}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.summaryCard} onPress={() => navigation.navigate('CompletedTasks', { tasks })}>
          <Text style={styles.summaryText}> Concluídas</Text>
          <Text style={styles.summaryCount}>{completedTasks}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  containerText: {
    justifyContent: 'center',
    alignItems: 'center',  
    backgroundColor: '#f0f0f0',
    marginBottom: 20,  
    width: '100%', 
  },

  contentSave: {
    display: 'flex',
    flexDirection: 'row', 
    width: '100%', 
    justifyContent: 'center',
    alignItems: 'center', 
    backgroundColor: '#fff',  
    padding:5,
    borderRadius:10
  },
  
  taskSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  summaryCardCadastradas: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  input: {
    flex: 1,  
    borderColor: 'transparent',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginRight: 10, 
  },
  summaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryCount: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 5,
  },
 
  
  addButton: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100, 
    height: 50,  
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  usernameText: {
    marginTop: 20,
    fontSize: 18,
    color: '#333',
    textAlign: 'center', 
  },
  
});

export default Home;

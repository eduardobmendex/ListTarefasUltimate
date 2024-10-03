import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CompletedTasksScreen = ({ route, navigation }) => {
  const { tasks } = route.params;  
  const completedTasks = tasks.filter(task => task.completed);  

 

  const renderTask = ({ item }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
       <Text style={styles.countText}>Total: {completedTasks.length}</Text>

      <FlatList
        data={completedTasks}
        renderItem={renderTask}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'start',
  },
  countText: {
    fontSize: 18,
    color: '#555',
    textAlign: 'start',
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  taskItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  taskText: {
    color: 'black',
    fontSize: 16,
  },
  removeButton: {
    backgroundColor: '#ff4d4d',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CompletedTasksScreen;

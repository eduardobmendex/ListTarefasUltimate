import React from 'react';
import { View, Text, StyleSheet, Button, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import Checkbox from 'expo-checkbox';

const TaskList = ({ tasks, toggleTaskCompletion, deleteTask, openEditModal }) => {
  
const color = '#D91414'
  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}  
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {tasks.map(task => (
          <View key={task.id} style={styles.taskItem}>
            <Checkbox
              value={task.completed}
              onValueChange={() => toggleTaskCompletion(task.id)}
              color={task.completed ? '#4CAF50' : undefined}  
            />
            <View style={styles.taskDetails}>
              <Text style={{ textDecorationLine: task.completed ? 'line-through' : 'none' }}>
                {task.text}
              </Text>
         
            </View>
            <View style={styles.buttonsContainer}>
              <Button    title="Editar" onPress={() => openEditModal(task)} />
              <Button title="Deletar" onPress={() => deleteTask(task.id)} color={color} />
            </View>
          </View>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,  
    paddingVertical: 10,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  taskDetails: {
    flex: 1,
    paddingLeft: 10,
  },
  daysOpenText: {
    marginTop: 5,
    color: '#666',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
 
});

export default TaskList;

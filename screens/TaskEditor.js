import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { updateDoc, doc } from 'firebase/firestore';
import { database } from '../config/firebase';

export default function TasksEditor({ navigation, route }) {
    const [task, setTask] = useState(route.params.task)

    const updateTaskInFirestore = async (task) => {
        const newTask = {
            Title: task.Title,
            Description: task.Description,
            CreatedAt: task.CreatedAt
        };
        await updateDoc(doc(database, 'tasks', task.id), newTask);
        console.log('Document updated with ID: ', task.id);
    };

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={styles.button} onPress={() => updateTaskInFirestore(task)}>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation, task]);


    return (
        <View style={styles.container}>
            <TextInput
                style={styles.textInput}
                value={task.Title}
                placeholder='Title'
                onChangeText={(text) => {
                    setTask({ ...task, Title: text })
                }}
            />
            <TextInput
                style={styles.textInput}
                value={task.Description}
                placeholder='Description'
                multiline={true}
                onChangeText={(text) => {
                    setTask({ ...task, Description: text })
                }}
            />
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    textInput: {
        marginVertical: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    button: {
        marginRight: 1,
        borderRadius: 5,
        paddingHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'blue',
        fontSize: 20,
    },
});
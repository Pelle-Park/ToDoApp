import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { database } from '../config/firebase';

export default function TasksEditor({ navigation }) {
    const [task, setTask] = useState({Title: '', Description: ''})

    const saveTaskToFirestore = async (task) => {
        const newTask = {
            Title: task.Title,
            Description: task.Description,
            CreatedAt: new Date()
        };
        const docRef = await addDoc(collection(database, 'tasks'), newTask);
        console.log('Document written with ID: ', docRef.id);
    };

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={styles.button} onPress={() => saveTaskToFirestore(task)}>
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
                multiline={true}
                placeholder='Description'
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
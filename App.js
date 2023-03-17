import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Tasks from "./screens/Tasks";
import TasksEditor from './screens/TaskEditor';
import TaskCreator from './screens/TaskCreator'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Tasks">
        <Stack.Screen name="Tasks" component={Tasks} />
        <Stack.Screen name='TaskEditor' component={TasksEditor} />
        <Stack.Screen name='TaskCreator' component={TaskCreator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

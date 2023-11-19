import { Welcome, SignIn, SignUp, ForgotPassword, } from './Screens/index'
import BottomHome from './Screens/BottomHome'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import ScreenName from './controllers/ScreenName'

const Stack = createStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={ScreenName.welcome} screenOptions={{ headerShown: false }}>
        <Stack.Screen name={ScreenName.welcome} component={Welcome} />
        <Stack.Screen name={ScreenName.signIn} component={SignIn} />
        <Stack.Screen name={ScreenName.signUp} component={SignUp} />
        <Stack.Screen name={ScreenName.forgotPassword} component={ForgotPassword} />
        <Stack.Screen name={ScreenName.bottomApp} component={BottomHome} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

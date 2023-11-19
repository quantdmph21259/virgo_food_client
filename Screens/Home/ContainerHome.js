import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from './Home'
import DetailsUser from './DetailsUser'
import DetailsProduct from './DetailsProduct'
import ScreenName from '../../controllers/ScreenName'

const ContainerHome = () => {

    const Stack = createStackNavigator()

    return (
        <Stack.Navigator initialRouteName={ScreenName.homeScreen} screenOptions={{ headerShown: false, gestureEnable: true }} >
            <Stack.Screen name={ScreenName.homeScreen} component={HomeScreen} />
            <Stack.Screen name={ScreenName.detailsUserScreenHome} component={DetailsUser} />
            <Stack.Screen name={ScreenName.detailsProductScreenHome} component={DetailsProduct} />
        </Stack.Navigator>
    )
}

export default ContainerHome
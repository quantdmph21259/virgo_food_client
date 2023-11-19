import React from 'react'
import CategoryScreen from './Main'
import DetailsCategory from './DetailsCategory'
import { createStackNavigator } from '@react-navigation/stack'
import ScreenName from '../../controllers/ScreenName'

const ContainerCategory = () => {

    const Stack = createStackNavigator()

    return (
        <Stack.Navigator initialRouteName={ScreenName.categoryScreen} screenOptions={{ headerShown: false }}>
            <Stack.Screen name={ScreenName.categoryScreen} component={CategoryScreen} />
            <Stack.Screen name={ScreenName.detailsCategoryScreen} component={DetailsCategory} />
        </Stack.Navigator>
    )
}

export default ContainerCategory
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import Home from '../screens/Home'
import Medicoes from '../screens/Medicoes'
import AdicionaMedicao from '../screens/AdicionaMedicao'

const Stack = createStackNavigator()

export default function Navigation(){
    return(

        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={Home}/>
                <Stack.Screen name="Medições" component={Medicoes}/>
                <Stack.Screen name="AdicionaMedicao" component={AdicionaMedicao} option={{headerShown: false}}/>
            </Stack.Navigator>
        </NavigationContainer>

    )
}
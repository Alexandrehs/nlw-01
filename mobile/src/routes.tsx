import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './pages/Home';
import Points from './pages/Points';
import Details from './pages/Details';

const AppStack = createStackNavigator();

const Routes = () => {
    return(
        <NavigationContainer>
            <AppStack.Navigator
                headerMode="none"
                screenOptions={{
                    cardStyle:{
                        backgroundColor: '#f0f0f5'
                    }
                }}
            >
                <AppStack.Screen component={Home} name="Home" />
                <AppStack.Screen component={Points} name="Points" />
                <AppStack.Screen component={Details} name="Details" />
            </AppStack.Navigator>
        </NavigationContainer>
    );
}

export default Routes;

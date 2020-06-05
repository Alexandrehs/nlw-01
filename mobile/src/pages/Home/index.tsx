import React, { useState, useEffect } from 'react';
import { View, Image, Text, ImageBackground, StyleSheet, KeyboardAvoidingView, Platform, Picker } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';

interface IBGEResponse {
    sigla: string;
}

interface IBGECITYResponse {
    nome: string;
}

const Home = () => {   
    const [uf, setUf] = useState<IBGEResponse[]>([]);
    const [city, setCity] = useState<IBGECITYResponse[]>([]);

    const [selectedUf, setSelectedUf] = useState<string>('0');
    const [selectedCity, setSelectedCity] = useState<string>('0');

    const navigation = useNavigation();
    const route = useRoute();

    useEffect(() => {
        axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome').then(response => {
            setUf(response.data);
        })
    }, []);

     useEffect(() => {
         axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/distritos?orderBy=nome`)
             .then(response => {
                 setCity(response.data);
             })
     }, [selectedUf]);

    function handleNavigateToPoints() {
        navigation.navigate('Points', {
            uf : selectedUf,
            city: selectedCity

        });
    }

    return(
        <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : undefined} style={{flex: 1}}>
            <ImageBackground 
                source={require('../../assets/home-background.png')} 
                style={styles.container}
                imageStyle={{width: 275, height: 368}}
            >
                
                <View style={styles.main}>
                    <Image source={require('../../assets/logo.png')} />
                    <View>
                        <Text style={styles.title}>Seu Marketplace de coleta de resíduos.</Text>
                        <Text style={styles.description}>
                            Ajudamos as pessoas a encontrarem de forma eficientes pontos de coleta de resíduos.
                        </Text>
                    </View>
                </View>

                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={selectedUf}
                        onValueChange={(itemValue) => setSelectedUf(itemValue)}
                        style={styles.picker}
                    >
                        {
                            uf.map(item => (
                                <Picker.Item key={String(item.sigla)} label={item.sigla} value={item.sigla} />
                            ))
                        }
                    </Picker>

                    <Picker
                        selectedValue={selectedCity}
                        onValueChange={(itemValue) => setSelectedCity(itemValue)}
                        style={styles.picker}
                    >
                        {
                            city.map(item => (
                                <Picker.Item key={String(item.nome)} label={item.nome} value={item.nome} />
                            ))
                        }
                    </Picker>
                </View>

                <View style={styles.footer}>
                    <RectButton style={styles.button} onPress={handleNavigateToPoints}>
                        <View style={styles.buttonIcon}>
                            <Text>
                                <Icon name="arrow-right" size={24} color="#fff" />
                            </Text>
                        </View>
                        <Text style={styles.buttonText}>
                            Entrar
                        </Text>
                    </RectButton>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>    
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
    },
  
    main: {
        flex: 1,
        justifyContent: 'center',
    },
  
    title: {
        color: '#322153',
        fontSize: 32,
        fontFamily: 'Ubuntu_700Bold',
        maxWidth: 260,
        marginTop: 64,
    },
  
    description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 16,
        fontFamily: 'Roboto_400Regular',
        maxWidth: 260,
        lineHeight: 24,
    },
    
    pickerContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },

    footer: {},
  
    select: {},
  
    input: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
    },
  
    button: {
        backgroundColor: '#34CB79',
        height: 60,
        flexDirection: 'row',
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        marginTop: 8,
    },
  
    buttonIcon: {
        height: 60,
        width: 60,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center'
    },
  
    buttonText: {
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center',
        color: '#FFF',
        fontFamily: 'Roboto_500Medium',
        fontSize: 16,
    },

    picker: {
        width: 100,
        height: 40
    }
});
export default Home;
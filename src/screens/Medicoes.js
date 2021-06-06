import React, {useState, useEffect} from 'react'
import {View, Text, ActivityIndicator, StyleSheet, FlatList, RefreshControl} from 'react-native'
import {withTheme, List, Avatar} from 'react-native-paper'
import Medicao from './Medicao'
import {BACKEND} from '../constants'

export default function Medicoes({data, navigation}){
    
    const [medicoes, setMedicoes] = useState([])
    
    const [carregando, setCarregando] = useState(false)

    const [refreshing, setRefreshing] = useState(false)


    useEffect(() => {
        obterMedicoes()
    },[])


    async function obterMedicoes(){
        setCarregando(true)

        let url = `${BACKEND}/medicoes`

        await fetch(url)
        .then(response => response.json())
        .then(data => {
            setMedicoes(data)
            console.log("Medidas obtidas com sucesso!")
        })
        .catch(function (error){
            console.error(`Não foi possivel obter as medidas: ${error.message}`)
        })
        setCarregando(false)
    }


    const onRefresh = React.useCallback(async () => {
        setRefreshing(true)

        try{
            await obterMedicoes()
        }catch (error){
            console.error(error)
        }

        setRefreshing(false)
    },[refreshing])

    return(
        <View style={{backgroundColor: "#12ffcd", paddingHorizontal: 10, paddingVertical: 20, flex: 1}}>
            <List.Subheader>
                <Avatar.Icon icon="refresh" size={24}/> Para atualizar a lista!
            </List.Subheader>
            
            {carregando && <ActivityIndicator size="large" color="#02abc3"/>}
            {medicoes.length === 0 && !carregando ? (
                <View style={styles.Aviso}>
                    <Text style={styles.Titulo}>Não nenhum registro ainda!</Text>
                </View>
            ): (
                <FlatList
                    data={medicoes}
                    renderItem={({item}) => (
                        <Medicao data={item} navigation={navigation}/>
                    )}
                    keyExtractor={item => item._id.toString()}
                    refreshControl={<RefreshControl refreshing={refreshing}
                    onRefresh={onRefresh}/>
                }
                />        
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    Aviso: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    Titulo:{
        fontSize: 20
    }
}
    
)
